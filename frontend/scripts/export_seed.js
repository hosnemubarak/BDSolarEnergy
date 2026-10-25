import { createServer } from 'vite';
import fs from 'fs';

async function exportData() {
  const server = await createServer({
    server: { middlewareMode: true }
  });
  const { CATEGORIES } = await server.ssrLoadModule('./src/data/categories.ts');
  const { BRANDS } = await server.ssrLoadModule('./src/data/brands.ts');
  const { PRODUCTS } = await server.ssrLoadModule('./src/data/products.ts');
  const { SOLAR_PACKAGES } = await server.ssrLoadModule('./src/data/solarPackages.ts');
  await server.close();

  const data = {
    categories: CATEGORIES,
    brands: BRANDS,
    products: PRODUCTS,
    solarPackages: SOLAR_PACKAGES
  };

  fs.writeFileSync('../backend/seed_data.json', JSON.stringify(data, null, 2));
  console.log('Successfully exported seed_data.json:');
  console.log(`- Categories: ${CATEGORIES.length}`);
  console.log(`- Brands: ${BRANDS.length}`);
  console.log(`- Products: ${PRODUCTS.length}`);
  console.log(`- Solar Packages: ${SOLAR_PACKAGES.length}`);
}

exportData().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
