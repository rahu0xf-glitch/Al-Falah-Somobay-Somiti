import React, { useState } from 'react';
import { Landmark, Users, Calendar, Coins, ArrowUpRight, CheckCircle } from 'lucide-react';
import { SocietyStats } from '../../../types';
import { formatBDT, toBengaliNumber, formatDate } from '../../../utils/bengali';

interface TotalFundCardProps {
  stats: SocietyStats;
}

export const TotalFundCard: React.FC<TotalFundCardProps> = ({ stats }) => {
  const [showEnglishDigits, setShowEnglishDigits] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#073D32] via-[#075B46] to-[#054434] text-white p-6 sm:p-10 border border-[#D6B66C]/30 shadow-xl mb-12">
      {/* Decorative Islamic geometric corner overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-[#D6B66C] w-full h-full">
          <circle cx="50" cy="50" r="45" strokeWidth="1.5" />
          <polygon points="50,5 95,50 50,95 5,50" strokeWidth="1.5" />
          <polygon points="18,18 82,18 82,82 18,82" strokeWidth="1.5" />
          <polygon points="50,20 80,50 50,80 20,50" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Main Fund Total */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#D6B66C]/20 border border-[#D6B66C]/40 text-[#D6B66C]">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-english font-bold text-[#D6B66C]">
                TOTAL FUND · সর্বমোট সংগৃহীত সঞ্চয় তহবিল
              </span>
              <p className="text-xs text-[#E2E8E0]/70 font-bengali">
                ডাটাবেজে সংরক্ষিত সকল সদস্যের জমাকৃত অর্থের সামগ্রিক সমাহার
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-4 pt-2">
            <span className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-num">
              {formatBDT(stats.totalFund, !showEnglishDigits)}
            </span>
            <button
              onClick={() => setShowEnglishDigits(!showEnglishDigits)}
              className="text-[11px] font-english text-[#D6B66C] hover:underline px-2 py-0.5 rounded bg-black/20"
              title="Toggle Bengali / English numerals"
            >
              {showEnglishDigits ? 'বাংলা সংখ্যায় দেখুন' : 'English Digits'}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#E2E8E0] pt-1">
            <CheckCircle className="w-3.5 h-3.5 text-[#D6B66C]" />
            <span>স্বয়ংক্রিয় গণনাকৃত তহবিল (Automatic Real-time Calculation)</span>
          </div>
        </div>

        {/* Secondary KPI Cluster */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#D6B66C]/20 lg:pl-8">
          <div className="bg-[#073D32]/60 rounded-xl p-4 border border-[#075B46]">
            <div className="flex items-center gap-2 text-[#D6B66C] text-xs font-english mb-1 font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>TOTAL MEMBERS</span>
            </div>
            <div className="text-2xl font-bold text-white font-num">
              {toBengaliNumber(stats.totalMembers)}
            </div>
            <p className="text-[11px] text-[#E2E8E0]/70 font-bengali">নিবন্ধিত স্থায়ী সদস্য</p>
          </div>

          <div className="bg-[#073D32]/60 rounded-xl p-4 border border-[#075B46]">
            <div className="flex items-center gap-2 text-[#D6B66C] text-xs font-english mb-1 font-semibold">
              <Coins className="w-3.5 h-3.5" />
              <span>TOTAL DEPOSITS</span>
            </div>
            <div className="text-2xl font-bold text-white font-num">
              {toBengaliNumber(stats.totalDepositsCount)}
            </div>
            <p className="text-[11px] text-[#E2E8E0]/70 font-bengali">মোট পরিশোধিত কিস্তি</p>
          </div>

          <div className="bg-[#073D32]/60 rounded-xl p-4 border border-[#075B46]">
            <div className="flex items-center gap-2 text-[#D6B66C] text-xs font-english mb-1 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>LAST UPDATED</span>
            </div>
            <div className="text-sm font-semibold text-white font-bengali">
              {formatDate(stats.lastUpdated, true)}
            </div>
            <p className="text-[11px] text-[#E2E8E0]/70 font-bengali">সর্বশেষ জমা তারিখ</p>
          </div>
        </div>
      </div>
    </div>
  );
};
