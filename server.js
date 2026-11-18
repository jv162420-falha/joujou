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
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

app.get('/cnpj/:cnpj', async (req, res) => {
  try {
    const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${req.params.cnpj}`);
    const d = await r.json();
    if (!r.ok) return res.status(r.status).json(d);
    return res.json(d);
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

app.post('/apibrasil', async (req, res) => {
  const { token, service, body } = req.body;
  if (!token || !service) return res.status(400).json({ error: 'token e service obrigatorios' });
  const urls = {
    cpf:      'https://gateway.apibrasil.io/api/v2/consulta/cpf/credits',
    placa:    'https://gateway.apibrasil.io/api/v2/consulta/vehicles/credits',
    telefone: 'https://gateway.apibrasil.io/api/v2/consulta/telefone/credits',
    cnh:      'https://gateway.apibrasil.io/api/v2/consulta/cnh/credits',
  };
  const url = urls[service];
  if (!url) return res.status(400).json({ error: 'service invalido' });
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body || {})
    });
    const d = await r.json();
    console.log('APIBRASIL:', JSON.stringify(d));
    return res.json(d);
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => console.log(`Proxy rodando na porta ${PORT}`));