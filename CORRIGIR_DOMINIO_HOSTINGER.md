# 🔧 Corrigir Domínio syncpulse.com.br na Hostinger

## ⚠️ Problema

O site não está mais acessível no domínio `syncpulse.com.br` ou `www.syncpulse.com.br`. O domínio está levando para outro local.

## 🔍 Passo 1: Verificar Onde o Site Está Hospedado

Primeiro, precisamos saber onde o site está hospedado:

### Opção A: GitHub Pages

1. Acesse: **https://github.com/kpedro/site-syncpulse**
2. Vá em **Settings** → **Pages**
3. Veja se está configurado:
   - **Source**: Branch `main` / folder `/ (root)`
   - **Custom domain**: `www.syncpulse.com.br` ou `syncpulse.com.br`
   - **URL do GitHub Pages**: `https://kpedro.github.io/site-syncpulse/`

### Opção B: Netlify

1. Acesse: **https://app.netlify.com**
2. Procure pelo projeto `site-syncpulse`
3. Veja a URL do Netlify (ex: `site-syncpulse-xxx.netlify.app`)

### Opção C: Vercel

1. Acesse: **https://vercel.com/dashboard**
2. Procure pelo projeto `site-syncpulse`
3. Veja a URL do Vercel (ex: `site-syncpulse.vercel.app`)

## 🔍 Passo 2: Verificar Registros DNS Atuais na Hostinger

1. Acesse: **https://hpanel.hostinger.com**
2. Faça login
3. Vá em **Domínios** → **Gerenciar** → **syncpulse.com.br**
4. Clique em **DNS / Zone Editor** ou **Gerenciar DNS**
5. **Anote TODOS os registros** (ou tire print)

**Procure especialmente por:**
- Registro **CNAME** com nome `www`
- Registros **A** com nome `@` (domínio principal)

## ✅ Passo 3: Corrigir Registros DNS

### Se o site está no GitHub Pages:

**Registro CNAME para www:**
```
Tipo: CNAME
Nome: www
Valor: kpedro.github.io
TTL: 3600 (ou padrão)
```

**Registros A para domínio principal (se quiser usar syncpulse.com.br sem www):**
```
Tipo: A
Nome: @
Valor: 185.199.108.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.109.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.110.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.111.153
TTL: 3600
```

**⚠️ IMPORTANTE:** 
- Se você tem VPS usando o domínio principal (@), **NÃO adicione** os registros A acima
- Use apenas o CNAME para www

### Se o site está no Netlify:

1. No Netlify, vá em **Site settings** → **Domain management**
2. Adicione `www.syncpulse.com.br` (se ainda não estiver)
3. O Netlify mostrará os registros DNS necessários
4. Copie e adicione na Hostinger

### Se o site está no Vercel:

1. No Vercel, vá em **Settings** → **Domains**
2. Adicione `www.syncpulse.com.br` (se ainda não estiver)
3. O Vercel mostrará os registros DNS necessários
4. Copie e adicione na Hostinger

## 🔧 Passo 4: Editar/Adicionar Registros na Hostinger

### Para editar registro CNAME www existente:

1. Na lista de registros DNS, encontre:
   - **Type:** CNAME
   - **Name:** www
2. Clique em **Edit** (ou ícone de editar)
3. Altere o **Content/Value** para:
   - **GitHub Pages:** `kpedro.github.io`
   - **Netlify:** (o valor que o Netlify fornecer)
   - **Vercel:** (o valor que o Vercel fornecer)
4. Clique em **Save** ou **Salvar**

### Para adicionar novo registro (se não existir):

1. Clique em **"Adicionar Registro"** ou **"Add Record"**
2. Preencha:
   - **Tipo:** CNAME
   - **Nome:** www
   - **Valor:** (conforme acima)
   - **TTL:** 3600
3. Clique em **Save**

## ⚠️ Passo 5: Verificar Conflitos

**IMPORTANTE:** Verifique se há registros conflitantes:

1. **CNAME www apontando para syncpulse.com.br** (LOOP - precisa corrigir)
2. **Registros A antigos** apontando para IPs incorretos
3. **Múltiplos registros** do mesmo tipo

**Se encontrar conflitos:**
- Edite o registro incorreto
- OU delete e recrie

## ⏱️ Passo 6: Aguardar Propagação

Após fazer as alterações:

1. **Aguarde 1-24 horas** para propagação DNS
2. Use [whatsmydns.net](https://www.whatsmydns.net) para verificar:
   - Digite: `www.syncpulse.com.br`
   - Veja se está apontando corretamente

## ✅ Passo 7: Verificar no GitHub/Netlify/Vercel

### Se GitHub Pages:

1. GitHub → **Settings** → **Pages**
2. Em **Custom domain**, digite: `www.syncpulse.com.br`
3. Marque **"Enforce HTTPS"**
4. Salve

### Se Netlify/Vercel:

1. Adicione o domínio customizado nas configurações
2. Aguarde a verificação do domínio

## 📋 Checklist de Correção

- [ ] Identifiquei onde o site está hospedado (GitHub/Netlify/Vercel)
- [ ] Acessei o painel DNS da Hostinger
- [ ] Verifiquei os registros DNS atuais
- [ ] Editei o CNAME www para apontar corretamente
- [ ] Removi registros conflitantes (se houver)
- [ ] Configurei o domínio customizado no GitHub/Netlify/Vercel
- [ ] Aguardei propagação DNS (1-24h)
- [ ] Testei acesso em `www.syncpulse.com.br`
- [ ] Verifiquei HTTPS funcionando

## 🆘 Problemas Comuns

### "CNAME www apontando para syncpulse.com.br"

**Problema:** Isso cria um loop infinito
**Solução:** Edite o CNAME www para apontar para `kpedro.github.io` (ou domínio do Netlify/Vercel)

### "Domínio não verifica no GitHub/Netlify/Vercel"

**Solução:**
1. Verifique se os registros DNS estão corretos
2. Aguarde mais tempo (pode levar até 24h)
3. Verifique se digitou o domínio corretamente

### "Site ainda não abre"

**Solução:**
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Teste em modo anônimo
3. Verifique propagação em [whatsmydns.net](https://www.whatsmydns.net)
4. Aguarde mais tempo

---

**Me informe:**
1. Onde o site está hospedado? (GitHub Pages, Netlify ou Vercel)
2. O que aparece quando você acessa `www.syncpulse.com.br`?
3. Quais registros DNS você vê na Hostinger para `www`?
