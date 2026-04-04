'use server';

import { prisma } from '@/lib/prisma';

export async function promoteToAdmin(userId: string) {
    try {
        await prisma.profile.update({
            where: { id: userId },
            data: { role: 'admin' }
        });
        return { success: true };
    } catch (error: any) {
        console.error('Failed to promote user:', error);
        return { success: false, error: error.message };
    }
}
