
import React from 'react';

export default function Loading() {
    return (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                {/* Outer ring */}
                <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                {/* Spinning ring */}
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
                <p className="text-lg font-medium text-gray-700 animate-pulse">جاري تحميل البيانات...</p>
                <div className="flex space-x-1 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                </div>
            </div>
            
            {/* Skeleton placeholders */}
            <div className="w-full max-w-4xl mt-12 space-y-4 opacity-50">
                <div className="h-40 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
                    <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
                    <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
