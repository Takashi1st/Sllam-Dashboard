'use client';

import { Bell, Search, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface TopbarProps {
    user: User | null;
}

export function Topbar({ user }: TopbarProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 rtl">
            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full w-96 border border-gray-100 focus-within:border-blue-300 transition-colors text-right">
                <Search size={18} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="بحث في النظام..."
                    className="bg-transparent border-none outline-none w-full text-sm"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-4 border-r pr-6 border-gray-100">
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'مدير النظام'}
                        </p>
                        <p className="text-[10px] text-gray-400 tracking-wide uppercase">
                            {user?.email || 'admin@sllam.com'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                            <UserIcon size={20} />
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="تسجيل الخروج"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
