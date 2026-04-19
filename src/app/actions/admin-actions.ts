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

export async function updateUserStatus(userId: string, newStatus: string) {
    try {
        await prisma.profile.update({
            where: { id: userId },
            data: { status: newStatus }
        });
        return { success: true };
    } catch (error: any) {
        console.error('Failed to update status:', error);
        return { success: false, error: error.message };
    }
}

export async function resetUserPassword(userId: string) {
    try {
        await prisma.profile.update({
            where: { id: userId },
            data: { needsPasswordReset: true }
        });
        return { success: true };
    } catch (error: any) {
        console.error('Failed to reset password:', error);
        return { success: false, error: error.message };
    }
}

export async function addLocation(data: { nameAr: string, nameEn?: string, type: string, parentId?: string }) {
    try {
        await prisma.locationHierarchy.create({
            data: {
                nameAr: data.nameAr,
                nameEn: data.nameEn,
                type: data.type,
                parentId: data.parentId
            }
        });
        return { success: true };
    } catch (error: any) {
        console.error('Failed to add location:', error);
        return { success: false, error: error.message };
    }
}

export async function updateLocation(id: string, data: { nameAr: string, nameEn?: string }) {
    try {
        await prisma.locationHierarchy.update({
            where: { id },
            data: {
                nameAr: data.nameAr,
                nameEn: data.nameEn
            }
        });
        return { success: true };
    } catch (error: any) {
        console.error('Failed to update location:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteLocation(id: string) {
    try {
        // Note: Prisma will handle referential integrity if configured, 
        // but let's be careful with children.
        await prisma.locationHierarchy.delete({
            where: { id }
        });
        return { success: true };
    } catch (error: any) {
        console.error('Failed to delete location:', error);
        return { success: false, error: error.message };
    }
}
