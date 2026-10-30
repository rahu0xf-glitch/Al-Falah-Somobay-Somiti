import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Wallet, ArrowDown } from 'lucide-react';
import { SocietyStats, PublicMember, Payment } from '../../types';
import { dbService } from '../../services/db';
import { TotalFundCard } from './members/TotalFundCard';
import { MemberSearchDropdown } from './members/MemberSearchDropdown';
import { MonthlyPaymentTable } from './members/MonthlyPaymentTable';
import { formatBDT, toBengaliNumber, formatDate } from '../../utils/bengali';

interface MembersSectionProps {
  stats: SocietyStats;
  members: PublicMember[];
  onDataChange?: () => void;
}

export const MembersSection: React.FC<MembersSectionProps> = ({ stats, members }) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('AFS-001');
  const [memberDetails, setMemberDetails] = useState<{
    member: PublicMember;
    payments: Payment[];
    summary: {
      totalPaid: number;
      paidCount: number;
      unpaidCount: number;
      years: number[];
      recentDate?: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch financial details for currently selected member
  useEffect(() => {
    let isMounted = true;
    async function loadDetails() {
      if (!selectedMemberId) return;
      setLoading(true);
      try {
        const details = await dbService.getMemberPublicFinancialDetails(selectedMemberId);
        if (isMounted) {
          setMemberDetails(details);
        }
      } catch (err) {
        console.error('Failed to load member details', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadDetails();
    return () => {
      isMounted = false;
    };
  }, [selectedMemberId, members]);

  return (
    <section id="members" className="py-20 lg:py-28 bg-[#F8FAF7] border-b border-[#E2E8E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#075B46] uppercase tracking-wider mb-3">
            <Wallet className="w-4 h-4 text-[#D6B66C]" />
            <span>সদস্য আর্থিক বিবরণী ও সঞ্চয় তহবিল · Member & Fund Ledger</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#073D32] tracking-tight font-bengali">
            সমিতির মোট তহবিল ও সদস্য সঞ্চয় খতিয়ান
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#202923]/80 font-bengali">
            সকল আর্থিক হিসাব ডাটাবেজ থেকে স্বয়ংক্রিয়ভাবে সংগৃহীত ও গণনাকৃত। সমিতির স্বচ্ছতা নিশ্চিত করতে নিচে যেকোনো সদস্যের আর্থিক জমার ইতিহাস যাচাই করুন।
          </p>
          <div className="w-20 h-1 bg-[#D6B66C] mx-auto mt-4 rounded-full" />
        </div>

        {/* 1. TOTAL FUND CARD (Prominent Real-Time Card) */}
        <TotalFundCard stats={stats} />

        {/* 2. SEARCHABLE MEMBER DROPDOWN */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E0] shadow-sm mb-10">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-[#073D32] font-bengali">
              সদস্যের সঞ্চয় খতিয়ান অনুসন্ধান
            </h3>
            <p className="text-xs text-[#202923]/60 font-bengali mt-1">
              নিচের তালিকা থেকে সদস্য নির্বাচন করুন অথবা নাম ও আইডি টাইপ করে খুঁজুন
            </p>
          </div>

          <MemberSearchDropdown
            members={members}
            selectedMemberId={selectedMemberId}
            onSelectMember={(id) => setSelectedMemberId(id)}
          />

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#202923]/60 font-bengali text-center">
            <ShieldCheck className="w-4 h-4 text-[#075B46]" />
            <span>
              ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা নীতিমালার আলোকে সদস্যের এনআইডি, মোবাইল নম্বর ও নমিনির তথ্য উন্মুক্তভাবে প্রদর্শিত নয়।
            </span>
          </div>
        </div>

        {/* 3. SELECTED MEMBER DETAILS & MONTHLY PAYMENT TABLE */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E2E8E0]">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#075B46] border-t-transparent mb-3" />
            <p className="text-sm text-[#202923]/70 font-bengali">সদস্যের আর্থিক খতিয়ান লোড হচ্ছে...</p>
          </div>
        ) : memberDetails ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Member Snapshot Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#073D32] text-[#D6B66C] flex items-center justify-center text-xl font-bold font-english border border-[#D6B66C]/40 shadow-sm shrink-0">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#073D32] font-bengali">
                        {memberDetails.member.full_name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold font-english bg-[#075B46]/10 text-[#075B46] border border-[#075B46]/20">
                        {memberDetails.member.member_id}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#202923]/70 font-bengali mt-0.5">
                      পেশা: {memberDetails.member.occupation || 'নিয়মিত সদস্য'} · নিবন্ধিত সমবায়ী
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-start md:self-auto">
                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-[#202923]/60 font-english block">
                      TOTAL DEPOSITED
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#075B46] font-num">
                      {formatBDT(memberDetails.summary.totalPaid)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Summary Mini Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                <div className="bg-[#F8FAF7] p-3.5 rounded-xl border border-[#E2E8E0]">
                  <span className="text-[11px] text-[#202923]/60 font-bengali block">মোট জমার পরিমাণ</span>
                  <span className="text-lg font-bold text-[#073D32] font-num">
                    {formatBDT(memberDetails.summary.totalPaid)}
                  </span>
                </div>

                <div className="bg-[#F8FAF7] p-3.5 rounded-xl border border-[#E2E8E0]">
                  <span className="text-[11px] text-[#202923]/60 font-bengali block">পরিশোধিত কিস্তি সংখ্যা</span>
                  <span className="text-lg font-bold text-emerald-700 font-num">
                    {toBengaliNumber(memberDetails.summary.paidCount)} <span className="text-xs font-normal">মাস</span>
                  </span>
                </div>

                <div className="bg-[#F8FAF7] p-3.5 rounded-xl border border-[#E2E8E0]">
                  <span className="text-[11px] text-[#202923]/60 font-bengali block">বকেয়া কিস্তি সংখ্যা</span>
                  <span className="text-lg font-bold text-rose-600 font-num">
                    {toBengaliNumber(memberDetails.summary.unpaidCount)} <span className="text-xs font-normal">মাস</span>
                  </span>
                </div>

                <div className="bg-[#F8FAF7] p-3.5 rounded-xl border border-[#E2E8E0]">
                  <span className="text-[11px] text-[#202923]/60 font-bengali block">সর্বশেষ কিস্তি জমাদান</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#073D32] font-bengali block mt-1">
                    {formatDate(memberDetails.summary.recentDate, true)}
                  </span>
                </div>
              </div>
            </div>

            {/* Monthly Payment Table */}
            <MonthlyPaymentTable
              payments={memberDetails.payments}
              availableYears={memberDetails.summary.years}
              memberName={memberDetails.member.full_name}
              memberId={memberDetails.member.member_id}
            />
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#E2E8E0] text-sm text-[#202923]/60 font-bengali">
            অনুগ্রহ করে উপরের ড্রপডাউন থেকে একজন সদস্য নির্বাচন করুন।
          </div>
        )}
      </div>
    </section>
  );
};
