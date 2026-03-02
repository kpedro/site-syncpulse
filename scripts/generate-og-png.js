/**
 * Gera og-image-whatsapp.png a partir do SVG para preview no WhatsApp/Facebook.
 * WhatsApp não suporta SVG - precisa de PNG ou JPG.
 * Execute: npm run generate-og-png
 */
const path = require('path');
const sharp = require('sharp');

const svgPath = path.join(__dirname, '../public/og-image-whatsapp.svg');
const pngPath = path.join(__dirname, '../public/og-image-whatsapp.png');

sharp(svgPath)
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log('✅ og-image-whatsapp.png gerado em public/');
  })
  .catch((err) => {
    console.error('❌ Erro ao gerar PNG:', err.message);
    process.exit(1);
  });
