'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Search,
    RefreshCw,
    ChevronLeft,
    Plus,
    Edit2,
    Trash2,
    Layers
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LocationsUIProps {
    initialLocations: any[];
}

export default function LocationsUI({ initialLocations }: LocationsUIProps) {
    const [selectedGov, setSelectedGov] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
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

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-gray-800">إدارة المواقع الجغرافية</h1>
                    <p className="text-gray-500">إضافة وتعديل المحافظات، المدن، والمناطق</p>
                </div>
                <div className="flex gap-3 self-start">
                    <button
                        onClick={() => router.refresh()}
                        className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-arabic">
                        <Plus size={18} />
                        <span>إضافة محافظة جديده</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-arabic" dir="rtl">
                {/* Governorates Column */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h2 className="font-bold text-gray-700 flex items-center gap-2">
                            <Layers size={18} className="text-blue-500" />
                            المحافظات ({governorates.length})
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {governorates.map((gov) => (
                            <button
                                key={gov.id}
                                onClick={() => { setSelectedGov(gov.id); setSelectedCity(null); }}
                                className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${selectedGov === gov.id ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' : 'hover:bg-gray-50 text-gray-600'
                                    }`}
                            >
                                <span>{gov.nameAr}</span>
                                <ChevronLeft size={16} className={`transition-transform ${selectedGov === gov.id ? 'translate-x-0' : 'opacity-0 group-hover:opacity-100 translate-x-1'}`} />
                            </button>
                        ))}
                        {governorates.length === 0 && (
                            <p className="text-center text-gray-400 py-20 text-sm">لا توجد بيانات</p>
                        )}
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
                            <button className="p-1 hover:bg-orange-100 rounded text-orange-600">
                                <Plus size={16} />
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {!selectedGov ? (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm px-10 text-center">
                                اختر محافظة لعرض المدن التابعة لها
                            </div>
                        ) : (
                            cities.map((city) => (
                                <button
                                    key={city.id}
                                    onClick={() => setSelectedCity(city.id)}
                                    className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${selectedCity === city.id ? 'bg-orange-50 text-orange-700 font-bold shadow-sm' : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <span>{city.nameAr}</span>
                                    <ChevronLeft size={16} className={`transition-transform ${selectedCity === city.id ? 'translate-x-0' : 'opacity-0 group-hover:opacity-100 translate-x-1'}`} />
                                </button>
                            ))
                        )}
                        {selectedGov && cities.length === 0 && (
                            <p className="text-center text-gray-400 py-20 text-sm">لا توجد مدن مضافة</p>
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
                            <button className="p-1 hover:bg-green-100 rounded text-green-600">
                                <Plus size={16} />
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {!selectedCity ? (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm px-10 text-center">
                                اختر مدينة لعرض المناطق التابعة لها
                            </div>
                        ) : (
                            areas.map((area) => (
                                <div
                                    key={area.id}
                                    className="w-full text-right px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 flex items-center justify-between group"
                                >
                                    <span>{area.nameAr}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                                            <Edit2 size={14} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                        {selectedCity && areas.length === 0 && (
                            <p className="text-center text-gray-400 py-20 text-sm">لا توجد مناطق مضافة</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
