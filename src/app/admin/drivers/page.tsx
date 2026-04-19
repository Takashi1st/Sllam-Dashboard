import { prisma } from '@/lib/prisma';
import DriversUI from './drivers-ui';

export default async function DriversManagement() {
    const driversDb = await prisma.driver.findMany({
        take: 50,
        include: {
            profile: true
        },
        orderBy: {
            profile: {
                createdAt: 'desc'
            }
        }
    });

    const drivers = driversDb.map((driver: any) => ({
        id: driver.id,
        name: driver.profile.name,
        phone: driver.profile.phoneNumber,
        vehicle: driver.vehicleType,
        plate: driver.vehiclePlate,
        rating: driver.rating || 5.0,
        status: driver.currentStatus,
        wallet: `${driver.walletBalance?.toLocaleString() || '0'} YER`
    }));

    return <DriversUI initialDrivers={drivers} />;
}
