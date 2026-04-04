import { prisma } from '@/lib/prisma';
import LocationsUI from './locations-ui';

export default async function LocationsManagement() {
    const locationsDb = await prisma.locationHierarchy.findMany({
        orderBy: { nameAr: 'asc' }
    });

    const locations = locationsDb.map((loc: any) => ({
        id: loc.id,
        parentId: loc.parentId,
        nameAr: loc.nameAr,
        nameEn: loc.nameEn || '',
        type: loc.type,
    }));

    return <LocationsUI initialLocations={locations} />;
}
