'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    RefreshCw,
    Plus,
    Edit2,
    Trash2,
    Layers,
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addLocation, updateLocation, deleteLocation } from '@/app/actions/admin-actions';
import { Modal } from '@/components/ui/modal';

interface LocationsUIProps {
    initialLocations: any[];
}

export default function LocationsUI({ initialLocations }: LocationsUIProps) {
    const [selectedGov, setSelectedGov] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{
        id?: string;
        nameAr: string;
        type: string;
        parentId?: string;
        mode: 'add' | 'edit';
    }>({ nameAr: '', type: '', mode: 'add' });

    const router = useRouter();

    const governorates = useMemo(() =>
        initialLocations.filter(loc => loc.type === 'governorate'),
        [initialLocations]
    );

    const cities = useMemo(() =>
        selectedGov ? initialLocations.filter(loc => loc.parentId === selectedGov && loc.type === 'city') : [],
        [initialLocations, selectedGov]
    );

    const areas = useMemo(() =>
        selectedCity ? initialLocations.filter(loc => loc.parentId === selectedCity && loc.type === 'area') : [],
        [initialLocations, selectedCity]
    );

    const openAddModal = (type: string, parentId?: string) => {
        setModalData({ nameAr: '', type, parentId, mode: 'add' });
        setIsModalOpen(true);
    };

    const openEditModal = (loc: any) => {
        setModalData({ id: loc.id, nameAr: loc.nameAr, type: loc.type, mode: 'edit' });
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!modalData.nameAr.trim()) return;

        setLoading(true);
        let res;
        if (modalData.mode === 'add') {
            res = await addLocation({
                nameAr: modalData.nameAr,
                type: modalData.type,
                parentId: modalData.parentId
            });
        } else {
            res = await updateLocation(modalData.id!, { nameAr: modalData.nameAr });
        }
        setLoading(false);

        if (res.success) {
            setIsModalOpen(false);
            router.refresh();
        } else {
            alert('فشل العملية: ' + res.error);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`هل أنت متأكد من حذف "${name}"؟ سيتم حذف جميع الفروع التابعة لها إن وجدت.`)) return;

        setLoading(true);
        const res = await deleteLocation(id);
        setLoading(false);

        if (res.success) {
            if (id === selectedGov) setSelectedGov(null);
            if (id === selectedCity) setSelectedCity(null);
            router.refresh();
        } else {
            alert('فشل الحذف: ' + res.error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-gray-800 font-arabic">إدارة المواقع الجغرافية</h1>
                    <p className="text-gray-500 font-arabic">إضافة وتعديل المحافظات، المدن، والمناطق</p>
                </div>
                <div className="flex gap-3 self-start">
                    <button
                        onClick={() => router.refresh()}
                        className="p-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => openAddModal('governorate')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100 font-arabic font-medium"
                    >
                        <Plus size={20} />
                        <span>إضافة محافظة</span>
                    </button>
                </div>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-arabic" dir="rtl">
                {/* Governorates Column */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h2 className="font-bold text-gray-700 flex items-center gap-2">
                            <Layers size={18} className="text-blue-500" />
                            المحافظات ({governorates.length})
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 text-right">
                        {governorates.map((gov) => (
                            <div
                                key={gov.id}
                                className={`group flex items-center justify-between px-2 rounded-xl transition-all ${selectedGov === gov.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                                <button
                                    onClick={() => { setSelectedGov(gov.id); setSelectedCity(null); }}
                                    className="flex-1 text-right px-2 py-3 font-medium"
                                >
                                    {gov.nameAr}
                                </button>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal(gov)} className="p-1.5 text-gray-400 hover:text-blue-500">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(gov.id, gov.nameAr)} className="p-1.5 text-gray-400 hover:text-red-500">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cities Column */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50 text-right">
                        <h2 className="font-bold text-gray-700 flex items-center gap-2">
                            <MapPin size={18} className="text-orange-500" />
                            المدن ({cities.length})
                        </h2>
                        {selectedGov && (
                            <button
                                onClick={() => openAddModal('city', selectedGov)}
                                className="p-1.5 hover:bg-orange-100 rounded-lg text-orange-600 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {!selectedGov ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm px-10 text-center gap-3">
                                <div className="p-3 bg-gray-50 rounded-full">
                                    <Layers size={24} className="text-gray-300" />
                                </div>
                                اختر محافظة أولاً
                            </div>
                        ) : (
                            cities.map((city) => (
                                <div
                                    key={city.id}
                                    className={`group flex items-center justify-between px-2 rounded-xl transition-all ${selectedCity === city.id ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50 text-gray-600'}`}
                                >
                                    <button
                                        onClick={() => setSelectedCity(city.id)}
                                        className="flex-1 text-right px-2 py-3 font-medium"
                                    >
                                        {city.nameAr}
                                    </button>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(city)} className="p-1.5 text-gray-400 hover:text-blue-500">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(city.id, city.nameAr)} className="p-1.5 text-gray-400 hover:text-red-500">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Areas Column */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50 text-right">
                        <h2 className="font-bold text-gray-700 flex items-center gap-2">
                            <MapPin size={18} className="text-green-500" />
                            المناطق ({areas.length})
                        </h2>
                        {selectedCity && (
                            <button
                                onClick={() => openAddModal('area', selectedCity)}
                                className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {!selectedCity ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm px-10 text-center gap-3">
                                <div className="p-3 bg-gray-50 rounded-full">
                                    <MapPin size={24} className="text-gray-300" />
                                </div>
                                اختر مدينة أولاً
                            </div>
                        ) : (
                            areas.map((area) => (
                                <div
                                    key={area.id}
                                    className="group flex items-center justify-between px-2 rounded-xl transition-all hover:bg-gray-50 text-gray-600"
                                >
                                    <span className="flex-1 text-right px-2 py-3 font-medium">
                                        {area.nameAr}
                                    </span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(area)} className="p-1.5 text-gray-400 hover:text-blue-500">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(area.id, area.nameAr)} className="p-1.5 text-gray-400 hover:text-red-500">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalData.mode === 'add' ? 'إضافة موقع جديد' : 'تعديل بيانات الموقع'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالعربية</label>
                        <input
                            type="text"
                            value={modalData.nameAr}
                            onChange={(e) => setModalData({ ...modalData, nameAr: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="مثلاً: صنعاء، حي حدة..."
                            autoFocus
                        />
                    </div>
                    
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !modalData.nameAr.trim()}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {modalData.mode === 'add' ? 'حفظ الموقع' : 'تعديل البيانات'}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
