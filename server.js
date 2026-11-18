const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/cep/:cep', async (req, res) => {
  try {
    const r = await fetch(`https://brasilapi.com.br/api/cep/v2/${req.params.cep}`);
    const d = await r.json();
    if (!r.ok) return res.status(r.status).json(d);
    return res.json(d);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.get('/cnpj/:cnpj', async (req, res) => {
  try {
    const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${req.params.cnpj}`);
    const d = await r.json();
    if (!r.ok) return res.status(r.status).json(d);
    return res.json(d);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/infosimples', async (req, res) => {
  const { token, endpoint, body } = req.body;
  if (!token || !endpoint) return res.status(400).json({ error: 'token e endpoint obrigatorios' });
  try {
    const r = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...(body || {}) })
    });
    const d = await r.json();
    if (!r.ok) return res.status(r.status).json(d);
    return res.json(d);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Proxy rodando na porta ${PORT}`));