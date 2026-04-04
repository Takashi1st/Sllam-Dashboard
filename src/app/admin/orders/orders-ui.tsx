'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Package,
    Search,
    RefreshCw,
    MapPin,
    ArrowRight,
    Clock,
    Filter,
    FileText,
    MoreVertical
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface OrdersUIProps {
    initialOrders: any[];
}

const statusMap: any = {
    pending: { label: 'قيد الانتظار', class: 'bg-yellow-100 text-yellow-700', icon: Clock },
    confirmed: { label: 'مؤكد', class: 'bg-indigo-100 text-indigo-700', icon: Clock },
    picking_up: { label: 'جاري الاستلام', class: 'bg-orange-100 text-orange-700', icon: Package },
    in_transit: { label: 'قيد التوصيل', class: 'bg-blue-100 text-blue-700', icon: Clock },
    delivered: { label: 'تم التسليم', class: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    cancelled: { label: 'ملغي', class: 'bg-red-100 text-red-700', icon: XCircle },
};

// Helper components because I missed some icons
function CheckCircle2(props: any) { return <span {...props}>✅</span> }
function XCircle(props: any) { return <span {...props}>❌</span> }

export default function OrdersUI({ initialOrders }: OrdersUIProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const filteredOrders = initialOrders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-gray-800">إدارة الطلبات</h1>
                    <p className="text-gray-500">مراقبة وتتبع جميع الشحنات والطلبات في النظام</p>
                </div>
                <button
                    onClick={() => router.refresh()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm self-start"
                >
                    <RefreshCw size={18} />
                    <span>تحديث البيانات</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4" dir="rtl">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="البحث برقم الطلب أو اسم العميل..."
                            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-300 transition-colors text-sm text-right font-arabic"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto font-arabic">
                    <table className="w-full text-right" dir="rtl">
                        <thead className="bg-gray-50/50 text-gray-500 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-semibold">رقم الطلب / التاريخ</th>
                                <th className="px-6 py-4 font-semibold">العميل والسائق</th>
                                <th className="px-6 py-4 font-semibold">المسار</th>
                                <th className="px-6 py-4 font-semibold">الحالة</th>
                                <th className="px-6 py-4 font-semibold">السعر</th>
                                <th className="px-6 py-4 font-semibold text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs md:text-sm">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order, i) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-blue-600 block">#{order.id}</span>
                                            <span className="text-xs text-gray-400 block mt-1" dir="rtl">
                                                {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-gray-700">{order.userName}</span>
                                                <span className="text-xs text-gray-400">س: {order.driverName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{order.origin}</span>
                                                <ArrowRight size={14} className="text-gray-300" />
                                                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">{order.destination}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusMap[order.status]?.class || 'bg-gray-100'}`}>
                                                {statusMap[order.status]?.label || order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800" dir="ltr">
                                            {order.price}
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            <div className="flex items-center justify-end gap-2 text-right">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title='تفاصيل الطلب'>
                                                    <FileText size={18} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-arabic">
                                        لا توجد طلبات حالياً
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
