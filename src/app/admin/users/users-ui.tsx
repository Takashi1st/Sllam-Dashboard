'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    RefreshCw,
    CheckCircle2,
    Ban,
    KeyRound,
    MoreVertical,
    Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UsersUIProps {
    initialUsers: any[];
}

const statusStyles: any = {
    approved: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-orange-100 text-orange-700 border-orange-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
};

const statusLabels: any = {
    approved: 'نشط',
    pending: 'قيد المراجعة',
    rejected: 'محظور',
};

import { updateUserStatus, resetUserPassword } from '@/app/actions/admin-actions';

export default function UsersUI({ initialUsers }: UsersUIProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();

    const filteredUsers = initialUsers.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm);
        const matchesRole = filterRole === 'all' ||
            (filterRole === 'driver' && user.role === 'سائق') ||
            (filterRole === 'user' && user.role === 'عميل');
        return matchesSearch && matchesRole;
    });

    const handleStatusUpdate = async (userId: string, newStatus: string) => {
        setLoadingId(`${userId}-status`);
        const result = await updateUserStatus(userId, newStatus);
        setLoadingId(null);
        if (result.success) {
            router.refresh();
        } else {
            alert('تعذر تحديث الحالة: ' + result.error);
        }
    };

    const handleResetPassword = async (userId: string) => {
        if (!confirm('هل أنت متأكد من تصفير كلمة السر لهذا المستخدم؟')) return;
        setLoadingId(`${userId}-reset`);
        const result = await resetUserPassword(userId);
        setLoadingId(null);
        if (result.success) {
            alert('تم تعيين المستخدم لتغيير كلمة السر عند الدخول القادم');
        } else {
            alert('تعذر تصفير كلمة السر: ' + result.error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h1>
                    <p className="text-gray-500">مشاهدة وإدارة جميع الحسابات الحقيقية في النظام</p>
                </div>
                <button
                    onClick={() => router.refresh()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm self-start"
                >
                    <RefreshCw size={18} className={loadingId === 'global' ? 'animate-spin' : ''} />
                    <span>تحديث البيانات</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                {/* Filters and Search */}
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4" dir="rtl">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="البحث بالاسم أو رقم الهاتف..."
                            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-300 transition-colors text-sm text-right"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 text-sm">
                            <Filter size={18} />
                            <span>تصفية</span>
                        </button>
                        <select
                            className="px-4 py-2 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 text-sm outline-none"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="all">الكل</option>
                            <option value="driver">سائقين</option>
                            <option value="user">عملاء</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-right" dir="rtl">
                        <thead className="bg-gray-50/50 text-gray-500 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-semibold">المستخدم</th>
                                <th className="px-6 py-4 font-semibold">رقم الهاتف</th>
                                <th className="px-6 py-4 font-semibold">النوع</th>
                                <th className="px-6 py-4 font-semibold">الحالة</th>
                                <th className="px-6 py-4 font-semibold text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, i) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                    {(user.name && user.name[0]) || 'U'}
                                                </div>
                                                <span className="font-medium text-gray-700">{user.name || 'مستخدم بدون اسم'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-sm" dir="ltr">
                                            {user.phone}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm ${user.role === 'سائق' ? 'text-blue-600' : 'text-gray-500'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[user.status] || 'bg-gray-100'}`}>
                                                {statusLabels[user.status] || user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(user.id, 'approved')}
                                                        disabled={loadingId === `${user.id}-status`}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title='تفعيل'
                                                    >
                                                        {loadingId === `${user.id}-status` ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleStatusUpdate(user.id, user.status === 'rejected' ? 'approved' : 'rejected')}
                                                    disabled={loadingId === `${user.id}-status`}
                                                    className={`p-2 ${user.status === 'rejected' ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'} rounded-lg transition-colors disabled:opacity-50`}
                                                    title={user.status === 'rejected' ? 'فك حظر' : 'حظر'}
                                                >
                                                    {loadingId === `${user.id}-status` ? <RefreshCw size={18} className="animate-spin" /> : <Ban size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => handleResetPassword(user.id)}
                                                    disabled={loadingId === `${user.id}-reset`}
                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title='تصفير كلمة السر'
                                                >
                                                    {loadingId === `${user.id}-reset` ? <RefreshCw size={18} className="animate-spin" /> : <KeyRound size={18} />}
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
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                        لا يوجد مستخدمين يطابقون البحث
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

