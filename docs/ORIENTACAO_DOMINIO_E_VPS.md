# Orientação: Domínio syncpulse.com.br + Site + VPS (n8n)

## ✅ Você fez certo

O domínio **syncpulse.com.br** pode (e deve) ser usado em **dois lugares diferentes**:

| O quê | Onde aponta | Exemplo |
|------|-------------|---------|
| **Site institucional** | syncpulse.com.br e www.syncpulse.com.br | https://www.syncpulse.com.br |
| **n8n (automações)** | n8n.syncpulse.com.br (subdomínio) | https://n8n.syncpulse.com.br |

São usos diferentes do mesmo domínio: o **principal** para o site e um **subdomínio** para a VPS.

---

## Como deve ficar o DNS na Hostinger

### 1. Site (syncpulse.com.br e www)

**Se o site está no GitHub Pages:**

```
Tipo: CNAME
Nome: www
Valor: kpedro.github.io
TTL: 3600
```

**Registros A para o domínio raiz (syncpulse.com.br sem www):**
```
Tipo: A | Nome: @ | Valor: 185.199.108.153
Tipo: A | Nome: @ | Valor: 185.199.109.153
Tipo: A | Nome: @ | Valor: 185.199.110.153
Tipo: A | Nome: @ | Valor: 185.199.111.153
```

**Se o site está na VPS:** use o IP da VPS nos registros A e CNAME conforme a documentação do seu provedor.

---

### 2. n8n na VPS (n8n.syncpulse.com.br)

```
Tipo: A
Nome: n8n
Valor: [IP da sua VPS]
TTL: 3600
```

O IP da VPS você encontra no painel da Hostinger (VPS).

---

## Possível conflito

Se o domínio **principal** (@ ou www) estiver apontando para o **IP da VPS**, o site institucional não vai aparecer em syncpulse.com.br ou www.syncpulse.com.br.

- **Correto:**  
  - @ e www → site (GitHub Pages, Netlify, Vercel, etc.)  
  - n8n → IP da VPS  

- **Errado:**  
  - @ ou www → IP da VPS (aí o site não abre no domínio principal)

---

## Checklist

- [ ] **www.syncpulse.com.br** → site (GitHub Pages ou outro)
- [ ] **syncpulse.com.br** (sem www) → site (registros A ou redirect para www)
- [ ] **n8n.syncpulse.com.br** → IP da VPS
- [ ] Nginx ou proxy na VPS configurado para o subdomínio n8n (se necessário)
- [ ] Certificado SSL (HTTPS) para www e n8n

---

## Resumo

| Registro | Nome | Valor | Para quê |
|----------|------|-------|----------|
| CNAME | www | kpedro.github.io | Site (GitHub Pages) |
| A | @ | 185.199.108.153 (e os outros 3) | Site (domínio raiz) |
| A | n8n | IP da VPS | n8n na VPS |

---

## Onde o site está hospedado?

- **GitHub Pages:** use os registros acima.
- **Netlify/Vercel:** use os valores que eles indicam para o domínio.
- **Na própria VPS:** aí @ e www devem apontar para o IP da VPS e o Nginx (ou outro servidor) deve servir o site e o n8n em subdomínios diferentes.

Se disser onde o site está hospedado (GitHub, Netlify, Vercel ou VPS), dá para ajustar os registros exatamente para o seu caso.
