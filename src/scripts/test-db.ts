import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    const userCount = await prisma.profile.count();
    const orderCount = await prisma.order.count();
    const driverCount = await prisma.driver.count();

    console.log('--- Sllam Database Status ---');
    console.log(`Total Profiles: ${userCount}`);
    console.log(`Total Drivers: ${driverCount}`);
    console.log(`Total Orders: ${orderCount}`);
    console.log('-----------------------------');
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
