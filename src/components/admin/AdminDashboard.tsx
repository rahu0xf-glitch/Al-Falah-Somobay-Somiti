import React from 'react';
import { 
  Users, Landmark, CreditCard, BookOpen, Clock, ShieldCheck, 
  ArrowUpRight, Plus, Activity 
} from 'lucide-react';
import { SocietyStats, AuditLog } from '../../types';
import { formatBDT, toBengaliNumber, formatDate } from '../../utils/bengali';

interface AdminDashboardProps {
  stats: SocietyStats;
  recentLogs: AuditLog[];
  onNavigateTab: (tabId: 'members' | 'payments' | 'policy' | 'contact' | 'logs') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  recentLogs,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#073D32] text-white p-6 sm:p-8 rounded-2xl border border-[#075B46] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#D6B66C] font-semibold font-english">
            Administrative Control Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-bengali mt-1">
            আল-ফালাহ সমবায় সমিতি প্রশাসন
          </h2>
          <p className="text-xs sm:text-sm text-[#E2E8E0]/80 font-bengali mt-1 max-w-xl">
            সকল সদস্যের সঞ্চয় খতিয়ান, মাসিক কিস্তি সংরক্ষণ, গঠনতান্ত্রিক নীতিমালা ও যোগাযোগ তথ্যের কেন্দ্রীয় ব্যবস্থাপনা
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('payments')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D6B66C] text-[#073D32] hover:bg-[#e5c985] text-xs font-bold transition-all shadow-sm font-bengali"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন কিস্তি জমা</span>
          </button>
          <button
            onClick={() => onNavigateTab('members')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075B46] text-white border border-[#D6B66C]/30 hover:bg-[#097358] text-xs font-semibold transition-all font-bengali"
          >
            <Users className="w-4 h-4" />
            <span>সদস্য তালিকা</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Fund */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#075B46]/60 transition-colors">
          <div className="flex items-center justify-between text-[#075B46] mb-3">
            <span className="text-xs font-bold font-english uppercase tracking-wider">
              TOTAL FUND
            </span>
            <div className="p-2 rounded-lg bg-[#075B46]/10">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#073D32] font-num">
            {formatBDT(stats.totalFund)}
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-bengali flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>স্বয়ংক্রিয় ডাটাবেজ সমাহার</span>
          </div>
        </div>

        {/* Total Members */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#075B46]/60 transition-colors">
          <div className="flex items-center justify-between text-blue-700 mb-3">
            <span className="text-xs font-bold font-english uppercase tracking-wider">
              TOTAL MEMBERS
            </span>
            <div className="p-2 rounded-lg bg-blue-50">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-num">
            {toBengaliNumber(stats.totalMembers)} <span className="text-sm font-bengali font-normal text-gray-500">জন</span>
          </div>
          <p className="mt-2 text-xs text-gray-500 font-bengali">
            নির্ধারিত স্থায়ী সমবায়ী সদস্য
          </p>
        </div>

        {/* Total Deposits */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#075B46]/60 transition-colors">
          <div className="flex items-center justify-between text-purple-700 mb-3">
            <span className="text-xs font-bold font-english uppercase tracking-wider">
              TOTAL DEPOSITS
            </span>
            <div className="p-2 rounded-lg bg-purple-50">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-num">
            {toBengaliNumber(stats.totalDepositsCount)} <span className="text-sm font-bengali font-normal text-gray-500">টি</span>
          </div>
          <p className="mt-2 text-xs text-gray-500 font-bengali">
            মোট সফল কিস্তি ট্রানজ্যাকশন
          </p>
        </div>

        {/* Paid Months Count */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#075B46]/60 transition-colors">
          <div className="flex items-center justify-between text-amber-700 mb-3">
            <span className="text-xs font-bold font-english uppercase tracking-wider">
              PAID ENTRIES
            </span>
            <div className="p-2 rounded-lg bg-amber-50">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-num">
            {toBengaliNumber(stats.totalPaidMonths)} <span className="text-sm font-bengali font-normal text-gray-500">মাস</span>
          </div>
          <p className="mt-2 text-xs text-gray-500 font-bengali">
            সর্বশেষ জমা: {formatDate(stats.lastUpdated, true)}
          </p>
        </div>
      </div>

      {/* 4 Core Management Shortcuts */}
      <div>
        <h3 className="text-base font-bold text-gray-900 font-bengali mb-4">
          প্রশাসনিক ব্যবস্থাপনা মডিউলসমূহ (Quick Access)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigateTab('members')}
            className="p-5 bg-white rounded-xl border border-gray-200 hover:border-[#075B46] text-left transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#075B46]/10 text-[#075B46] flex items-center justify-center mb-3 group-hover:bg-[#075B46] group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 font-bengali flex items-center justify-between">
              <span>সদস্য ব্যবস্থাপনা</span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#075B46]" />
            </h4>
            <p className="text-xs text-gray-500 font-bengali mt-1">
              সদস্য যোগ, সম্পাদনা, এনআইডি ও নমিনি তথ্য
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('payments')}
            className="p-5 bg-white rounded-xl border border-gray-200 hover:border-[#075B46] text-left transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 font-bengali flex items-center justify-between">
              <span>মাসিক কিস্তি জমা</span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-700" />
            </h4>
            <p className="text-xs text-gray-500 font-bengali mt-1">
              সঞ্চয় এন্ট্রি, সংশোধন ও স্বয়ংক্রিয় তহবিল হিসাব
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('policy')}
            className="p-5 bg-white rounded-xl border border-gray-200 hover:border-[#075B46] text-left transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:bg-blue-700 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 font-bengali flex items-center justify-between">
              <span>গঠনতন্ত্র ও নীতিমালা</span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-700" />
            </h4>
            <p className="text-xs text-gray-500 font-bengali mt-1">
              নিয়মাবলী সংযোজন ও তাৎক্ষণিক ওয়েব প্রকাশ
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('contact')}
            className="p-5 bg-white rounded-xl border border-gray-200 hover:border-[#075B46] text-left transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-700 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 font-bengali flex items-center justify-between">
              <span>যোগাযোগ তথ্য সম্পাদক</span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-amber-700" />
            </h4>
            <p className="text-xs text-gray-500 font-bengali mt-1">
              অফিস ঠিকানা, ফোন ও সময়সূচি পরিবর্তন
            </p>
          </button>
        </div>
      </div>

      {/* Recent Audit Logs Strip */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#075B46]" />
            <h3 className="text-base font-bold text-gray-900 font-bengali">
              সাম্প্রতিক প্রশাসনিক কার্যক্রম (Latest Audit Activities)
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('logs')}
            className="text-xs font-semibold text-[#075B46] hover:underline font-bengali"
          >
            সকল অডিট লগ দেখুন →
          </button>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {recentLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between gap-4 font-bengali">
              <div>
                <span className="font-semibold text-gray-800">{log.summary}</span>
                <span className="text-gray-400 text-[11px] font-english ml-2">
                  by {log.admin_email}
                </span>
              </div>
              <span className="text-[11px] text-gray-400 font-english whitespace-nowrap">
                {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
