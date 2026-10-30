import React from 'react';
import { ArrowDownRight, Users, Shield, TrendingUp, Award } from 'lucide-react';
import { SocietyStats } from '../../types';
import { formatBDT, toBengaliNumber } from '../../utils/bengali';
import heroImg from '../../assets/images/hero_islamic_cooperative_1793374522933.jpg';

interface HeroSectionProps {
  stats: SocietyStats;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ stats }) => {
  return (
    <section id="home" className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-[#073D32]">
      {/* Background Hero Image with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Al Falah Somobay Somiti Architecture"
          className="w-full h-full object-cover opacity-25 filter brightness-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#073D32] via-[#073D32]/90 to-[#073D32]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#073D32] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Subtle Trust Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#075B46]/70 border border-[#D6B66C]/40 text-[#D6B66C] text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
            <Award className="w-3.5 h-3.5" />
            <span>নিবন্ধিত ইসলামিক সমবায় সমিতি · ঢাকা, বাংলাদেশ</span>
          </div>

          {/* Bilingual Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-4 font-bengali">
            আল-ফালাহ সমবায় সমিতি
          </h1>
          <p className="text-lg sm:text-xl font-english font-medium text-[#D6B66C] mb-6 tracking-wide">
            AL FALAH SOMOBAY SOMITI
          </p>

          {/* Value proposition heading */}
          <p className="text-lg sm:text-xl text-[#F8FAF7]/90 leading-relaxed font-bengali font-normal mb-8 max-w-2xl">
            ঐক্য, নিয়মিত সঞ্চয় ও পারস্পরিক সহযোগিতায় সমৃদ্ধির প্রত্যয়। একটি দায়িত্বশীল ও সুদমুক্ত আর্থিক সমবায়, যেখানে প্রতিটি সদস্যের আমানত সুরক্ষিত এবং হিসাব শতভাগ স্বচ্ছ।
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 mb-14">
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#D6B66C] text-[#073D32] font-semibold text-sm sm:text-base hover:bg-[#e5c985] transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#D6B66C] focus:ring-offset-2 focus:ring-offset-[#073D32] font-english"
            >
              <span>Explore Our Society</span>
              <ArrowDownRight className="w-4 h-4" />
            </a>

            <a
              href="#members"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#075B46] text-white border border-[#D6B66C]/30 font-semibold text-sm sm:text-base hover:bg-[#097358] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D6B66C] font-english"
            >
              <span>View Members & Total Fund</span>
            </a>
          </div>
        </div>

        {/* Database-Driven Highlights Strip */}
        <div className="mt-8 pt-8 border-t border-[#075B46]/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#075B46]/40 border border-[#D6B66C]/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[#D6B66C] mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-english font-semibold">Total Members</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-num">
              {toBengaliNumber(stats.totalMembers)} <span className="text-sm font-bengali font-normal text-[#E2E8E0]">জন</span>
            </div>
            <p className="text-[11px] text-[#E2E8E0]/70 font-bengali mt-1">নিবন্ধিত স্থায়ী সদস্যবৃন্দ</p>
          </div>

          <div className="bg-[#075B46]/40 border border-[#D6B66C]/30 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[#D6B66C] mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-english font-semibold">Total Fund</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#D6B66C] font-num">
              {formatBDT(stats.totalFund, true)}
            </div>
            <p className="text-[11px] text-[#E2E8E0]/70 font-bengali mt-1">স্বয়ংক্রিয় হিসাবকৃত মোট সঞ্চয়</p>
          </div>

          <div className="bg-[#075B46]/40 border border-[#D6B66C]/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[#D6B66C] mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-english font-semibold">Total Deposits</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-num">
              {toBengaliNumber(stats.totalDepositsCount)} <span className="text-sm font-bengali font-normal text-[#E2E8E0]">টি</span>
            </div>
            <p className="text-[11px] text-[#E2E8E0]/70 font-bengali mt-1">সফল কিস্তি রসিদ এন্ট্রি</p>
          </div>

          <div className="bg-[#075B46]/40 border border-[#D6B66C]/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[#D6B66C] mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-english font-semibold">Transparency</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-bengali">
              ১০০%
            </div>
            <p className="text-[11px] text-[#E2E8E0]/70 font-bengali mt-1">নিয়মিত নিরীক্ষিত ও অডিটেড</p>
          </div>
        </div>

        {/* Notice for Closed Membership */}
        <div className="mt-6 flex items-center justify-between flex-wrap gap-3 p-3.5 rounded-lg bg-[#073D32]/90 border border-[#D6B66C]/25 text-xs text-[#E2E8E0]">
          <span className="font-bengali">
            <strong className="text-[#D6B66C] font-semibold">বিশেষ অবগতি:</strong> আল-ফালাহ সমবায় সমিতি একটি নির্ধারিত সংখ্যক সদস্যভিত্তিক সংগঠন। সর্বসাধারণের নিকট থেকে কোনো নতুন সদস্যপদ আবেদন গ্রহণ করা হয় না।
          </span>
          <span className="font-english text-[11px] text-[#D6B66C] uppercase tracking-wider">
            Closed Membership Cooperative
          </span>
        </div>
      </div>
    </section>
  );
};
