# Configuração DNS na Hostinger - SyncPulse

## 📍 Informações Importantes

- **Domínio:** syncpulse.com.br
- **Registrado em:** Registro.br
- **Gerenciado em:** Hostinger
- **Painel:** [hpanel.hostinger.com](https://hpanel.hostinger.com)

## 🔧 Como Acessar o Painel DNS

1. Acesse [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Faça login com suas credenciais da Hostinger
3. No menu lateral, clique em **"Domínios"**
4. Encontre **syncpulse.com.br** e clique em **"Gerenciar"**
5. Procure por **"DNS / Zone Editor"** ou **"Gerenciar DNS"**

## 📋 Configuração para GitHub Pages

Se estiver usando GitHub Pages, adicione estes registros:

### Registros A (para domínio principal - syncpulse.com.br)

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 3600 |
| A | @ | 185.199.109.153 | 3600 |
| A | @ | 185.199.110.153 | 3600 |
| A | @ | 185.199.111.153 | 3600 |

### Registro CNAME (para www.syncpulse.com.br)

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| CNAME | www | SEU_USUARIO.github.io | 3600 |

**⚠️ Substitua `SEU_USUARIO` pelo seu usuário do GitHub**

## 📋 Configuração para Netlify

1. No Netlify, vá em **Site settings** > **Domain management**
2. Adicione `syncpulse.com.br`
3. O Netlify mostrará os registros DNS necessários
4. Copie e adicione na Hostinger conforme mostrado

## 📋 Configuração para Vercel

1. No Vercel, vá em **Settings** > **Domains**
2. Adicione `syncpulse.com.br`
3. O Vercel mostrará os registros DNS necessários
4. Copie e adicione na Hostinger conforme mostrado

## ✅ Passos para Adicionar Registros na Hostinger

1. Acesse o painel DNS conforme instruções acima
2. Clique em **"Adicionar Registro"** ou **"Add Record"**
3. Preencha os campos:
   - **Tipo:** Selecione A ou CNAME
   - **Nome:** @ (para domínio principal) ou www (para subdomínio)
   - **Valor:** IP ou domínio conforme tabela acima
   - **TTL:** 3600 (ou padrão)
4. Clique em **"Salvar"** ou **"Save"**
5. Repita para todos os registros necessários

## 🗑️ Remover Registros Antigos

**IMPORTANTE:** Antes de adicionar novos registros, remova qualquer registro A ou CNAME antigo que possa estar conflitando:

1. Na lista de registros DNS, identifique registros antigos
2. Clique em **"Excluir"** ou **"Delete"** nos registros que não são mais necessários
3. Confirme a exclusão

## ⏱️ Tempo de Propagação

- **Mínimo:** 1-2 horas
- **Máximo:** 24-48 horas
- **Médio: 4-6 horas**

Use [whatsmydns.net](https://www.whatsmydns.net) para verificar a propagação.

## 🔍 Verificação

Após configurar, verifique:

1. ✅ Registros DNS aparecem corretamente no painel da Hostinger
2. ✅ Site acessível em `https://syncpulse.com.br`
3. ✅ Site acessível em `https://www.syncpulse.com.br`
4. ✅ HTTPS funcionando (certificado SSL)

## 🆘 Problemas Comuns

**Não encontro a opção DNS na Hostinger:**
- Procure por "Zone Editor", "DNS Zone", "Gerenciar DNS" ou "DNS Records"
- A interface pode variar dependendo do plano

**Registros não estão funcionando:**
- Verifique se digitou corretamente os valores
- Aguarde o tempo de propagação
- Verifique se não há registros conflitantes

**Domínio não está na Hostinger:**
- Certifique-se de que a transferência foi concluída
- Entre em contato com o suporte da Hostinger se necessário

