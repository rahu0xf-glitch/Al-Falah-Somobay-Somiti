import React, { useState } from 'react';
import { BookOpen, ChevronDown, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Policy } from '../../types';

interface PolicySectionProps {
  policies: Policy[];
}

export const PolicySection: React.FC<PolicySectionProps> = ({ policies }) => {
  const [openId, setOpenId] = useState<string | null>(policies[0]?.id || null);

  const togglePolicy = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="policy" className="py-20 lg:py-28 bg-white border-b border-[#E2E8E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#075B46] uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4 text-[#D6B66C]" />
            <span>গঠনতন্ত্র ও বিধিমালা · Society Constitution & Policy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#073D32] tracking-tight font-bengali">
            নীতিমালা ও সাধারণ পরিচালনা বিধিমালা
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#202923]/80 font-bengali">
            আল-ফালাহ সমবায় সমিতির গঠনতন্ত্র ও সাধারণ সভার অনুমোদিত অফিশিয়াল নীতিমালা। সকল সদস্যের জন্য এই বিধিমালা বাধ্যতামূলক ও অপরিবর্তনীয়।
          </p>
          <div className="w-20 h-1 bg-[#D6B66C] mx-auto mt-4 rounded-full" />
        </div>

        {/* Policy Items Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {policies.map((policy) => {
            const isOpen = openId === policy.id;
            return (
              <div
                key={policy.id}
                className="rounded-xl border border-[#E2E8E0] overflow-hidden transition-all duration-200 bg-[#F8FAF7]"
              >
                <button
                  type="button"
                  onClick={() => togglePolicy(policy.id)}
                  className={`w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors font-bengali ${
                    isOpen ? 'bg-[#073D32] text-white' : 'bg-white text-[#073D32] hover:bg-[#F8FAF7]'
                  }`}
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-num shrink-0 ${
                        isOpen
                          ? 'bg-[#D6B66C] text-[#073D32]'
                          : 'bg-[#075B46]/10 text-[#075B46]'
                      }`}
                    >
                      {policy.display_order}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold">
                      {policy.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-[#D6B66C]' : 'text-gray-400'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-6 bg-white border-t border-[#E2E8E0] text-sm sm:text-base text-[#202923]/90 leading-relaxed font-bengali whitespace-pre-line animate-in fade-in duration-150">
                    {policy.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Constitutional Guarantee Box */}
        <div className="max-w-4xl mx-auto mt-12 p-6 rounded-2xl bg-[#073D32]/5 border border-[#075B46]/20 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="p-3 rounded-full bg-[#075B46] text-[#D6B66C] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-[#073D32] font-bengali text-base">
              গঠনতান্ত্রিক নিশ্চয়তা ও আইনি কাঠামো
            </h4>
            <p className="text-xs sm:text-sm text-[#202923]/70 font-bengali mt-0.5">
              উপরে বর্ণিত যেকোনো ধারা বা বিধিমালার সংশোধন বা সংযোজন কেবল সাধারণ সভার তিন-চতুর্থাংশ (৩/৪) সদস্যদের লিখিত সর্বসম্মত ভোটে কার্যকর হতে পারে।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
