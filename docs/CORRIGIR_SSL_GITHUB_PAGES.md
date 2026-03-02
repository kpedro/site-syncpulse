# Corrigir SSL (ERR_SSL_PROTOCOL_ERROR) - syncpulse.com.br no GitHub Pages

## O problema

O site está no GitHub Pages, mas ao acessar `https://syncpulse.com.br` aparece:
- **ERR_SSL_PROTOCOL_ERROR**
- "A conexão com este site não é segura"

## Causa provável

O domínio **syncpulse.com.br** (sem www) pode estar apontando para o **IP da VPS** em vez do GitHub Pages. A VPS não tem certificado SSL para o domínio principal, por isso o erro.

---

## Passo a passo para corrigir

### 1. No GitHub – Configurar domínio e HTTPS

1. Acesse: **https://github.com/kpedro/site-syncpulse**
2. Vá em **Settings** → **Pages** (menu lateral)
3. Em **Custom domain**, coloque: `www.syncpulse.com.br`
4. Marque **Enforce HTTPS**
5. Clique em **Save**
6. Aguarde a verificação do domínio (pode levar alguns minutos)

### 2. Na Hostinger – Ajustar DNS

1. Acesse: **https://hpanel.hostinger.com**
2. Vá em **Domínios** → **syncpulse.com.br** → **DNS / Zone Editor**
3. Confira ou crie estes registros:

**CNAME para www (obrigatório):**
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

**Importante:** Se existir registro **A** para `@` apontando para o **IP da VPS**, remova ou altere para os IPs do GitHub acima. O domínio principal deve ir para o GitHub Pages, não para a VPS.

**Para o n8n (subdomínio):**
```
Tipo: A
Nome: n8n
Valor: [IP da sua VPS]
TTL: 3600
```

### 3. Conferir conflitos

- **CNAME www** deve apontar para `kpedo.github.io` (não para syncpulse.com.br)
- **A @** deve usar os 4 IPs do GitHub (não o IP da VPS)
- **A n8n** deve usar o IP da VPS

### 4. Aguardar propagação

- DNS pode levar de 15 minutos a 24 horas
- Verifique em: https://www.whatsmydns.net
  - `www.syncpulse.com.br` → deve apontar para GitHub
  - `syncpulse.com.br` → deve apontar para os IPs do GitHub

---

## Testes após a correção

1. **https://www.syncpulse.com.br** – deve abrir o site com cadeado verde
2. **https://syncpulse.com.br** – deve redirecionar para www ou abrir direto
3. **https://n8n.syncpulse.com.br** – deve abrir o n8n na VPS

---

## Resumo

| Domínio | Deve apontar para |
|---------|-------------------|
| www.syncpulse.com.br | kpedro.github.io (CNAME) |
| syncpulse.com.br | IPs do GitHub (4 registros A) |
| n8n.syncpulse.com.br | IP da VPS (1 registro A) |
