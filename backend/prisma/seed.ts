import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed sample modules
  const modules = [
    {
      title: 'Understanding Male Anatomy',
      description: 'A comprehensive guide to male reproductive and overall health.',
      category: 'Fundamentals',
      isAdultOnly: false,
      order: 1,
    },
    {
      title: 'Hormones & Testosterone',
      description: 'Learn how hormones affect your mood, energy, and health.',
      category: 'Hormones',
      isAdultOnly: false,
      order: 2,
    },
    {
      title: 'Mental Health for Men',
      description: 'Breaking the stigma around men\'s mental health.',
      category: 'Mental Health',
      isAdultOnly: false,
      order: 3,
    },
    {
      title: 'Fitness & Nutrition',
      description: 'Evidence-based exercise and diet guidance for men.',
      category: 'Lifestyle',
      isAdultOnly: false,
      order: 4,
    },
    {
      title: 'Sleep & Recovery',
      description: 'How to optimize sleep for peak health performance.',
      category: 'Lifestyle',
      isAdultOnly: false,
      order: 5,
    },
    {
      title: 'Sexual Health Education',
      description: 'Adult-only comprehensive sexual health and wellness module.',
      category: 'Sexual Health',
      isAdultOnly: true,
      order: 6,
    },
  ];

  for (const mod of modules) {
    await prisma.module.upsert({
      where: { id: mod.title }, // using title as fallback; adjust if needed
      update: {},
      create: mod,
    }).catch(() => prisma.module.create({ data: mod }));
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
