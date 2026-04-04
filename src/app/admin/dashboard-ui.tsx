'use client';

import { motion } from 'framer-motion';
import {
    Users,
    Truck,
    Package,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface DashboardUIProps {
    stats: any[];
    recentOrders: any[];
}

const iconMap: any = {
    users: Users,
    truck: Truck,
    package: Package,
    wallet: Wallet,
};

const statusMap: any = {
    pending: { label: 'قيد الانتظار', class: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: 'مؤكد', class: 'bg-indigo-100 text-indigo-700' },
    picking_up: { label: 'جاري الاستلام', class: 'bg-orange-100 text-orange-700' },
    in_transit: { label: 'قيد التوصيل', class: 'bg-blue-100 text-blue-700' },
    delivered: { label: 'تم التسليم', class: 'bg-green-100 text-green-700' },
    cancelled: { label: 'ملغي', class: 'bg-red-100 text-red-700' },
};

export default function DashboardUI({ stats, recentOrders }: DashboardUIProps) {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 text-right">لوحة التحكم</h1>
                <p className="text-gray-500 text-right">أرقام حقيقية من قاعدة البيانات</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = iconMap[stat.icon];
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-right"
                        >
                            <div className="flex items-center justify-between mb-4 flex-row-reverse">
                                <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                                    <Icon size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex-row-reverse`}>
                                    {stat.change}
                                    {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                </div>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                            <p className="text-2xl font-bold mt-1 text-left" dir="ltr">{stat.value}</p>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-right">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between flex-row-reverse">
                        <h2 className="font-bold text-lg">آخر الطلبات</h2>
                        <button className="text-blue-600 text-sm font-medium hover:underline">عرض الكل</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right" dir="rtl">
                            <thead className="bg-gray-50 text-gray-500 text-sm font-arabic">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">رقم الطلب</th>
                                    <th className="px-6 py-4 font-semibold">العميل</th>
                                    <th className="px-6 py-4 font-semibold">السائق</th>
                                    <th className="px-6 py-4 font-semibold">الحالة</th>
                                    <th className="px-6 py-4 font-semibold">السعر</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-blue-600 font-mono text-sm">#{order.id}</td>
                                            <td className="px-6 py-4 text-gray-700">{order.userName}</td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{order.driverName}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusMap[order.status]?.class || 'bg-gray-100'}`}>
                                                    {statusMap[order.status]?.label || order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold" dir="ltr">{order.price}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                            لا توجد طلبات حالياً
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-right">
                    <h2 className="font-bold text-lg mb-6">النشاطات الأخيرة</h2>
                    <div className="space-y-6">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order, i) => (
                                <div key={order.id} className="flex gap-4 flex-row-reverse text-right">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-500">
                                        <Clock size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">
                                            طلب جديد من {order.userName}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 uppercase" dir="rtl">
                                            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-4">لا توجد نشاطات مسجلة</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
