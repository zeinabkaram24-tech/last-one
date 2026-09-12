import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                لوحة الأدمن (Admin Panel)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                نظام إدارة الخطط والجداول
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <span>خروج</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body placeholder */}
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            مساحة الأدمن جاهزة
          </h3>
          <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
            تم تسجيل الدخول بنجاح كأدمن. هذه المساحة مخصصة للخصائص والإعدادات الإدارية التي سنقوم بضبطها وإضافتها معاً.
          </p>
        </div>
      </div>
    </div>
  );
};
