const fs = require('fs');
const path = require('path');

const AJUSTES_FILE = path.join(__dirname, '../_materiales_y_estrategia/datos/ajustes.json');

function getGeminiConfig() {
  let apiKey = process.env.GEMINI_API_KEY || '';
  let model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  let enabled = true;

  try {
    if (fs.existsSync(AJUSTES_FILE)) {
      const data = JSON.parse(fs.readFileSync(AJUSTES_FILE, 'utf-8'));
      if (data.geminiApiKey) apiKey = data.geminiApiKey;
      if (data.geminiModel) model = data.geminiModel;
      if (typeof data.geminiEnabled !== 'undefined') enabled = data.geminiEnabled;
    }
  } catch (err) {
    console.error('Error reading Gemini config from ajustes.json:', err.message);
  }

  return { apiKey, model, enabled };
}

/**
 * Realiza un test de conectividad en tiempo real con Google Gemini API
 */
async function testGeminiConnection(customKey = '', customModel = '') {
  const config = getGeminiConfig();
  const apiKey = (customKey || config.apiKey || '').trim();
  const model = customModel || config.model || 'gemini-1.5-flash';

  if (!apiKey) {
    return {
      ok: false,
      error: 'No se ha configurado ninguna API Key de Gemini. Ingresa tu clave para continuar.'
    };
  }

  const startTime = Date.now();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: 'Responde estrictamente en 4 palabras en español confirmando que la conexión está activa y lista.' }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 50,
        temperature: 0.2
      }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const latencyMs = Date.now() - startTime;

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.error?.message || `HTTP ${res.status} (${res.statusText})`;
      return {
        ok: false,
        error: `Error de autenticación/llamada a Gemini: ${msg}`,
        latencyMs
      };
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Conexión activa con Gemini.';

    return {
      ok: true,
      message: 'Conexión exitosa y autenticada con Google Gemini AI.',
      model,
      reply,
      latencyMs
    };
  } catch (err) {
    return {
      ok: false,
      error: `Fallo de red al conectar con Google Gemini: ${err.message}`,
      latencyMs: Date.now() - startTime
    };
  }
}

/**
 * Genera contenido de texto con Google Gemini
 */
async function generateAIContent({ prompt, systemInstruction = '', model = '', apiKey = '', temperature = 0.7, maxTokens = 1000 }) {
  const config = getGeminiConfig();
  const finalKey = (apiKey || config.apiKey || '').trim();
  const finalModel = model || config.model || 'gemini-1.5-flash';

  if (!finalKey) {
    throw new Error('API Key de Gemini no configurada.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${finalModel}:generateContent?key=${finalKey}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens
    }
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gemini API Error: ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

module.exports = {
  getGeminiConfig,
  testGeminiConnection,
  generateAIContent
};
