'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Truck,
    Search,
    RefreshCw,
    Star,
    Shield,
    MoreVertical,
    CheckCircle2,
    XCircle,
    UserCheck,
    Wallet
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DriversUIProps {
    initialDrivers: any[];
}

const statusStyles: any = {
    available: 'bg-green-100 text-green-700',
    busy: 'bg-orange-100 text-orange-700',
    offline: 'bg-gray-100 text-gray-700',
};

const statusLabels: any = {
    available: 'متوفر',
    busy: 'في رحلة',
    offline: 'غير متصل',
};

export default function DriversUI({ initialDrivers }: DriversUIProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const filteredDrivers = initialDrivers.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone.includes(searchTerm) ||
        driver.plate.includes(searchTerm)
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-gray-800">إدارة السائقين</h1>
                    <p className="text-gray-500">متابعة ومعالجة ملفات السائقين والتحقق منها</p>
                </div>
                <button
                    onClick={() => router.refresh()}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors shadow-sm self-start"
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
                            placeholder="البحث باسم السائق، الهاتف، أو رقم اللوحة..."
                            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-orange-300 transition-colors text-sm text-right"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right" dir="rtl">
                        <thead className="bg-gray-50/50 text-gray-500 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-semibold">السائق</th>
                                <th className="px-6 py-4 font-semibold">المركبة</th>
                                <th className="px-6 py-4 font-semibold">التقييم</th>
                                <th className="px-6 py-4 font-semibold">المحفظة</th>
                                <th className="px-6 py-4 font-semibold">الحالة</th>
                                <th className="px-6 py-4 font-semibold text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredDrivers.length > 0 ? (
                                filteredDrivers.map((driver, i) => (
                                    <motion.tr
                                        key={driver.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                                    {driver.name && driver.name[0]}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700 block">{driver.name}</span>
                                                    <span className="text-xs text-gray-400 font-mono" dir="ltr">{driver.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-gray-700">{driver.vehicle}</span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">{driver.plate}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-orange-500">
                                                <span className="font-bold text-sm">{driver.rating}</span>
                                                <Star size={14} fill="currentColor" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-blue-600 font-semibold text-sm">
                                                <Wallet size={14} />
                                                <span dir="ltr">{driver.wallet}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[driver.status] || 'bg-gray-100'}`}>
                                                {statusLabels[driver.status] || driver.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title='اعتماد السائق'>
                                                    <Shield size={18} />
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
                                        لا يوجد سائقين حالياً
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
