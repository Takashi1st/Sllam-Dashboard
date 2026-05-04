'use client';

import { motion } from 'framer-motion';
import {
    Users,
    Truck,
    Package,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    TrendingUp,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Stat {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: string;
    color: string;
    gradient: string;
}

interface RecentOrder {
    id: string;
    userName: string;
    driverName: string;
    status: string;
    price: string;
    createdAt: string | Date;
}

interface DashboardUIProps {
    stats: Stat[];
    recentOrders: RecentOrder[];
}

const iconMap: Record<string, React.ElementType> = {
    users: Users,
    truck: Truck,
    package: Package,
    wallet: Wallet,
};

const statusMap: Record<string, { label: string; class: string }> = {
    pending: { label: 'قيد الانتظار', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    confirmed: { label: 'مؤكد', class: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    picking_up: { label: 'جاري الاستلام', class: 'bg-orange-100 text-orange-700 border-orange-200' },
    in_transit: { label: 'قيد التوصيل', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    delivered: { label: 'تم التسليم', class: 'bg-green-100 text-green-700 border-green-200' },
    cancelled: { label: 'ملغي', class: 'bg-red-100 text-red-700 border-red-200' },
};

export default function DashboardUI({ stats, recentOrders }: DashboardUIProps) {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور';

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="text-right">
                    <p className="text-sm text-gray-400 font-medium">{greeting} 👋</p>
                    <h1 className="text-2xl font-bold text-gray-900 mt-0.5">لوحة التحكم</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {now.toLocaleDateString('ar-YE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    النظام يعمل بشكل طبيعي
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, i) => {
                    const Icon = iconMap[stat.icon];
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-default group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {stat.trend === 'up'
                                        ? <ArrowUpRight size={12} />
                                        : <ArrowDownRight size={12} />
                                    }
                                    {stat.change}
                                </div>
                                <div className={`p-2.5 rounded-xl ${stat.color} text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    {Icon && <Icon size={20} />}
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 text-right" dir="ltr">{stat.value}</p>
                            <p className="text-sm text-gray-500 mt-1 text-right">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                    <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                        <a
                            href="/admin/orders"
                            className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 transition-colors"
                        >
                            عرض الكل
                            <ArrowUpRight size={14} />
                        </a>
                        <div className="text-right">
                            <h2 className="font-bold text-gray-900">آخر الطلبات</h2>
                            <p className="text-xs text-gray-400 mt-0.5">آخر {recentOrders.length} طلبات</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right" dir="rtl">
                            <thead className="bg-gray-50/60 text-gray-400 text-xs">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">رقم الطلب</th>
                                    <th className="px-5 py-3 font-semibold">العميل</th>
                                    <th className="px-5 py-3 font-semibold">السائق</th>
                                    <th className="px-5 py-3 font-semibold">الحالة</th>
                                    <th className="px-5 py-3 font-semibold">السعر</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-3.5 font-mono text-blue-600 font-bold text-xs">
                                                #{order.id}
                                            </td>
                                            <td className="px-5 py-3.5 font-medium text-gray-800">{order.userName}</td>
                                            <td className="px-5 py-3.5 text-gray-500 text-xs">{order.driverName}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold border ${statusMap[order.status]?.class || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                    {statusMap[order.status]?.label || order.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-gray-800 font-mono text-xs" dir="ltr">
                                                {order.price}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2 text-gray-300">
                                                <Package size={32} className="opacity-40" />
                                                <p className="text-sm">لا توجد طلبات حالياً</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Activity Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                    <div className="flex items-center justify-between mb-5">
                        <TrendingUp size={16} className="text-gray-300" />
                        <div className="text-right">
                            <h2 className="font-bold text-gray-900">النشاطات الأخيرة</h2>
                            <p className="text-xs text-gray-400 mt-0.5">آخر تحديثات النظام</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order, i) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.06 }}
                                    className="flex gap-3 items-start flex-row-reverse"
                                >
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm ${
                                        ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500'][i % 5]
                                    }`}>
                                        {order.userName?.[0] || '؟'}
                                    </div>
                                    <div className="flex-1 min-w-0 text-right">
                                        <p className="text-xs font-semibold text-gray-800 leading-tight">
                                            طلب جديد من{' '}
                                            <span className="text-blue-600">{order.userName}</span>
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar })}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-8 text-center">
                                <Clock size={28} className="text-gray-200 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">لا توجد نشاطات مسجلة</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
