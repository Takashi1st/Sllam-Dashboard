import { prisma } from '@/lib/prisma';
import DashboardUI from './dashboard-ui';

export default async function AdminDashboard() {
    console.log('[Dashboard] Start fetching data...');
    const startTime = Date.now();

    // Fetch all metrics and recent orders in parallel for maximum speed
    const [profilesCount, driversCount, ordersCount, earningsResult, recentOrdersDb] = await Promise.all([
        prisma.profile.count(),
        prisma.driver.count(),
        prisma.order.count(),
        prisma.order.aggregate({
            _sum: { price: true },
            where: { status: 'delivered' }
        }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true }
                },
                driver: {
                    include: {
                        profile: {
                            select: { name: true }
                        }
                    }
                }
            }
        })
    ]);

    const totalEarnings = earningsResult._sum.price ? Number(earningsResult._sum.price) : 0;
    
    console.log(`[Dashboard] Data fetched in ${Date.now() - startTime}ms`);

    const recentOrders = recentOrdersDb.map(order => ({
        id: order.id.slice(0, 8),
        userName: order.user?.name || 'مستخدم مجهول',
        driverName: order.driver?.profile?.name || 'بانتظار سائق',
        status: order.status,
        price: order.price ? `${order.price.toLocaleString()} YER` : '---',
        createdAt: order.createdAt ?? new Date(),
    }));

    const stats = [
        {
            label: 'إجمالي المستخدمين',
            value: profilesCount.toLocaleString('ar'),
            change: '+0%',
            trend: 'up' as const,
            icon: 'users',
            color: 'bg-blue-500',
            gradient: 'from-blue-500 to-blue-600',
        },
        {
            label: 'السائقين المعتمدين',
            value: driversCount.toLocaleString('ar'),
            change: '+0%',
            trend: 'up' as const,
            icon: 'truck',
            color: 'bg-orange-500',
            gradient: 'from-orange-500 to-orange-600',
        },
        {
            label: 'إجمالي الطلبات',
            value: ordersCount.toLocaleString('ar'),
            change: '+0%',
            trend: 'up' as const,
            icon: 'package',
            color: 'bg-emerald-500',
            gradient: 'from-emerald-500 to-emerald-600',
        },
        {
            label: 'أرباح النظام',
            value: `${totalEarnings.toLocaleString('ar')} YER`,
            change: '+0%',
            trend: 'up' as const,
            icon: 'wallet',
            color: 'bg-purple-500',
            gradient: 'from-purple-500 to-purple-600',
        },
    ];

    return (
        <DashboardUI
            stats={stats}
            recentOrders={recentOrders}
        />
    );
}
