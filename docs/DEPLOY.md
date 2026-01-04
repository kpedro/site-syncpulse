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

### Opção A: GitHub Pages

1. No GitHub, vá em **Settings** > **Pages**
2. Em **Custom domain**, digite: `syncpulse.com.br`
3. Clique em **Save**

3. Configure os registros DNS no seu provedor de domínio:

**Registros DNS necessários:**
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

Tipo: CNAME
Nome: www
Valor: SEU_USUARIO.github.io
TTL: 3600
```

4. Aguarde a propagação DNS (pode levar até 24 horas)
5. O GitHub criará automaticamente um arquivo `CNAME` no repositório

### Opção B: Netlify (Recomendado para mais controle)

1. Acesse [Netlify.com](https://netlify.com) e faça login com GitHub
2. Clique em **"Add new site"** > **"Import an existing project"**
3. Selecione o repositório `site-syncpulse`
4. Configure:
   - **Build command:** (deixe vazio - site estático)
   - **Publish directory:** `/` (root)
5. Clique em **"Deploy site"**
6. Após deploy, vá em **Site settings** > **Domain management**
7. Clique em **"Add custom domain"** e digite `syncpulse.com.br`
8. Configure os registros DNS conforme instruções do Netlify

### Opção C: Vercel

1. Acesse [Vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório `site-syncpulse`
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
5. Clique em **"Deploy"**
6. Após deploy, vá em **Settings** > **Domains**
7. Adicione `syncpulse.com.br` e configure DNS conforme instruções

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
- Verifique se os registros DNS estão corretos
- Aguarde até 24 horas para propagação completa
- Use ferramentas como [whatsmydns.net](https://www.whatsmydns.net) para verificar

**Problema:** Site não atualiza após push
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique se o commit foi feito corretamente
- Aguarde alguns minutos para o deploy

**Problema:** HTTPS não funciona
- Aguarde alguns minutos após configurar o domínio
- Verifique se o domínio está apontando corretamente
- Alguns serviços podem levar até 24h para emitir certificado SSL

