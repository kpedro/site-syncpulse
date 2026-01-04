# Pasta Public - Assets do Site

Esta pasta contém os arquivos públicos do site SyncPulse.

## Arquivos Atuais

- `favicon.svg` - Ícone do site (favicon)
- `og-image.svg` - Imagem de preview para redes sociais (Open Graph)

## Como Adicionar Imagens dos Apps

Para adicionar imagens dos apps (screenshots, logos, etc.):

1. Coloque as imagens nesta pasta `public/`
2. Nomeie os arquivos de forma descritiva:
   - `pedagoflow-preview.jpg` ou `.png`
   - `mente-construcao-preview.jpg` ou `.png`
   - `astroflux-preview.jpg` ou `.png`

3. Use formatos otimizados:
   - JPG para fotos/screenshots
   - PNG para logos com transparência
   - WebP para melhor compressão (opcional)

4. Tamanhos recomendados:
   - Screenshots de apps: 800x600px ou 1200x900px
   - Logos: 400x400px ou proporção 1:1
   - Banners: 1200x630px (mesmo tamanho do og-image)

5. Após adicionar, atualize os cards em `src/pages/apps.html` e `index.html` com:
   ```html
   <img src="../../public/nome-da-imagem.jpg" alt="Descrição da imagem" class="app-image" />
   ```

## Otimização

- Comprima imagens antes de adicionar (use ferramentas como TinyPNG)
- Mantenha arquivos menores que 500KB quando possível
- Use lazy loading para melhor performance

