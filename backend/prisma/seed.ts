import 'dotenv/config';

import { PrismaClient, UserRole } from '@prisma/client';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured');
}

const ownerTelegramId = process.env.TELEGRAM_OWNER_ID?.trim();

if (!ownerTelegramId || !/^\d+$/.test(ownerTelegramId)) {
  throw new Error(
    'TELEGRAM_OWNER_ID must contain the numeric Telegram user ID',
  );
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const products = [
  {
    id: 1,
    title: 'Парусник Calypso',
    description:
      'Эксклюзивная модель пиратского корабля ручной работы из натурального дерева. Детализированные паруса, такелаж, пушки и декоративная подставка.',
    price: '2500.00',
    category: 'Корабли',
    wood: 'Орех, бук',
    size: '88 × 60 см',
    managerLink: 'https://t.me/your_manager',
    coverImage: 'https://images.unsplash.com/photo-1535024966841-1ea9d9b2b7f8',
  },
  {
    id: 2,
    title: 'Нарды Медведь',
    description:
      'Резные деревянные нарды с изображением медведя. Ручная обработка, выразительный рельеф и надежная фурнитура.',
    price: '1800.00',
    category: 'Нарды',
    wood: 'Ясень',
    size: '60 × 30 см',
    managerLink: 'https://t.me/your_manager',
    coverImage: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763',
  },
  {
    id: 3,
    title: 'Икона Георгий Победоносец',
    description:
      'Резная деревянная икона с декоративной рамой, колоннами и орнаментом. Подходит для дома или в качестве памятного подарка.',
    price: '1400.00',
    category: 'Иконы',
    wood: 'Липа',
    size: '45 × 30 см',
    managerLink: 'https://t.me/your_manager',
    coverImage: 'https://images.unsplash.com/photo-1548625361-58a9b86aa83b',
  },
  {
    id: 4,
    title: 'Шахматный набор Крепость',
    description:
      'Большой деревянный шахматный набор с резными фигурами и декоративным оформлением в стиле средневековой крепости.',
    price: '3200.00',
    category: 'Шахматы',
    wood: 'Дуб, орех',
    size: '70 × 70 см',
    managerLink: 'https://t.me/your_manager',
    coverImage: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b',
  },
  {
    id: 5,
    title: 'Резная шкатулка',
    description:
      'Деревянная шкатулка ручной работы с глубоким резным орнаментом. Подходит для украшений, документов и памятных вещей.',
    price: '950.00',
    category: 'Шкатулки',
    wood: 'Орех',
    size: '30 × 20 × 14 см',
    managerLink: 'https://t.me/your_manager',
    coverImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59',
  },
  {
    id: 6,
    title: 'Декоративное панно',
    description:
      'Настенное панно из натурального дерева с художественной резьбой и защитным покрытием.',
    price: '1200.00',
    category: 'Панно',
    wood: 'Бук',
    size: '60 × 40 см',
    managerLink: 'https://t.me/your_manager',
    coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38',
  },
];

async function normalizeUserRoles() {
  const demotedUsers = await prisma.user.updateMany({
    where: {
      telegramId: {
        not: ownerTelegramId,
      },
      role: {
        not: UserRole.USER,
      },
    },
    data: {
      role: UserRole.USER,
    },
  });

  const promotedOwner = await prisma.user.updateMany({
    where: {
      telegramId: ownerTelegramId,
    },
    data: {
      role: UserRole.OWNER,
    },
  });

  console.log(
    `User roles normalized. Demoted: ${demotedUsers.count}, owner rows updated: ${promotedOwner.count}`,
  );
}

async function seedProducts() {
  for (const product of products) {
    await prisma.product.upsert({
      where: {
        id: product.id,
      },

      update: {
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        wood: product.wood,
        size: product.size,
        managerLink: product.managerLink,
        coverImage: product.coverImage,
      },

      create: product,
    });
  }
}

async function synchronizeProductIdSequence() {
  await prisma.$queryRaw`
    SELECT setval(
      pg_get_serial_sequence('"Product"', 'id'),
      COALESCE(MAX("id"), 1),
      MAX("id") IS NOT NULL
    )
    FROM "Product"
  `;

  console.log('Product ID sequence synchronized.');
}

async function main() {
  console.log('Starting database seed...');

  await normalizeUserRoles();
  await seedProducts();
  await synchronizeProductIdSequence();

  console.log(`Seed completed. Products processed: ${products.length}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
