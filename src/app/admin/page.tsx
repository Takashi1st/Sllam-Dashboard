import { prisma } from '@/lib/prisma';
import DashboardUI from './dashboard-ui';

export default async function AdminDashboard() {
    // Fetch metrics from database
    const [profilesCount, driversCount, ordersCount, earningsResult] = await Promise.all([
        prisma.profile.count(),
        prisma.driver.count(),
        prisma.order.count(),
        prisma.order.aggregate({
            _sum: { price: true },
            where: { status: 'delivered' }
        })
    ]);

    const totalEarnings = earningsResult._sum.price ? Number(earningsResult._sum.price) : 0;

    // Fetch recent orders
    const recentOrdersDb = await prisma.order.findMany({
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
    });

    const recentOrders = recentOrdersDb.map(order => ({
        id: order.id.slice(0, 8),
        userName: order.user?.name || 'مستخدم مجهول',
        driverName: order.driver?.profile?.name || 'بانتظار سائق',
        status: order.status,
        price: order.price ? `${order.price.toLocaleString()} YER` : '---',
        createdAt: order.createdAt
    }));

    const stats = [
        {
            label: 'إجمالي المستخدمين',
            value: profilesCount.toLocaleString(),
            change: '+0%', // Placeholder for now
            trend: 'up',
            icon: 'users',
            color: 'bg-blue-500'
        },
        {
            label: 'السائقين المعتمدين',
            value: driversCount.toLocaleString(),
            change: '+0%',
            trend: 'up',
            icon: 'truck',
            color: 'bg-orange-500'
        },
        {
            label: 'إجمالي الطلبات',
            value: ordersCount.toLocaleString(),
            change: '+0%',
            trend: 'up',
            icon: 'package',
            color: 'bg-green-500'
        },
        {
            label: 'أرباح النظام',
            value: `${totalEarnings.toLocaleString()} YER`,
            change: '+0%',
            trend: 'up',
            icon: 'wallet',
            color: 'bg-purple-500'
        },
    ];

    return (
        <DashboardUI
            stats={stats}
            recentOrders={recentOrders}
        />
    );
}
