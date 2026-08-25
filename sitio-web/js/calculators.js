/**
 * Calculators Module — Bolsa Inmobiliaria
 * Three investment calculators: ROI, Mortgage (Hipoteca), CONFOTUR Savings
 */

/* ───────── helpers ───────── */
function _fmt(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
}

function _pct(n) {
    return n.toFixed(2) + '%';
}

function _debounce(fn, ms) {
    var t;
    return function () {
        clearTimeout(t);
        t = setTimeout(fn, ms || 300);
    };
}

function _input(id, label, value, opts) {
    opts = opts || {};
    var prefix = opts.prefix || '';
    var suffix = opts.suffix || '';
    var step   = opts.step || 'any';
    var min    = opts.min != null ? opts.min : 0;
    return (
        '<div class="calc-field">' +
            '<label for="' + id + '">' + label + '</label>' +
            '<div class="calc-input-wrap">' +
                (prefix ? '<span class="calc-prefix">' + prefix + '</span>' : '') +
                '<input class="form-input" type="number" id="' + id + '" value="' + value + '" step="' + step + '" min="' + min + '">' +
                (suffix ? '<span class="calc-suffix">' + suffix + '</span>' : '') +
            '</div>' +
        '</div>'
    );
}

/* ================================================================
   1. ROI Calculator
   ================================================================ */
function initRoiCalculator(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML =
        '<div class="calc-form">' +
            _input('roi-price', 'Precio de compra', 200000, { prefix: '$' }) +
            _input('roi-rent', 'Ingreso mensual por alquiler', 1500, { prefix: '$' }) +
            _input('roi-occ', 'Tasa de ocupación', 75, { suffix: '%', min: 0 }) +
            _input('roi-exp', 'Gastos anuales (% del precio)', 3, { suffix: '%', min: 0 }) +
        '</div>' +
        '<div id="roi-results" class="calc-results"></div>';

    function calc() {
        var price = parseFloat(document.getElementById('roi-price').value) || 0;
        var rent  = parseFloat(document.getElementById('roi-rent').value) || 0;
        var occ   = (parseFloat(document.getElementById('roi-occ').value) || 0) / 100;
        var expP  = (parseFloat(document.getElementById('roi-exp').value) || 0) / 100;

        var grossAnnual = rent * 12 * occ;
        var expenses    = price * expP;
        var netAnnual   = grossAnnual - expenses;
        var yieldPct    = price > 0 ? (netAnnual / price) * 100 : 0;

        // 5-year projection (3% annual appreciation)
        var rows = '';
        for (var y = 1; y <= 5; y++) {
            var propVal   = price * Math.pow(1.03, y);
            var cumNet    = netAnnual * y;
            var totalReturn = cumNet + (propVal - price);
            rows +=
                '<tr>' +
                    '<td>Año ' + y + '</td>' +
                    '<td>' + _fmt(propVal) + '</td>' +
                    '<td>' + _fmt(cumNet) + '</td>' +
                    '<td>' + _fmt(totalReturn) + '</td>' +
                '</tr>';
        }

        document.getElementById('roi-results').innerHTML =
            '<div class="calc-cards">' +
                '<div class="calc-card">' +
                    '<span class="calc-card-label">Ingreso bruto anual</span>' +
                    '<span class="calc-card-value">' + _fmt(grossAnnual) + '</span>' +
                '</div>' +
                '<div class="calc-card">' +
                    '<span class="calc-card-label">Gastos anuales</span>' +
                    '<span class="calc-card-value" style="color:var(--error)">' + _fmt(expenses) + '</span>' +
                '</div>' +
                '<div class="calc-card">' +
                    '<span class="calc-card-label">Ingreso neto anual</span>' +
                    '<span class="calc-card-value" style="color:var(--success)">' + _fmt(netAnnual) + '</span>' +
                '</div>' +
                '<div class="calc-card highlight">' +
                    '<span class="calc-card-label">Rendimiento anual</span>' +
                    '<span class="calc-card-value">' + _pct(yieldPct) + '</span>' +
                '</div>' +
            '</div>' +

            '<h4 class="calc-subtitle">Proyección a 5 años <small>(apreciación estimada: 3% anual)</small></h4>' +
            '<div class="calc-table-wrap">' +
                '<table class="calc-table">' +
                    '<thead><tr>' +
                        '<th>Período</th><th>Valor propiedad</th><th>Ingresos acumulados</th><th>Retorno total</th>' +
                    '</tr></thead>' +
                    '<tbody>' + rows + '</tbody>' +
                '</table>' +
            '</div>' +

            '<div class="calc-note">' +
                '<strong>Comparación:</strong> El rendimiento promedio de alquiler en Estados Unidos es de 3–5% anual. ' +
                'Tu inversión en RD proyecta un rendimiento de <strong>' + _pct(yieldPct) + '</strong>, ' +
                (yieldPct > 5 ? 'superando significativamente el mercado estadounidense.' :
                 yieldPct > 3 ? 'comparable al mercado estadounidense.' :
                 'similar al rango bajo del mercado estadounidense.') +
            '</div>';
    }

    var recalc = _debounce(calc, 250);
    el.querySelectorAll('input').forEach(function (inp) { inp.addEventListener('input', recalc); });
    calc();
}

/* ================================================================
   2. Mortgage (Hipoteca) Calculator
   ================================================================ */
function initMortgageCalculator(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML =
        '<div class="calc-form">' +
            _input('mort-price', 'Precio de la propiedad', 200000, { prefix: '$' }) +
            _input('mort-down', 'Inicial', 30, { suffix: '%', min: 0 }) +
            _input('mort-term', 'Plazo del préstamo', 15, { suffix: 'años', min: 1 }) +
            _input('mort-rate', 'Tasa de interés', 9, { suffix: '%', min: 0 }) +
        '</div>' +
        '<div id="mort-results" class="calc-results"></div>';

    function calc() {
        var price = parseFloat(document.getElementById('mort-price').value) || 0;
        var downP = (parseFloat(document.getElementById('mort-down').value) || 0) / 100;
        var years = parseInt(document.getElementById('mort-term').value, 10) || 1;
        var rate  = (parseFloat(document.getElementById('mort-rate').value) || 0) / 100;

        var loan = price * (1 - downP);
        var down = price * downP;
        var n    = years * 12;
        var r    = rate / 12;

        var monthly = 0;
        if (r > 0 && n > 0) {
            monthly = loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        } else if (n > 0) {
            monthly = loan / n;
        }

        var totalPaid    = monthly * n;
        var totalInterest = totalPaid - loan;
        var totalCost     = down + totalPaid;

        // Amortization snapshots
        var snapshots = [];
        var targets = [1, 5, 10, years];
        // deduplicate
        var seen = {};
        targets.forEach(function (t) {
            if (t <= years && !seen[t]) { seen[t] = true; snapshots.push(t); }
        });

        var balance = loan;
        var paidPrincipal = 0;
        var paidInterest  = 0;
        var snapshotRows  = '';
        var si = 0;

        for (var m = 1; m <= n; m++) {
            var intPart  = balance * r;
            var prinPart = monthly - intPart;
            paidPrincipal += prinPart;
            paidInterest  += intPart;
            balance -= prinPart;

            var yr = m / 12;
            if (si < snapshots.length && yr === snapshots[si]) {
                snapshotRows +=
                    '<tr>' +
                        '<td>Año ' + snapshots[si] + '</td>' +
                        '<td>' + _fmt(Math.max(balance, 0)) + '</td>' +
                        '<td>' + _fmt(paidPrincipal) + '</td>' +
                        '<td>' + _fmt(paidInterest) + '</td>' +
                    '</tr>';
                si++;
            }
        }

        document.getElementById('mort-results').innerHTML =
            '<div class="calc-cards">' +
                '<div class="calc-card">' +
                    '<span class="calc-card-label">Monto del préstamo</span>' +
                    '<span class="calc-card-value">' + _fmt(loan) + '</span>' +
                '</div>' +
                '<div class="calc-card highlight">' +
                    '<span class="calc-card-label">Cuota mensual</span>' +
                    '<span class="calc-card-value">' + _fmt(monthly) + '</span>' +
                '</div>' +
                '<div class="calc-card">' +
                    '<span class="calc-card-label">Total intereses</span>' +
                    '<span class="calc-card-value" style="color:var(--error)">' + _fmt(totalInterest) + '</span>' +
                '</div>' +
                '<div class="calc-card">' +
                    '<span class="calc-card-label">Costo total (inicial + pagos)</span>' +
                    '<span class="calc-card-value">' + _fmt(totalCost) + '</span>' +
                '</div>' +
            '</div>' +

            '<h4 class="calc-subtitle">Resumen de amortización</h4>' +
            '<div class="calc-table-wrap">' +
                '<table class="calc-table">' +
                    '<thead><tr>' +
                        '<th>Período</th><th>Balance</th><th>Capital pagado</th><th>Interés pagado</th>' +
                    '</tr></thead>' +
                    '<tbody>' + snapshotRows + '</tbody>' +
                '</table>' +
            '</div>';
    }

    var recalc = _debounce(calc, 250);
    el.querySelectorAll('input').forEach(function (inp) { inp.addEventListener('input', recalc); });
    calc();
}

/* ================================================================
   3. CONFOTUR Savings Calculator
   ================================================================ */
function initConfoturCalculator(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML =
        '<div class="calc-form">' +
            _input('conf-price', 'Precio de compra', 200000, { prefix: '$' }) +
        '</div>' +
        '<div id="conf-results" class="calc-results"></div>';

    function calc() {
        var price = parseFloat(document.getElementById('conf-price').value) || 0;

        var transferTax      = price * 0.03;      // 3% transfer tax
        var annualPropertyTax = price * 0.01;      // 1% annual property tax
        var propertyTax15     = annualPropertyTax * 15;
        var totalSavings      = transferTax + propertyTax15;

        // Without CONFOTUR totals
        var withoutTotal = transferTax + propertyTax15;
        var withTotal    = 0; // exempt from both

        document.getElementById('conf-results').innerHTML =
            '<div class="calc-cards">' +
                '<div class="calc-card">' +
                    '<span class="calc-card-label">Ahorro en impuesto de transferencia (3%)</span>' +
                    '<span class="calc-card-value" style="color:var(--success)">' + _fmt(transferTax) + '</span>' +
                '</div>' +
                '<div class="calc-card">' +
                    '<span class="calc-card-label">Exención anual de IPI (1%)</span>' +
                    '<span class="calc-card-value" style="color:var(--success)">' + _fmt(annualPropertyTax) + '/año</span>' +
                '</div>' +
                '<div class="calc-card">' +
                    '<span class="calc-card-label">Ahorro total IPI en 15 años</span>' +
                    '<span class="calc-card-value" style="color:var(--success)">' + _fmt(propertyTax15) + '</span>' +
                '</div>' +
                '<div class="calc-card highlight">' +
                    '<span class="calc-card-label">Ahorro total CONFOTUR</span>' +
                    '<span class="calc-card-value">' + _fmt(totalSavings) + '</span>' +
                '</div>' +
            '</div>' +

            '<h4 class="calc-subtitle">Comparación: Con vs Sin CONFOTUR</h4>' +
            '<div class="calc-table-wrap">' +
                '<table class="calc-table">' +
                    '<thead><tr>' +
                        '<th>Concepto</th><th>Sin CONFOTUR</th><th>Con CONFOTUR</th><th>Ahorro</th>' +
                    '</tr></thead>' +
                    '<tbody>' +
                        '<tr>' +
                            '<td>Impuesto de transferencia (3%)</td>' +
                            '<td>' + _fmt(transferTax) + '</td>' +
                            '<td>' + _fmt(0) + '</td>' +
                            '<td class="calc-savings">' + _fmt(transferTax) + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>IPI anual (1%)</td>' +
                            '<td>' + _fmt(annualPropertyTax) + '/año</td>' +
                            '<td>' + _fmt(0) + '/año</td>' +
                            '<td class="calc-savings">' + _fmt(annualPropertyTax) + '/año</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>IPI acumulado (15 años)</td>' +
                            '<td>' + _fmt(propertyTax15) + '</td>' +
                            '<td>' + _fmt(0) + '</td>' +
                            '<td class="calc-savings">' + _fmt(propertyTax15) + '</td>' +
                        '</tr>' +
                        '<tr class="calc-table-total">' +
                            '<td><strong>Total impuestos</strong></td>' +
                            '<td><strong>' + _fmt(withoutTotal) + '</strong></td>' +
                            '<td><strong>' + _fmt(withTotal) + '</strong></td>' +
                            '<td class="calc-savings"><strong>' + _fmt(totalSavings) + '</strong></td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>' +
            '</div>' +

            '<div class="calc-note">' +
                '<strong>¿Qué es CONFOTUR?</strong> La Ley 158-01 de Fomento al Desarrollo Turístico exime a proyectos calificados ' +
                'del impuesto de transferencia inmobiliaria (3%) y del Impuesto al Patrimonio Inmobiliario (IPI, ~1% anual) ' +
                'por un período de 15 años. Esto representa un ahorro significativo de <strong>' + _fmt(totalSavings) + '</strong> ' +
                'en una propiedad de <strong>' + _fmt(price) + '</strong>.' +
            '</div>';
    }

    var recalc = _debounce(calc, 250);
    el.querySelectorAll('input').forEach(function (inp) { inp.addEventListener('input', recalc); });
    calc();
}
