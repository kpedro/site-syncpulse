# Configuração DNS Segura - Site + VPS (n8n)

## ⚠️ Situação Atual

- **Domínio:** syncpulse.com.br
- **VPS com n8n:** Usando o domínio principal ou subdomínio
- **Site estático:** Precisa ser configurado sem interferir na VPS

## 🔍 Verificação Importante

**PRIMEIRO:** Verifique como sua VPS está configurada atualmente:

1. Acesse o painel da Hostinger: [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Vá em **Domínios** > **Gerenciar** > **syncpulse.com.br** > **DNS / Zone Editor**
3. Verifique os registros DNS existentes:
   - Se há registro A apontando para IP da VPS no domínio principal (@)
   - Se há subdomínio configurado (ex: n8n.syncpulse.com.br, vps.syncpulse.com.br)

## ✅ Soluções Seguras (Escolha uma)

### Opção 1: Site no www, VPS no domínio principal (RECOMENDADO)

**Configuração:**
- `syncpulse.com.br` → VPS (n8n) - **MANTÉM como está**
- `www.syncpulse.com.br` → Site estático (GitHub Pages/Netlify/Vercel)

**Vantagens:**
- ✅ Não mexe na configuração da VPS
- ✅ Site acessível em www.syncpulse.com.br
- ✅ Redirecionamento automático de syncpulse.com.br para www (opcional)

**Registros DNS na Hostinger:**
```
# Manter registros da VPS (NÃO MEXER)
Tipo: A
Nome: @
Valor: IP_DA_SUA_VPS
TTL: 3600

# Adicionar para o site
Tipo: CNAME
Nome: www
Valor: kpedro.github.io (ou domínio do Netlify/Vercel)
TTL: 3600
```

### Opção 2: Site no domínio principal, VPS em subdomínio

**Configuração:**
- `syncpulse.com.br` → Site estático
- `n8n.syncpulse.com.br` ou `vps.syncpulse.com.br` → VPS

**Vantagens:**
- ✅ Site no domínio principal (mais profissional)
- ✅ VPS isolada em subdomínio

**Registros DNS na Hostinger:**
```
# Para o site (domínio principal)
Tipo: A
Nome: @
Valor: 185.199.108.153 (GitHub Pages)
Tipo: A
Nome: @
Valor: 185.199.109.153
Tipo: A
Nome: @
Valor: 185.199.110.153
Tipo: A
Nome: @
Valor: 185.199.111.153

# Para a VPS (subdomínio)
Tipo: A
Nome: n8n (ou vps)
Valor: IP_DA_SUA_VPS
TTL: 3600
```

**⚠️ IMPORTANTE:** Se escolher esta opção, você precisará:
1. Atualizar a configuração do n8n para usar o subdomínio
2. Atualizar qualquer configuração que aponte para syncpulse.com.br

### Opção 3: Ambos em subdomínios diferentes

**Configuração:**
- `www.syncpulse.com.br` → Site estático
- `n8n.syncpulse.com.br` → VPS
- `syncpulse.com.br` → Redireciona para www (opcional)

**Vantagens:**
- ✅ Separação total
- ✅ Flexibilidade máxima

## 🛡️ Garantindo Segurança

### Checklist Antes de Fazer Mudanças:

- [ ] Verifique o IP atual da VPS nos registros DNS
- [ ] Anote todos os registros DNS existentes (backup)
- [ ] Teste acesso à VPS antes de fazer mudanças
- [ ] Escolha a opção que menos mexe na configuração atual da VPS
- [ ] Faça mudanças em horário de baixo uso (se possível)

### Como Fazer Backup dos Registros DNS:

1. Acesse Hostinger > DNS / Zone Editor
2. Tire print ou anote todos os registros existentes
3. Documente especialmente:
   - Registros A do domínio principal (@)
   - Registros A de subdomínios
   - Qualquer CNAME existente

## 🔧 Recomendação Específica

**Para seu caso, recomendo a Opção 1:**

1. **Mantém a VPS funcionando** como está (sem mexer)
2. **Site fica em www.syncpulse.com.br** (padrão comum)
3. **Zero risco** para a VPS
4. **Fácil de reverter** se necessário

### Passos para Opção 1:

1. **No GitHub Pages:**
   - Settings > Pages > Custom domain: `www.syncpulse.com.br`
   - Marque "Enforce HTTPS"

2. **Na Hostinger:**
   - Adicione apenas o registro CNAME para www
   - **NÃO mexa** nos registros A existentes do domínio principal

3. **Teste:**
   - Acesse `www.syncpulse.com.br` → Deve abrir o site
   - Acesse `syncpulse.com.br` → Deve continuar abrindo a VPS/n8n

## ❓ Como Verificar Qual Opção Usar

Execute este comando para ver os registros DNS atuais:

```bash
# Ver registros A do domínio principal
nslookup syncpulse.com.br

# Ver registros de subdomínios
nslookup www.syncpulse.com.br
nslookup n8n.syncpulse.com.br
```

Ou use ferramentas online:
- [whatsmydns.net](https://www.whatsmydns.net)
- [mxtoolbox.com](https://mxtoolbox.com/DNSLookup.aspx)

## 🆘 Se Algo Der Errado

**Reverter mudanças:**
1. Volte ao painel da Hostinger
2. Remova os registros que adicionou
3. Restaure os registros originais (do backup que você fez)

**Testar VPS:**
- Acesse via IP direto da VPS para verificar se está funcionando
- Verifique logs do n8n

## 📝 Resumo

**NÃO vai danificar a VPS se:**
- ✅ Você usar www para o site e manter @ para a VPS
- ✅ OU usar subdomínio para a VPS e @ para o site
- ✅ Fizer backup antes de mudar
- ✅ Não remover registros da VPS

**PODE causar problemas se:**
- ❌ Remover registros A da VPS sem configurar subdomínio
- ❌ ❌ Substituir IP da VPS pelo IP do GitHub Pages no registro @

