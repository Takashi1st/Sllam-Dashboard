import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]" dir="rtl">
            <div className="text-center space-y-4">
                <p className="text-8xl font-bold text-gray-100">404</p>
                <h1 className="text-2xl font-bold text-gray-800">الصفحة غير موجودة</h1>
                <p className="text-gray-500">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                >
                    العودة للوحة التحكم
                </Link>
            </div>
        </div>
    );
}
