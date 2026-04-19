
import React from 'react';

export default function Loading() {
    return (
        <div className="space-y-6 rtl">
            <div className="flex justify-between items-center">
                <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-32 bg-blue-100 rounded-lg animate-pulse"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between">
                    <div className="h-6 w-32 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-6 w-24 bg-gray-100 rounded animate-pulse"></div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <th key={i} className="px-6 py-4">
                                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((row) => (
                                <tr key={row} className="border-b border-gray-50">
                                    {[1, 2, 3, 4, 5, 6].map((col) => (
                                        <td key={col} className="px-6 py-4">
                                            <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
