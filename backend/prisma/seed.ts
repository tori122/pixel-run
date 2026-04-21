import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://dino:dino1234@localhost:5433/dino?schema=public';
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  // game_settings 초기 데이터
  await prisma.gameSetting.upsert({
    where: { key: 'happy_ending_score' },
    update: {},
    create: { key: 'happy_ending_score', value: '10000' },
  });

  console.log('Seed completed: game_settings');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
