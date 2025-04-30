import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

prisma
  .$connect()
  .then(() => console.log('Connected to PostgreSQL via Prisma'))
  .catch((err: Error) => {
    console.error('Connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
const shutdown = async () => {
  await prisma.$disconnect();
  console.log('Prisma client disconnected');

  await prisma.$connect();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default prisma;
