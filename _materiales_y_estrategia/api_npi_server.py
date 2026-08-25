#!/usr/bin/env python3
"""
High Performance NPI Search, Advanced Filtering, Batched CSV and ZIP Export API Server for CIASA CRM
Zero external dependencies, purely native Python (http.server + sqlite3 + csv + json + zipfile).
"""

import http.server
import socketserver
import urllib.parse
import sqlite3
import json
import os
import io
import csv
import zipfile

PORT = 8085
BASE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'datos', 'npi_marketing.db')
PUBLIC_DIR = os.path.join(BASE_ROOT, 'sitio-web')

def get_db_connection():
    conn = sqlite3.connect(f'file:{DB_PATH}?mode=ro', uri=True, timeout=10.0)
    conn.row_factory = sqlite3.Row
    return conn

class NPIRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path.startswith('/api/'):
            if path == '/api/npi/states':
                self.handle_get_states()
                return
            elif path == '/api/npi/specialties':
                self.handle_get_specialties()
                return
            elif path == '/api/npi/search':
                self.handle_search(query)
                return
            elif path == '/api/npi/export':
                self.handle_export(query)
                return
            elif path == '/api/npi/export_zip':
                self.handle_export_zip(query)
                return
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.set_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Endpoint not found'}).encode('utf-8'))
                return

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path in ('/api/npi/export', '/api/npi/export_zip'):
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len).decode('utf-8')
            try:
                data = json.loads(post_body)
            except Exception:
                data = {}
            if path == '/api/npi/export_zip':
                self.handle_post_export_zip(data)
            else:
                self.handle_post_export(data)
            return

        self.send_response(404)
        self.end_headers()

    def set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self.set_cors_headers()
        self.end_headers()

    def handle_get_states(self):
        if not os.path.exists(DB_PATH):
            self.send_response(503)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Database still processing'}).encode('utf-8'))
            return

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute('''
            SELECT state, 
                   COALESCE(state_name, state) as state_name,
                   total_providers, latino_providers, with_phone, with_email 
            FROM state_counts 
            WHERE state != '' AND state IS NOT NULL 
            ORDER BY total_providers DESC
            ''')
            rows = cursor.fetchall()
            states = [dict(r) for r in rows]

            cursor.execute('SELECT COUNT(*) as total FROM providers')
            total_all = cursor.fetchone()['total']

            cursor.execute('SELECT COUNT(*) as total_latinos FROM providers WHERE is_latino = 1')
            total_latinos = cursor.fetchone()['total_latinos']

            response_data = {
                'total_providers': total_all,
                'total_latinos': total_latinos,
                'states': states
            }
            conn.close()

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

        except Exception as e:
            conn.close()
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

    def handle_get_specialties(self):
        if not os.path.exists(DB_PATH):
            self.send_response(503)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Database not ready'}).encode('utf-8'))
            return

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute('''
            SELECT specialty, COUNT(*) as count 
            FROM providers 
            WHERE specialty IS NOT NULL AND specialty != '' 
            GROUP BY specialty 
            ORDER BY count DESC
            ''')
            rows = cursor.fetchall()
            specialties = [dict(r) for r in rows]
            conn.close()

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'specialties': specialties}).encode('utf-8'))

        except Exception as e:
            conn.close()
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

    def build_query_filter(self, state, quintile, specialty, entity_type, latino_only, has_phone, has_email, city, zip_code, q):
        where_clauses = []
        params = []

        if state and state != 'ALL':
            where_clauses.append('state = ?')
            params.append(state)
        if quintile and quintile != 'ALL' and str(quintile).isdigit():
            where_clauses.append('income_quintile = ?')
            params.append(int(quintile))
        if specialty and specialty != 'ALL':
            where_clauses.append('specialty = ?')
            params.append(specialty)
        if entity_type and entity_type in ('1', '2'):
            where_clauses.append('entity_type = ?')
            params.append(entity_type)
        if latino_only:
            where_clauses.append('is_latino = 1')
        if has_phone:
            where_clauses.append('has_phone = 1')
        if has_email:
            where_clauses.append('has_email = 1')
        if city:
            where_clauses.append('city LIKE ?')
            params.append(f'%{city}%')
        if zip_code:
            where_clauses.append('zip LIKE ?')
            params.append(f'{zip_code}%')
        if q:
            where_clauses.append('(npi LIKE ? OR name LIKE ? OR city LIKE ? OR credentials LIKE ? OR specialty LIKE ?)')
            kw = f'%{q}%'
            params.extend([kw, kw, kw, kw, kw])

        where_sql = ' AND '.join(where_clauses) if where_clauses else '1=1'
        return where_sql, params

    def handle_search(self, query):
        if not os.path.exists(DB_PATH):
            self.send_response(503)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Database not ready'}).encode('utf-8'))
            return

        state = query.get('state', [''])[0].strip().upper()
        quintile = query.get('quintile', [''])[0].strip()
        specialty = query.get('specialty', [''])[0].strip()
        entity_type = query.get('entity_type', [''])[0].strip()
        latino_only = query.get('latino_only', ['0'])[0].strip() == '1'
        has_phone = query.get('has_phone', ['0'])[0].strip() == '1'
        has_email = query.get('has_email', ['0'])[0].strip() == '1'
        city = query.get('city', [''])[0].strip().upper()
        zip_code = query.get('zip', [''])[0].strip()
        q = query.get('q', [''])[0].strip()
        page = max(1, int(query.get('page', ['1'])[0]))
        limit = min(500, max(10, int(query.get('limit', ['100'])[0])))
        offset = (page - 1) * limit

        where_sql, params = self.build_query_filter(state, quintile, specialty, entity_type, latino_only, has_phone, has_email, city, zip_code, q)

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            count_sql = f'SELECT COUNT(*) as count FROM providers WHERE {where_sql}'
            cursor.execute(count_sql, params)
            total_matching = cursor.fetchone()['count']

            query_sql = f'''
            SELECT id, npi, entity_type, name, first_name, last_name, credentials,
                   address, city, state, zip, phone, email, taxonomy, specialty,
                   is_latino, income_quintile, has_email, has_phone
            FROM providers 
            WHERE {where_sql}
            ORDER BY id ASC
            LIMIT ? OFFSET ?
            '''
            cursor.execute(query_sql, params + [limit, offset])
            rows = cursor.fetchall()
            providers = [dict(r) for r in rows]
            conn.close()

            res = {
                'success': True,
                'page': page,
                'limit': limit,
                'total_matching': total_matching,
                'total_pages': (total_matching + limit - 1) // limit if total_matching > 0 else 1,
                'providers': providers
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))

        except Exception as e:
            conn.close()
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

    def handle_export(self, query):
        state = query.get('state', [''])[0].strip().upper()
        quintile = query.get('quintile', [''])[0].strip()
        specialty = query.get('specialty', [''])[0].strip()
        entity_type = query.get('entity_type', [''])[0].strip()
        latino_only = query.get('latino_only', ['0'])[0].strip() == '1'
        has_phone = query.get('has_phone', ['0'])[0].strip() == '1'
        has_email = query.get('has_email', ['0'])[0].strip() == '1'
        city = query.get('city', [''])[0].strip().upper()
        zip_code = query.get('zip', [''])[0].strip()
        q = query.get('q', [''])[0].strip()
        
        page = max(1, int(query.get('page', ['1'])[0]))
        limit = min(50000, max(1, int(query.get('limit', ['10000'])[0])))
        offset = (page - 1) * limit

        where_sql, params = self.build_query_filter(state, quintile, specialty, entity_type, latino_only, has_phone, has_email, city, zip_code, q)
        
        filename = f"leads_npi_{state or 'ALL'}_lote_{page}.csv" if page > 1 or limit < 10000 else "leads_npi_ciasard.csv"
        self.stream_csv_export(where_sql, params, limit, offset, filename)

    def handle_post_export(self, data):
        selected_npis = data.get('npis', [])
        if selected_npis:
            placeholders = ','.join(['?'] * len(selected_npis))
            where_sql = f'npi IN ({placeholders})'
            params = selected_npis
            self.stream_csv_export(where_sql, params, len(selected_npis), 0, "leads_npi_seleccionados.csv")
        else:
            state = data.get('state', '').strip().upper()
            quintile = str(data.get('quintile', '')).strip()
            specialty = data.get('specialty', '').strip()
            entity_type = str(data.get('entity_type', '')).strip()
            latino_only = bool(data.get('latino_only', False))
            has_phone = bool(data.get('has_phone', False))
            has_email = bool(data.get('has_email', False))
            city = data.get('city', '').strip().upper()
            zip_code = data.get('zip', '').strip()
            q = data.get('q', '').strip()
            page = max(1, int(data.get('page', 1)))
            limit = min(50000, max(1, int(data.get('limit', 10000))))
            offset = (page - 1) * limit

            where_sql, params = self.build_query_filter(state, quintile, specialty, entity_type, latino_only, has_phone, has_email, city, zip_code, q)
            filename = f"leads_npi_{state or 'ALL'}_lote_{page}.csv" if page > 1 or limit < 10000 else "leads_npi_ciasard.csv"
            self.stream_csv_export(where_sql, params, limit, offset, filename)

    def handle_export_zip(self, query):
        state = query.get('state', [''])[0].strip().upper()
        quintile = query.get('quintile', [''])[0].strip()
        specialty = query.get('specialty', [''])[0].strip()
        entity_type = query.get('entity_type', [''])[0].strip()
        latino_only = query.get('latino_only', ['0'])[0].strip() == '1'
        has_phone = query.get('has_phone', ['0'])[0].strip() == '1'
        has_email = query.get('has_email', ['0'])[0].strip() == '1'
        city = query.get('city', [''])[0].strip().upper()
        zip_code = query.get('zip', [''])[0].strip()
        q = query.get('q', [''])[0].strip()
        batch_size = max(25, min(10000, int(query.get('batch_size', ['150'])[0])))
        max_records = min(50000, max(1, int(query.get('max_records', ['10000'])[0])))

        where_sql, params = self.build_query_filter(state, quintile, specialty, entity_type, latino_only, has_phone, has_email, city, zip_code, q)
        self.stream_zip_export(where_sql, params, batch_size, max_records)

    def handle_post_export_zip(self, data):
        state = data.get('state', '').strip().upper()
        quintile = str(data.get('quintile', '')).strip()
        specialty = data.get('specialty', '').strip()
        entity_type = str(data.get('entity_type', '')).strip()
        latino_only = bool(data.get('latino_only', False))
        has_phone = bool(data.get('has_phone', False))
        has_email = bool(data.get('has_email', False))
        city = data.get('city', '').strip().upper()
        zip_code = data.get('zip', '').strip()
        q = data.get('q', '').strip()
        batch_size = max(25, min(10000, int(data.get('batch_size', 150))))
        max_records = min(50000, max(1, int(data.get('max_records', 10000))))

        where_sql, params = self.build_query_filter(state, quintile, specialty, entity_type, latino_only, has_phone, has_email, city, zip_code, q)
        self.stream_zip_export(where_sql, params, batch_size, max_records)

    def stream_csv_export(self, where_sql, params, limit, offset, filename="leads_npi_ciasard.csv"):
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            query_sql = f'''
            SELECT npi, entity_type, name, first_name, last_name, credentials,
                   address, city, state, zip, phone, email, taxonomy, specialty,
                   is_latino, income_quintile
            FROM providers 
            WHERE {where_sql}
            ORDER BY id ASC
            LIMIT ? OFFSET ?
            '''
            cursor.execute(query_sql, params + [limit, offset])
            rows = cursor.fetchall()
            conn.close()

            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow([
                'NPI', 'Tipo', 'Nombre_Completo', 'Nombre', 'Apellido', 'Credenciales',
                'Especialidad', 'Direccion', 'Ciudad', 'Estado', 'Codigo_Postal', 'Telefono', 'Email',
                'Es_Latino', 'Quintil_Ingreso'
            ])

            for r in rows:
                writer.writerow([
                    r['npi'],
                    'Individual' if r['entity_type'] == '1' else 'Organizacion',
                    r['name'],
                    r['first_name'],
                    r['last_name'],
                    r['credentials'],
                    r['specialty'] or r['taxonomy'] or 'Medicina General',
                    r['address'],
                    r['city'],
                    r['state'],
                    r['zip'],
                    r['phone'],
                    r['email'],
                    'Si' if r['is_latino'] else 'No',
                    f"Q{r['income_quintile']}"
                ])

            csv_data = output.getvalue().encode('utf-8-sig')

            self.send_response(200)
            self.send_header('Content-Type', 'text/csv; charset=utf-8')
            self.send_header('Content-Disposition', f'attachment; filename="{filename}"')
            self.send_header('Content-Length', str(len(csv_data)))
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(csv_data)

        except Exception as e:
            conn.close()
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

    def stream_zip_export(self, where_sql, params, batch_size, max_records):
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            query_sql = f'''
            SELECT npi, entity_type, name, first_name, last_name, credentials,
                   address, city, state, zip, phone, email, taxonomy, specialty,
                   is_latino, income_quintile
            FROM providers 
            WHERE {where_sql}
            ORDER BY id ASC
            LIMIT ?
            '''
            cursor.execute(query_sql, params + [max_records])
            all_rows = cursor.fetchall()
            conn.close()

            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as z:
                total_leads = len(all_rows)
                num_batches = (total_leads + batch_size - 1) // batch_size
                
                for b_idx in range(num_batches):
                    b_start = b_idx * batch_size
                    b_end = min(b_start + batch_size, total_leads)
                    chunk_rows = all_rows[b_start:b_end]

                    output = io.StringIO()
                    writer = csv.writer(output)
                    writer.writerow([
                        'NPI', 'Tipo', 'Nombre_Completo', 'Nombre', 'Apellido', 'Credenciales',
                        'Especialidad', 'Direccion', 'Ciudad', 'Estado', 'Codigo_Postal', 'Telefono', 'Email',
                        'Es_Latino', 'Quintil_Ingreso'
                    ])

                    for r in chunk_rows:
                        writer.writerow([
                            r['npi'],
                            'Individual' if r['entity_type'] == '1' else 'Organizacion',
                            r['name'],
                            r['first_name'],
                            r['last_name'],
                            r['credentials'],
                            r['specialty'] or r['taxonomy'] or 'Medicina General',
                            r['address'],
                            r['city'],
                            r['state'],
                            r['zip'],
                            r['phone'],
                            r['email'],
                            'Si' if r['is_latino'] else 'No',
                            f"Q{r['income_quintile']}"
                        ])

                    csv_content = output.getvalue().encode('utf-8-sig')
                    file_label = f"lote_{b_idx + 1:03d}_{b_start + 1}-{b_end}_leads.csv"
                    z.writestr(file_label, csv_content)

            zip_data = zip_buffer.getvalue()

            self.send_response(200)
            self.send_header('Content-Type', 'application/zip')
            self.send_header('Content-Disposition', 'attachment; filename="leads_npi_lotes_divididos.zip"')
            self.send_header('Content-Length', str(len(zip_data)))
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(zip_data)

        except Exception as e:
            conn.close()
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

def run_server():
    server_address = ('', PORT)
    httpd = http.server.ThreadingHTTPServer(server_address, NPIRequestHandler)
    print(f"[CIASA Multi-Threaded Server] Running on http://localhost:{PORT}")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
