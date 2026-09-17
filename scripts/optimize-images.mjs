import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

async function optimizeImages() {
  console.log('--- Iniciando Otimização de Imagens ---');

  // 1. Logo (Original: 558 KB) -> Reduzir para max 256x256 WebP e PNG
  if (fs.existsSync(path.join(publicDir, 'logo.png'))) {
    const origSize = fs.statSync(path.join(publicDir, 'logo.png')).size;
    await sharp(path.join(publicDir, 'logo.png'))
      .resize({ width: 256, withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(path.join(publicDir, 'logo.webp'));
    
    // Otimizar também o fallback logo.png
    await sharp(path.join(publicDir, 'logo.png'))
      .resize({ width: 256, withoutEnlargement: true })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'logo.opt.png'));
    fs.renameSync(path.join(publicDir, 'logo.opt.png'), path.join(publicDir, 'logo.png'));

    const webpSize = fs.statSync(path.join(publicDir, 'logo.webp')).size;
    const pngSize = fs.statSync(path.join(publicDir, 'logo.png')).size;
    console.log(`logo: ${Math.round(origSize/1024)}KB -> WebP ${Math.round(webpSize/1024)}KB | PNG ${Math.round(pngSize/1024)}KB`);
  }

  // 2. Natalia Profile (Avatar dos Links)
  if (fs.existsSync(path.join(publicDir, 'natalia-profile.jpg'))) {
    const origSize = fs.statSync(path.join(publicDir, 'natalia-profile.jpg')).size;
    await sharp(path.join(publicDir, 'natalia-profile.jpg'))
      .resize({ width: 400, height: 400, fit: 'cover', position: 'top' })
      .webp({ quality: 85 })
      .toFile(path.join(publicDir, 'natalia-profile.webp'));

    await sharp(path.join(publicDir, 'natalia-profile.jpg'))
      .resize({ width: 400, height: 400, fit: 'cover', position: 'top' })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(path.join(publicDir, 'natalia-profile.opt.jpg'));
    fs.renameSync(path.join(publicDir, 'natalia-profile.opt.jpg'), path.join(publicDir, 'natalia-profile.jpg'));

    const webpSize = fs.statSync(path.join(publicDir, 'natalia-profile.webp')).size;
    console.log(`natalia-profile: ${Math.round(origSize/1024)}KB -> WebP ${Math.round(webpSize/1024)}KB`);
  }

  // 3. Natalia Mentora (Imersão)
  if (fs.existsSync(path.join(publicDir, 'natalia-mentora.jpg'))) {
    const origSize = fs.statSync(path.join(publicDir, 'natalia-mentora.jpg')).size;
    await sharp(path.join(publicDir, 'natalia-mentora.jpg'))
      .resize({ width: 700, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(publicDir, 'natalia-mentora.webp'));

    await sharp(path.join(publicDir, 'natalia-mentora.jpg'))
      .resize({ width: 700, withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(path.join(publicDir, 'natalia-mentora.opt.jpg'));
    fs.renameSync(path.join(publicDir, 'natalia-mentora.opt.jpg'), path.join(publicDir, 'natalia-mentora.jpg'));

    const webpSize = fs.statSync(path.join(publicDir, 'natalia-mentora.webp')).size;
    console.log(`natalia-mentora: ${Math.round(origSize/1024)}KB -> WebP ${Math.round(webpSize/1024)}KB`);
  }

  // 4. Hero Coins 3D (Imersão - 811 KB)
  if (fs.existsSync(path.join(publicDir, 'hero-coins-3d.jpg'))) {
    const origSize = fs.statSync(path.join(publicDir, 'hero-coins-3d.jpg')).size;
    await sharp(path.join(publicDir, 'hero-coins-3d.jpg'))
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(publicDir, 'hero-coins-3d.webp'));

    await sharp(path.join(publicDir, 'hero-coins-3d.jpg'))
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(publicDir, 'hero-coins-3d.opt.jpg'));
    fs.renameSync(path.join(publicDir, 'hero-coins-3d.opt.jpg'), path.join(publicDir, 'hero-coins-3d.jpg'));

    const webpSize = fs.statSync(path.join(publicDir, 'hero-coins-3d.webp')).size;
    const jpgSize = fs.statSync(path.join(publicDir, 'hero-coins-3d.jpg')).size;
    console.log(`hero-coins-3d: ${Math.round(origSize/1024)}KB -> WebP ${Math.round(webpSize/1024)}KB | JPG ${Math.round(jpgSize/1024)}KB`);
  }

  // 5. Certificado Imersão (987 KB)
  if (fs.existsSync(path.join(publicDir, 'certificado-imersao.png'))) {
    const origSize = fs.statSync(path.join(publicDir, 'certificado-imersao.png')).size;
    await sharp(path.join(publicDir, 'certificado-imersao.png'))
      .resize({ width: 900, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(publicDir, 'certificado-imersao.webp'));

    await sharp(path.join(publicDir, 'certificado-imersao.png'))
      .resize({ width: 900, withoutEnlargement: true })
      .png({ quality: 85, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'certificado-imersao.opt.png'));
    fs.renameSync(path.join(publicDir, 'certificado-imersao.opt.png'), path.join(publicDir, 'certificado-imersao.png'));

    const webpSize = fs.statSync(path.join(publicDir, 'certificado-imersao.webp')).size;
    console.log(`certificado-imersao: ${Math.round(origSize/1024)}KB -> WebP ${Math.round(webpSize/1024)}KB`);
  }

  // 6. Imersão Banner (978 KB)
  if (fs.existsSync(path.join(publicDir, 'imersao-banner.png'))) {
    const origSize = fs.statSync(path.join(publicDir, 'imersao-banner.png')).size;
    await sharp(path.join(publicDir, 'imersao-banner.png'))
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(publicDir, 'imersao-banner.webp'));

    await sharp(path.join(publicDir, 'imersao-banner.png'))
      .resize({ width: 1200, withoutEnlargement: true })
      .png({ quality: 85, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'imersao-banner.opt.png'));
    fs.renameSync(path.join(publicDir, 'imersao-banner.opt.png'), path.join(publicDir, 'imersao-banner.png'));

    const webpSize = fs.statSync(path.join(publicDir, 'imersao-banner.webp')).size;
    console.log(`imersao-banner: ${Math.round(origSize/1024)}KB -> WebP ${Math.round(webpSize/1024)}KB`);
  }

  // 7. Hero Banner (697 KB)
  if (fs.existsSync(path.join(publicDir, 'hero-banner.jpg'))) {
    const origSize = fs.statSync(path.join(publicDir, 'hero-banner.jpg')).size;
    await sharp(path.join(publicDir, 'hero-banner.jpg'))
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(publicDir, 'hero-banner.webp'));
    const webpSize = fs.statSync(path.join(publicDir, 'hero-banner.webp')).size;
    console.log(`hero-banner: ${Math.round(origSize/1024)}KB -> WebP ${Math.round(webpSize/1024)}KB`);
  }

  // 8. Vera Avatar (627 KB)
  if (fs.existsSync(path.join(publicDir, 'vera-avatar.jpg'))) {
    const origSize = fs.statSync(path.join(publicDir, 'vera-avatar.jpg')).size;
    await sharp(path.join(publicDir, 'vera-avatar.jpg'))
      .resize({ width: 400, height: 400, fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(path.join(publicDir, 'vera-avatar.webp'));
    const webpSize = fs.statSync(path.join(publicDir, 'vera-avatar.webp')).size;
    console.log(`vera-avatar: ${Math.round(origSize/1024)}KB -> WebP ${Math.round(webpSize/1024)}KB`);
  }

  // 9. Vault Empty (610 KB)
  if (fs.existsSync(path.join(publicDir, 'vault-empty.jpg'))) {
    const origSize = fs.statSync(path.join(publicDir, 'vault-empty.jpg')).size;
    await sharp(path.join(publicDir, 'vault-empty.jpg'))
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(publicDir, 'vault-empty.webp'));
    const webpSize = fs.statSync(path.join(publicDir, 'vault-empty.webp')).size;
    console.log(`vault-empty: ${Math.round(origSize/1024)}KB -> WebP ${Math.round(webpSize/1024)}KB`);
  }

  console.log('--- Otimização de Imagens Concluída com Sucesso ---');
}

optimizeImages().catch(console.error);
