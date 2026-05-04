'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Truck,
    Package,
    MapPin,
    LogOut,
    ChevronLeft,
    Settings
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const menuItems = [
    { icon: LayoutDashboard, label: 'نظرة عامة', href: '/admin', exact: true },
    { icon: Package, label: 'إدارة الطلبات', href: '/admin/orders', exact: false },
    { icon: Truck, label: 'إدارة السائقين', href: '/admin/drivers', exact: false },
    { icon: Users, label: 'إدارة المستخدمين', href: '/admin/users', exact: false },
    { icon: MapPin, label: 'إدارة المواقع', href: '/admin/locations', exact: false },
    { icon: Settings, label: 'إعدادات النظام', href: '/admin/settings', exact: false },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    const isActive = (href: string, exact: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <aside className="w-64 bg-white border-l border-gray-100 h-screen flex flex-col sticky top-0 shadow-sm">
            {/* Logo */}
            <div className="p-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
                        <ChevronLeft size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">سلّم</h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">القائمة الرئيسية</p>
                {menuItems.map((item) => {
                    const active = isActive(item.href, item.exact);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                                active
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                        >
                            <item.icon
                                size={18}
                                className={active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}
                            />
                            <span className={`text-sm font-medium ${active ? 'text-white' : ''}`}>
                                {item.label}
                            </span>
                            {active && (
                                <span className="mr-auto w-1.5 h-1.5 bg-white/50 rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Sign Out */}
            <div className="p-3 border-t border-gray-50">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 group"
                >
                    <LogOut size={18} className="group-hover:text-red-500" />
                    <span className="text-sm font-medium">تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
}
