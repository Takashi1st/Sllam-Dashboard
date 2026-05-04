'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Truck,
    Search,
    RefreshCw,
    Star,
    Shield,
    MoreVertical,
    Wallet,
    WifiOff,
    CircleDot,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Driver {
    id: string;
    name: string;
    phone: string;
    vehicle: string;
    plate: string;
    rating: number;
    status: string;
    wallet: string;
}

interface DriversUIProps {
    initialDrivers: Driver[];
}

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType; dotClass: string }> = {
    available: { label: 'متوفر', class: 'bg-green-100 text-green-700 border-green-200', icon: CircleDot, dotClass: 'bg-green-500' },
    busy: { label: 'في رحلة', class: 'bg-orange-100 text-orange-700 border-orange-200', icon: Truck, dotClass: 'bg-orange-500' },
    offline: { label: 'غير متصل', class: 'bg-gray-100 text-gray-500 border-gray-200', icon: WifiOff, dotClass: 'bg-gray-400' },
};

export default function DriversUI({ initialDrivers }: DriversUIProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const filteredDrivers = useMemo(() =>
        initialDrivers.filter(driver => {
            const matchesSearch =
                (driver.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (driver.phone || '').includes(searchTerm) ||
                (driver.plate || '').includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
            return matchesSearch && matchesStatus;
        }),
        [initialDrivers, searchTerm, statusFilter]
    );

    const statusCounts = useMemo(() =>
        initialDrivers.reduce((acc, d) => {
            acc[d.status] = (acc[d.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
        [initialDrivers]
    );

    const avgRating = useMemo(() => {
        if (!initialDrivers.length) return 0;
        return (initialDrivers.reduce((s, d) => s + (d.rating || 0), 0) / initialDrivers.length).toFixed(1);
    }, [initialDrivers]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-gray-800">إدارة السائقين</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {initialDrivers.length} سائق · متوسط التقييم {avgRating} ⭐
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 self-start text-sm font-medium"
                >
                    <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                    <span>تحديث البيانات</span>
                </button>
            </div>

            {/* Status filter cards */}
            <div className="grid grid-cols-3 gap-3">
                {Object.entries(statusConfig).map(([key, cfg]) => (
                    <button
                        key={key}
                        onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                            statusFilter === key
                                ? `${cfg.class} border-current shadow-sm font-bold`
                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                    >
                        <p className="text-xl font-bold">{statusCounts[key] || 0}</p>
                        <p className="text-xs mt-0.5">{cfg.label}</p>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-50 flex flex-col md:flex-row gap-3" dir="rtl">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="البحث باسم السائق، الهاتف، أو رقم اللوحة..."
                            className="w-full pr-9 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-orange-300 focus:bg-white transition-all text-sm text-right"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right" dir="rtl">
                        <thead className="bg-gray-50/80 text-gray-400 text-xs">
                            <tr>
                                <th className="px-6 py-3.5 font-semibold">السائق</th>
                                <th className="px-6 py-3.5 font-semibold">المركبة</th>
                                <th className="px-6 py-3.5 font-semibold">التقييم</th>
                                <th className="px-6 py-3.5 font-semibold">المحفظة</th>
                                <th className="px-6 py-3.5 font-semibold">الحالة</th>
                                <th className="px-6 py-3.5 font-semibold text-left">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {filteredDrivers.length > 0 ? (
                                filteredDrivers.map((driver, i) => (
                                    <motion.tr
                                        key={driver.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
                                        className="hover:bg-orange-50/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex-shrink-0">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                        {driver.name?.[0] || '؟'}
                                                    </div>
                                                    <span className={`absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${statusConfig[driver.status]?.dotClass || 'bg-gray-400'}`} />
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-800 block">{driver.name || '—'}</span>
                                                    <span className="text-xs text-gray-400 font-mono" dir="ltr">{driver.phone || '—'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-gray-700">{driver.vehicle}</span>
                                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg w-fit font-mono">{driver.plate}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-orange-500">
                                                <Star size={13} fill="currentColor" />
                                                <span className="font-bold text-sm text-gray-700">{driver.rating}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm">
                                                <Wallet size={13} />
                                                <span dir="ltr">{driver.wallet}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusConfig[driver.status]?.class || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[driver.status]?.dotClass || 'bg-gray-400'}`} />
                                                {statusConfig[driver.status]?.label || driver.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="اعتماد السائق"
                                                >
                                                    <Shield size={16} />
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
                                            <Truck size={40} className="opacity-30" />
                                            <p className="font-medium">لا يوجد سائقون يطابقون البحث</p>
                                            {(searchTerm || statusFilter !== 'all') && (
                                                <button
                                                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                                                    className="text-sm text-orange-500 hover:underline"
                                                >
                                                    مسح الفلاتر
                                                </button>
                                            )}
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
