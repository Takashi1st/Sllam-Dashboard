'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { promoteToAdmin } from '@/app/actions/admin-actions';

export default function SetupPage() {
    const [status, setStatus] = useState('');
    const supabase = createClient();

    const createAdmin = async () => {
        setStatus('جاري إنشاء حساب Auth...');
        try {
            const email = 'admin@sllam.com';
            const password = 'SllamAdmin2024!!';

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                setStatus(`تم إنشاء حساب Auth: ${data.user.id}. جاري ترقية الصلاحيات...`);
                const result = await promoteToAdmin(data.user.id);

                if (result.success) {
                    setStatus(`مبروك! تم إنشاء الأدمن وترقيته بنجاح. يمكنك الآن تسجيل الدخول بـ ${email}`);
                } else {
                    setStatus(`خطأ في الترقية: ${result.error}`);
                }
            }
        } catch (err: any) {
            setStatus(`خطأ: ${err.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-arabic text-right px-4" dir="rtl">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">إعداد المسؤول الأول</h1>
                    <p className="text-gray-500 mt-2">سيتم إنشاء حساب admin@sllam.com بكلمة سر افتراضية</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-blue-700 text-sm">
                    <strong>البيانات الافتراضية:</strong>
                    <ul className="list-disc pr-5 mt-2 space-y-1">
                        <li>الإيميل: admin@sllam.com</li>
                        <li>الباسورد: SllamAdmin2024!!</li>
                    </ul>
                </div>

                <button
                    onClick={createAdmin}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                >
                    بدء عملية الإنشاء
                </button>

                <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl text-center min-h-[60px] flex items-center justify-center text-sm text-gray-600">
                    {status || 'بانتظار البدء...'}
                </div>

                <div className="text-center">
                    <a href="/admin/login" className="text-blue-500 hover:underline text-sm">اذهب لصفحة تسجيل الدخول</a>
                </div>
            </div>
        </div>
    );
}
