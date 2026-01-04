# Guia de Deploy - SyncPulse

## 📦 Passo 1: Criar Repositório no GitHub

1. Acesse [GitHub.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito > **"New repository"**
3. Configure o repositório:
   - **Nome:** `site-syncpulse` (ou outro nome de sua preferência)
   - **Descrição:** "Site institucional SyncPulse - Apps educacionais com IA"
   - **Visibilidade:** Público (para GitHub Pages gratuito) ou Privado
   - **NÃO** marque "Initialize with README" (já temos um)
4. Clique em **"Create repository"**

## 🔗 Passo 2: Conectar Repositório Local ao GitHub

Execute os seguintes comandos no terminal (substitua `SEU_USUARIO` pelo seu usuário do GitHub):

```bash
# Adicionar o repositório remoto
git remote add origin https://github.com/SEU_USUARIO/site-syncpulse.git

# Renomear branch para main (se necessário)
git branch -M main

# Fazer push do código
git push -u origin main
```

## 🌐 Passo 3: Configurar GitHub Pages

1. No repositório do GitHub, vá em **Settings** > **Pages**
2. Em **Source**, selecione:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
3. Clique em **Save**
4. Aguarde alguns minutos para o site ficar disponível em:
   - `https://SEU_USUARIO.github.io/site-syncpulse/`

## 🔧 Passo 4: Configurar Domínio Customizado (syncpulse.com.br)

**⚠️ IMPORTANTE:** O domínio está gerenciado na Hostinger. Configure os DNS no painel da Hostinger.

### Opção A: GitHub Pages + Hostinger

1. No GitHub, vá em **Settings** > **Pages**
2. Em **Custom domain**, digite: `syncpulse.com.br`
3. Clique em **Save**
4. O GitHub criará automaticamente um arquivo `CNAME` no repositório

5. **Configure DNS na Hostinger:**
   - Acesse o painel da Hostinger: [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Vá em **Domínios** > **Gerenciar** > **syncpulse.com.br**
   - Clique em **DNS / Zone Editor** ou **Gerenciar DNS**
   
   **Adicione os seguintes registros:**

   **Registros A (para domínio principal):**
   ```
   Tipo: A
   Nome: @
   Valor: 185.199.108.153
   TTL: 3600 (ou padrão)
   
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

   **Registro CNAME (para www):**
   ```
   Tipo: CNAME
   Nome: www
   Valor: SEU_USUARIO.github.io
   TTL: 3600
   ```

6. **Remova registros conflitantes:**
   - Remova qualquer registro A ou CNAME antigo que aponte para outros IPs
   - Mantenha apenas os registros do GitHub Pages listados acima

7. Aguarde a propagação DNS (pode levar de 1 a 24 horas)

### Opção B: Netlify (Recomendado para mais controle) + Hostinger

1. Acesse [Netlify.com](https://netlify.com) e faça login com GitHub
2. Clique em **"Add new site"** > **"Import an existing project"**
3. Selecione o repositório `site-syncpulse`
4. Configure:
   - **Build command:** (deixe vazio - site estático)
   - **Publish directory:** `/` (root)
5. Clique em **"Deploy site"**
6. Após deploy, vá em **Site settings** > **Domain management**
7. Clique em **"Add custom domain"** e digite `syncpulse.com.br`
8. **Configure DNS na Hostinger:**
   - Acesse [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Vá em **Domínios** > **Gerenciar** > **syncpulse.com.br** > **DNS / Zone Editor**
   - O Netlify mostrará os registros DNS necessários
   - Adicione os registros conforme mostrado no painel do Netlify
   - Geralmente será um registro A ou CNAME apontando para o Netlify

### Opção C: Vercel + Hostinger

1. Acesse [Vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório `site-syncpulse`
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
5. Clique em **"Deploy"**
6. Após deploy, vá em **Settings** > **Domains**
7. Adicione `syncpulse.com.br`
8. **Configure DNS na Hostinger:**
   - Acesse [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Vá em **Domínios** > **Gerenciar** > **syncpulse.com.br** > **DNS / Zone Editor**
   - O Vercel mostrará os registros DNS necessários
   - Adicione os registros conforme mostrado no painel do Vercel
   - Geralmente será um registro A ou CNAME apontando para o Vercel

## ✅ Verificação

Após configurar o domínio, verifique:

1. ✅ Site acessível em `https://syncpulse.com.br`
2. ✅ Site acessível em `https://www.syncpulse.com.br` (redirecionamento)
3. ✅ HTTPS funcionando (certificado SSL automático)
4. ✅ Favicon aparecendo no navegador
5. ✅ Preview funcionando ao compartilhar nas redes sociais

## 🔄 Atualizações Futuras

Para atualizar o site após fazer mudanças:

```bash
# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para GitHub
git push origin main
```

O site será atualizado automaticamente em alguns minutos.

## 📝 Notas Importantes

- **GitHub Pages:** Gratuito, mas pode ter limitações de largura de banda
- **Netlify:** Gratuito com mais recursos, melhor para sites estáticos
- **Vercel:** Gratuito, excelente performance, ideal para projetos modernos
- Todos os serviços oferecem HTTPS gratuito e automático
- Certifique-se de que o domínio está configurado corretamente antes de fazer o deploy

## 🆘 Troubleshooting

**Problema:** Domínio não está funcionando
- Verifique se os registros DNS estão corretos no painel da Hostinger
- Aguarde até 24 horas para propagação completa
- Use ferramentas como [whatsmydns.net](https://www.whatsmydns.net) para verificar
- Verifique se não há registros DNS conflitantes na Hostinger

**Problema:** Não consigo acessar o painel DNS da Hostinger
- Acesse: [hpanel.hostinger.com](https://hpanel.hostinger.com)
- Faça login com suas credenciais da Hostinger
- Navegue: **Domínios** > **Gerenciar** > **syncpulse.com.br** > **DNS / Zone Editor**

**Problema:** Site não atualiza após push
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique se o commit foi feito corretamente
- Aguarde alguns minutos para o deploy

**Problema:** HTTPS não funciona
- Aguarde alguns minutos após configurar o domínio
- Verifique se o domínio está apontando corretamente na Hostinger
- Alguns serviços podem levar até 24h para emitir certificado SSL
- Certifique-se de que os registros DNS estão corretos

**Problema:** Erro ao adicionar registros na Hostinger
- Certifique-se de estar na seção correta: **DNS / Zone Editor**
- Remova registros antigos que possam estar conflitando
- Use TTL padrão (geralmente 3600) se não tiver certeza

