
import React from 'react';

export default function Loading() {
    return (
        <div className="space-y-6 rtl">
            <div className="flex justify-between items-center">
                <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-32 bg-blue-100 rounded-lg animate-pulse"></div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="h-8 w-64 bg-gray-100 rounded animate-pulse"></div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-50">
                            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 flex-1 bg-gray-100 rounded animate-pulse"></div>
                            <div className="h-4 w-20 bg-gray-50 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
