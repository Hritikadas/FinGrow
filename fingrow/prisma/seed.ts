import { PrismaClient } from '@prisma/client';
import { defaultBundles } from '../src/data/bundles';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed bundles
  for (const bundle of defaultBundles) {
    await prisma.bundle.upsert({
      where: { type: bundle.type },
      update: bundle,
      create: bundle,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
