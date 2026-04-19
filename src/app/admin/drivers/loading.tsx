
import React from 'react';

export default function Loading() {
    return (
        <div className="space-y-6 rtl">
            <div className="flex justify-between items-center">
                <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-32 bg-blue-100 rounded-lg animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse"></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                            <div className="h-8 bg-gray-50 rounded-lg animate-pulse"></div>
                            <div className="h-8 bg-gray-50 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
