'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff, ChevronLeft } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            router.push('/admin');
            router.refresh();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'فشل تسجيل الدخول';
            // Translate common Supabase error messages
            if (message.includes('Invalid login credentials')) {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            } else if (message.includes('Email not confirmed')) {
                setError('البريد الإلكتروني غير مؤكد');
            } else if (message.includes('Too many requests')) {
                setError('تم تجاوز عدد المحاولات، يرجى الانتظار قليلاً');
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" dir="rtl">
            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden flex-col items-center justify-center p-12">
                {/* Background circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-white/10 rounded-2xl rotate-12" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative text-white text-center"
                >
                    <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <ChevronLeft size={36} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">سلّم</h1>
                    <p className="text-blue-100 text-lg mb-8">منصة اللوجستيات الذكية</p>
                    <div className="space-y-3 text-right">
                        {[
                            'إدارة الطلبات والشحنات',
                            'متابعة السائقين في الوقت الحقيقي',
                            'تقارير وإحصاءات شاملة',
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="flex items-center gap-3 bg-white/10 backdrop-blur px-4 py-3 rounded-xl"
                            >
                                <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                                <span className="text-sm text-blue-50">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right login form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-[#f8fafc]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
                            <ChevronLeft size={24} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">سلّم Admin</h1>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8">
                        <div className="text-right mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">مرحباً بعودتك</h2>
                            <p className="text-gray-500 mt-1.5 text-sm">سجّل دخولك للوصول إلى لوحة التحكم</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                                    البريد الإلكتروني
                                </label>
                                <div className="relative">
                                    <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                                    <input
                                        type="email"
                                        required
                                        autoComplete="email"
                                        className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-right text-sm"
                                        placeholder="admin@sllam.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                                    كلمة المرور
                                </label>
                                <div className="relative">
                                    <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        className="w-full pr-10 pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-right text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.97 }}
                                        className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-xl flex items-center gap-2.5 text-sm"
                                    >
                                        <AlertCircle size={16} className="flex-shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm active:scale-[0.99]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        جاري تسجيل الدخول...
                                    </>
                                ) : (
                                    'تسجيل الدخول'
                                )}
                            </button>
                        </form>

                        <p className="text-center text-xs text-gray-400 mt-6">
                            هذه اللوحة مخصصة للمسؤولين فقط
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
