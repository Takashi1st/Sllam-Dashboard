'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Package,
    Search,
    RefreshCw,
    ArrowRight,
    Clock,
    FileText,
    MoreVertical,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Order {
    id: string;
    userName: string;
    driverName: string;
    status: string;
    price: string;
    origin: string;
    destination: string;
    createdAt: string | Date;
}

interface OrdersUIProps {
    initialOrders: Order[];
}

const statusMap: Record<string, { label: string; class: string; icon: React.ElementType }> = {
    pending: { label: 'قيد الانتظار', class: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    confirmed: { label: 'مؤكد', class: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Clock },
    picking_up: { label: 'جاري الاستلام', class: 'bg-orange-100 text-orange-700 border-orange-200', icon: Package },
    in_transit: { label: 'قيد التوصيل', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
    delivered: { label: 'تم التسليم', class: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
    cancelled: { label: 'ملغي', class: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

export default function OrdersUI({ initialOrders }: OrdersUIProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const filteredOrders = useMemo(() =>
        initialOrders.filter(order => {
            const matchesSearch =
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.driverName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        }),
        [initialOrders, searchTerm, statusFilter]
    );

    const statusCounts = useMemo(() =>
        initialOrders.reduce((acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
        [initialOrders]
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-gray-800">إدارة الطلبات</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {initialOrders.length} طلب إجمالي · {filteredOrders.length} نتيجة معروضة
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 self-start text-sm font-medium"
                >
                    <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                    <span>تحديث البيانات</span>
                </button>
            </div>

            {/* Quick status filter cards */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(statusMap).map(([key, val]) => (
                    <button
                        key={key}
                        onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                            statusFilter === key
                                ? `${val.class} border-current font-bold shadow-sm`
                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <p className="text-lg font-bold">{statusCounts[key] || 0}</p>
                        <p className="text-xs mt-0.5">{val.label}</p>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-50 flex flex-col md:flex-row gap-3" dir="rtl">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="البحث برقم الطلب، اسم العميل، أو السائق..."
                            className="w-full pr-9 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-300 focus:bg-white transition-all text-sm text-right"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-300 transition-colors cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">كل الحالات</option>
                        {Object.entries(statusMap).map(([key, val]) => (
                            <option key={key} value={key}>{val.label}</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right" dir="rtl">
                        <thead className="bg-gray-50/80 text-gray-500 text-xs">
                            <tr>
                                <th className="px-6 py-3.5 font-semibold">رقم الطلب / التاريخ</th>
                                <th className="px-6 py-3.5 font-semibold">العميل والسائق</th>
                                <th className="px-6 py-3.5 font-semibold">المسار</th>
                                <th className="px-6 py-3.5 font-semibold">الحالة</th>
                                <th className="px-6 py-3.5 font-semibold">السعر</th>
                                <th className="px-6 py-3.5 font-semibold text-left">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order, i) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
                                        className="hover:bg-blue-50/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-blue-600 block font-mono text-sm">#{order.id}</span>
                                            <span className="text-xs text-gray-400 block mt-0.5">
                                                {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium text-gray-800">{order.userName}</span>
                                                <span className="text-xs text-gray-400">🚗 {order.driverName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded-lg text-xs font-medium">{order.origin}</span>
                                                <ArrowRight size={12} className="text-gray-300 flex-shrink-0" />
                                                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg text-xs font-medium">{order.destination}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusMap[order.status]?.class || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                {statusMap[order.status]?.label || order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800 font-mono" dir="ltr">
                                            {order.price}
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="تفاصيل الطلب">
                                                    <FileText size={16} />
                                                </button>
                                                <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            <Package size={40} className="opacity-30" />
                                            <p className="font-medium">لا توجد طلبات تطابق الفلاتر المحددة</p>
                                            <button
                                                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                                                className="text-sm text-blue-500 hover:underline"
                                            >
                                                مسح الفلاتر
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
