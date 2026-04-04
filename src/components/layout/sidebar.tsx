'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Truck,
    Package,
    MapPin,
    Settings,
    LogOut
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const menuItems = [
    { icon: LayoutDashboard, label: 'نظرة عامة', href: '/admin' },
    { icon: Package, label: 'إدارة الطلبات', href: '/admin/orders' },
    { icon: Truck, label: 'إدارة السائقين', href: '/admin/drivers' },
    { icon: Users, label: 'إدارة المستخدمين', href: '/admin/users' },
    { icon: MapPin, label: 'إدارة المواقع', href: '/admin/locations' },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push('/login');
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0 rtl">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-600">Sllam Admin</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 font-tajawal">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200 active:scale-95 transition-all"
                >
                    <LogOut size={20} />
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
}
