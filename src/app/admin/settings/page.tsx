import { prisma } from '@/lib/prisma';
import SettingsUI from './settings-ui';

export default async function SettingsPage() {
    const [categories, vehicleTypes, sizePricing] = await Promise.all([
        prisma.packageCategory.findMany({ orderBy: { nameAr: 'asc' } }),
        prisma.vehicleType.findMany({ orderBy: { nameAr: 'asc' } }),
        prisma.packageSizePricing.findMany({ orderBy: { maxWeight: 'asc' } }),
    ]);

    return (
        <SettingsUI 
            categories={categories}
            vehicleTypes={vehicleTypes}
            sizePricing={sizePricing}
        />
    );
}
