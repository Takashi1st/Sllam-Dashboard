'use server';

import { prisma } from '@/lib/prisma';

import { revalidatePath } from 'next/cache';

export async function promoteToAdmin(userId: string) {
    try {
        await prisma.profile.update({
            where: { id: userId },
            data: { role: 'admin' }
        });
        revalidatePath('/admin/users');
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
        revalidatePath('/admin/users');
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
        revalidatePath('/admin/locations');
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
        revalidatePath('/admin/locations');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to update location:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteLocation(id: string) {
    try {
        await prisma.locationHierarchy.delete({
            where: { id }
        });
        revalidatePath('/admin/locations');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to delete location:', error);
        return { success: false, error: error.message };
    }
}

// Package Categories
export async function addPackageCategory(data: { nameAr: string, nameEn?: string }) {
    try {
        await prisma.packageCategory.create({ data });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updatePackageCategory(id: string, data: { nameAr: string, nameEn?: string, isActive?: boolean }) {
    try {
        await prisma.packageCategory.update({ where: { id }, data });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deletePackageCategory(id: string) {
    try {
        await prisma.packageCategory.delete({ where: { id } });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Vehicle Types
export async function addVehicleType(data: { nameAr: string, nameEn?: string, baseFare: number, perKmRate: number }) {
    try {
        await prisma.vehicleType.create({ data });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateVehicleType(id: string, data: { nameAr?: string, baseFare?: number, perKmRate?: number, isActive?: boolean }) {
    try {
        await prisma.vehicleType.update({ where: { id }, data });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteVehicleType(id: string) {
    try {
        await prisma.vehicleType.delete({ where: { id } });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Package Size Pricing
export async function addPackageSizePricing(data: { nameAr: string, maxWeight: number, price: number }) {
    try {
        await prisma.packageSizePricing.create({ data });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updatePackageSizePricing(id: string, data: { nameAr?: string, maxWeight?: number, price?: number, isActive?: boolean }) {
    try {
        await prisma.packageSizePricing.update({ where: { id }, data });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deletePackageSizePricing(id: string) {
    try {
        await prisma.packageSizePricing.delete({ where: { id } });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

