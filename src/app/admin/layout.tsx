import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If no user and we are not on login page, middleware should handle it.
    // But if we are on login page, we don't want the sidebar.
    // This layout is applied to all /admin subroutes.

    // We can't easily check pathname in Server Layout for branches.
    // Standard practice is moving login OUT of the /admin folder if we want a different layout.
    // Or checking if children is the login page? No.

    // I'll keep it simple: if there's no user, we assume the middleware redirects or we are on login.
    // If there is a user, we show sidebar.

    if (!user) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-[#f8fafc]" dir="rtl">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
