import { prisma } from '@/lib/prisma';
import UsersUI from './users-ui';

export default async function UsersManagement() {
    const profiles = await prisma.profile.findMany({
        take: 100, // Speed up initial load
        orderBy: { createdAt: 'desc' }
    });

    const users = profiles.map((profile: any) => ({
        id: profile.id,
        name: profile.name,
        phone: profile.phoneNumber,
        role: profile.role === 'driver' ? 'سائق' : (profile.role === 'admin' ? 'مدير' : 'عميل'),
        status: profile.status,
        createdAt: profile.createdAt
    }));

    return <UsersUI initialUsers={users} />;
}
