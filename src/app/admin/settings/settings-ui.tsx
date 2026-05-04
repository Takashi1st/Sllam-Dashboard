'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Package, 
    Truck, 
    Scale, 
    Plus, 
    Edit2, 
    Trash2, 
    Check, 
    X, 
    Loader2,
    LayoutGrid
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { 
    addPackageCategory, updatePackageCategory, deletePackageCategory,
    addVehicleType, updateVehicleType, deleteVehicleType,
    addPackageSizePricing, updatePackageSizePricing, deletePackageSizePricing
} from '@/app/actions/admin-actions';
import { useRouter } from 'next/navigation';

interface SettingsUIProps {
    categories: any[];
    vehicleTypes: any[];
    sizePricing: any[];
}

export default function SettingsUI({ categories, vehicleTypes, sizePricing }: SettingsUIProps) {
    const [activeTab, setActiveTab] = useState<'categories' | 'sizes' | 'vehicles'>('categories');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState<{
        open: boolean;
        type: 'category' | 'size' | 'vehicle';
        mode: 'add' | 'edit';
        data: any;
    }>({ open: false, type: 'category', mode: 'add', data: {} });

    const router = useRouter();

    const tabs = [
        { id: 'categories', label: 'أصناف الطرود', icon: Package },
        { id: 'sizes', label: 'أحجام وأوزان الطرود', icon: Scale },
        { id: 'vehicles', label: 'أسعار المركبات', icon: Truck },
    ] as const;

    const handleAction = async (action: () => Promise<any>) => {
        setLoading(true);
        const res = await action();
        setLoading(false);
        if (res.success) {
            setModal({ ...modal, open: false });
            router.refresh();
        } else {
            alert('حدث خطأ: ' + res.error);
        }
    };

    return (
        <div className="space-y-8 font-arabic" dir="rtl">
            {/* Header */}
            <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-800">إعدادات النظام</h1>
                <p className="text-gray-500">تحكم في الأصناف، الأوزان، وأسعار الخدمات</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-2xl w-full max-w-2xl mx-auto md:mx-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            activeTab === tab.id 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
                {/* Section Header */}
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <div className="flex items-center gap-3 text-gray-800">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            {activeTab === 'categories' && <Package size={20} />}
                            {activeTab === 'sizes' && <Scale size={20} />}
                            {activeTab === 'vehicles' && <Truck size={20} />}
                        </div>
                        <h2 className="text-lg font-bold">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                    </div>
                    <button
                        onClick={() => setModal({ open: true, type: activeTab === 'categories' ? 'category' : activeTab === 'sizes' ? 'size' : 'vehicle', mode: 'add', data: {} })}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm shadow-md shadow-blue-100"
                    >
                        <Plus size={18} />
                        <span>إضافة جديد</span>
                    </button>
                </div>

                {/* Table/List View */}
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                            {activeTab === 'categories' && (
                                <tr>
                                    <th className="px-6 py-4 font-semibold">الصنف (عربي)</th>
                                    <th className="px-6 py-4 font-semibold">الحالة</th>
                                    <th className="px-6 py-4 font-semibold text-left">التحكم</th>
                                </tr>
                            )}
                            {activeTab === 'sizes' && (
                                <tr>
                                    <th className="px-6 py-4 font-semibold">اسم الحجم</th>
                                    <th className="px-6 py-4 font-semibold">أقصى وزن (كجم)</th>
                                    <th className="px-6 py-4 font-semibold">السعر الثابت</th>
                                    <th className="px-6 py-4 font-semibold text-left">التحكم</th>
                                </tr>
                            )}
                            {activeTab === 'vehicles' && (
                                <tr>
                                    <th className="px-6 py-4 font-semibold">نوع المركبة</th>
                                    <th className="px-6 py-4 font-semibold">سعر البداية</th>
                                    <th className="px-6 py-4 font-semibold">سعر الكيلو</th>
                                    <th className="px-6 py-4 font-semibold text-left">التحكم</th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {activeTab === 'categories' && categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{cat.nameAr}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] ${cat.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {cat.isActive ? 'نشط' : 'معطل'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-left">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setModal({ open: true, type: 'category', mode: 'edit', data: cat })} className="p-1.5 text-gray-400 hover:text-blue-600"><Edit2 size={16} /></button>
                                            <button onClick={() => handleAction(() => deletePackageCategory(cat.id))} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {activeTab === 'sizes' && sizePricing.map(size => (
                                <tr key={size.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{size.nameAr}</td>
                                    <td className="px-6 py-4 text-gray-600">{size.maxWeight} كجم</td>
                                    <td className="px-6 py-4 text-blue-600 font-bold">{Number(size.price).toLocaleString()} YER</td>
                                    <td className="px-6 py-4 text-left">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setModal({ open: true, type: 'size', mode: 'edit', data: size })} className="p-1.5 text-gray-400 hover:text-blue-600"><Edit2 size={16} /></button>
                                            <button onClick={() => handleAction(() => deletePackageSizePricing(size.id))} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {activeTab === 'vehicles' && vehicleTypes.map(v => (
                                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{v.nameAr}</td>
                                    <td className="px-6 py-4 text-green-600 font-medium">{Number(v.baseFare).toLocaleString()} YER</td>
                                    <td className="px-6 py-4 text-orange-600 font-medium">{Number(v.perKmRate).toLocaleString()} YER</td>
                                    <td className="px-6 py-4 text-left">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setModal({ open: true, type: 'vehicle', mode: 'edit', data: v })} className="p-1.5 text-gray-400 hover:text-blue-600"><Edit2 size={16} /></button>
                                            <button onClick={() => handleAction(() => deleteVehicleType(v.id))} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(activeTab === 'categories' ? categories.length : activeTab === 'sizes' ? sizePricing.length : vehicleTypes.length) === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        لا توجد بيانات مضافة بعد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Modals */}
            <Modal
                isOpen={modal.open}
                onClose={() => setModal({ ...modal, open: false })}
                title={modal.mode === 'add' ? 'إضافة سجل جديد' : 'تعديل السجل'}
            >
                <div className="space-y-4 text-right">
                    {modal.type === 'category' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الصنف</label>
                            <input
                                type="text"
                                value={modal.data.nameAr || ''}
                                onChange={(e) => setModal({ ...modal, data: { ...modal.data, nameAr: e.target.value } })}
                                className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="مثلاً: إلكترونيات"
                            />
                        </div>
                    )}
                    
                    {modal.type === 'size' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الحجم (مثلاً: صغير)</label>
                                <input
                                    type="text"
                                    value={modal.data.nameAr || ''}
                                    onChange={(e) => setModal({ ...modal, data: { ...modal.data, nameAr: e.target.value } })}
                                    className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">أقصى وزن (كجم)</label>
                                    <input
                                        type="number"
                                        value={modal.data.maxWeight || ''}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, maxWeight: parseFloat(e.target.value) } })}
                                        className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">السعر الثابت</label>
                                    <input
                                        type="number"
                                        value={modal.data.price || ''}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, price: parseFloat(e.target.value) } })}
                                        className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {modal.type === 'vehicle' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نوع المركبة</label>
                                <input
                                    type="text"
                                    value={modal.data.nameAr || ''}
                                    onChange={(e) => setModal({ ...modal, data: { ...modal.data, nameAr: e.target.value } })}
                                    className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="مثلاً: دراجة نارية"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">سعر البداية</label>
                                    <input
                                        type="number"
                                        value={modal.data.baseFare || ''}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, baseFare: parseFloat(e.target.value) } })}
                                        className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">سعر الكيلومتر</label>
                                    <input
                                        type="number"
                                        value={modal.data.perKmRate || ''}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, perKmRate: parseFloat(e.target.value) } })}
                                        className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        onClick={() => {
                            if (modal.type === 'category') {
                                handleAction(() => modal.mode === 'add' ? addPackageCategory(modal.data) : updatePackageCategory(modal.data.id, modal.data));
                            } else if (modal.type === 'size') {
                                handleAction(() => modal.mode === 'add' ? addPackageSizePricing(modal.data) : updatePackageSizePricing(modal.data.id, modal.data));
                            } else {
                                handleAction(() => modal.mode === 'add' ? addVehicleType(modal.data) : updateVehicleType(modal.data.id, modal.data));
                            }
                        }}
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {modal.mode === 'add' ? 'إضافة' : 'تحديث'}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
