import { prisma } from '@/lib/prisma';
import OrdersUI from './orders-ui';

export default async function OrdersManagement() {
    const ordersDb = await prisma.order.findMany({
        include: {
            user: { select: { name: true } },
            driver: { include: { profile: { select: { name: true } } } },
            originArea: true,
            destArea: true
        },
        orderBy: { createdAt: 'desc' }
    });

    const orders = ordersDb.map((order: any) => ({
        id: order.id.slice(0, 8),
        userName: order.user?.name || 'مستخدم مجهول',
        driverName: order.driver?.profile?.name || 'بانتظار سائق',
        status: order.status,
        price: order.price ? `${order.price.toLocaleString()} YER` : '---',
        origin: order.originArea?.nameAr || 'غير محدد',
        destination: order.destArea?.nameAr || 'غير محدد',
        createdAt: order.createdAt
    }));

    return <OrdersUI initialOrders={orders} />;
}
