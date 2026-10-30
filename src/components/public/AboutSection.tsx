import React from 'react';
import { Target, Compass, CheckCircle2, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';
import emblemImg from '../../assets/images/society_emblem_1793374522881.jpg';
import hallImg from '../../assets/images/cooperative_hall_1793374523276.jpg';

export const AboutSection: React.FC = () => {
  const objectives = [
    {
      num: '০১',
      title: 'পারস্পরিক আর্থিক কল্যাণ ও নিরাপত্তা',
      desc: 'সদস্যদের একক ও যৌথ আমানতের সর্বোচ্চ নিরাপত্তা নিশ্চিত করে সুশৃঙ্খলভাবে আর্থিক কল্যাণ সাধন করা।',
    },
    {
      num: '০২',
      title: 'নিয়মিত সঞ্চয় ও সুদমুক্ত অর্থনীতি',
      desc: 'প্রতি মাসে বাধ্যতামূলক নির্দিষ্ট কিস্তি জমার মাধ্যমে সঞ্চয়ের মানসিকতা তৈরি এবং সুদমুক্ত অর্থনীতি চর্চা।',
    },
    {
      num: '০৩',
      title: 'জরুরি প্রয়োজনে পারস্পরিক সহায়তা',
      desc: 'সদস্যদের যেকোনো আকস্মিক বা সংকটকালীন মুহূর্তে পূর্বনির্ধারিত কল্যাণ নীতিমালা অনুযায়ী পারস্পরিক সহযোগিতার হাত প্রসারিত করা।',
    },
    {
      num: '০৪',
      title: 'স্বচ্ছ হিসাবরক্ষণ ও শতভাগ জবাবদিহিতা',
      desc: 'ডিজিটাল ডাটাবেজ ও নিরপেক্ষ অভ্যন্তরীণ অডিটের মাধ্যমে তহবিলের আয়-ব্যয় ও স্থিতির নিখুঁত স্বচ্ছতা বজায় রাখা।',
    },
  ];

  const activities = [
    'প্রতি ক্যালেন্ডার মাসের ১০ তারিখের মধ্যে নির্দিষ্ট মাসিক সঞ্চয় কিস্তি সংগ্রহ ও হালনাগাদকরণ',
    'মাসিক ও বাৎসরিক আর্থিক স্থিতিপত্র ডিজিটাল সিস্টেমে স্বয়ংক্রিয় হিসাব প্রস্তুতকরণ',
    'সদস্যদের যৌথ মতামতের ভিত্তিতে সুদমুক্ত ও শরীয়াহ-সম্মত নিরাপদ বিনিয়োগ সম্ভাবনা যাচাই',
    'নিয়মিত কার্যনির্বাহী সভা ও বার্ষিক সাধারণ সভার (AGM) মাধ্যমে নীতি পর্যালোচনা',
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#F8FAF7] border-b border-[#E2E8E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#075B46] uppercase tracking-wider mb-3">
            <Compass className="w-4 h-4 text-[#D6B66C]" />
            <span>আমাদের পরিচিতি ও লক্ষ্য · About Al Falah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#073D32] tracking-tight font-bengali">
            ঐক্যবদ্ধ সঞ্চয় ও দায়িত্বশীল আর্থিক সমবায়
          </h2>
          <div className="w-20 h-1 bg-[#D6B66C] mx-auto mt-4 rounded-full" />
        </div>

        {/* 2-Column Split: Story & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#E2E8E0] shadow-sm">
              <img
                src={emblemImg}
                alt="Al Falah Emblem"
                className="w-16 h-16 rounded-full border-2 border-[#D6B66C] object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-bengali text-xl font-bold text-[#073D32]">
                  আল-ফালাহ সমবায় সমিতি
                </h3>
                <p className="font-english text-xs text-[#075B46] font-semibold tracking-wide">
                  AL FALAH SOMOBAY SOMITI · ESTABLISHED WITH FIXED MEMBERSHIP
                </p>
              </div>
            </div>

            <p className="text-[#202923] text-base sm:text-lg leading-relaxed font-bengali">
              <strong>আল-ফালাহ সমবায় সমিতি</strong> একটি সুসংগঠিত ও সুনির্দিষ্ট সদস্যদের সমন্বয়ে প্রতিষ্ঠিত যৌথ সঞ্চয় সমিতি। এই সমিতি প্রচলিত বাণিজ্যিক আর্থিক প্রতিষ্ঠানের বিকল্প হিসেবে সদস্যদের নৈতিক দায়িত্ববোধ, পারস্পরিক গভীর আস্থা ও সুদমুক্ত ইসলামী জীবনদর্শনের ভিত্তিতে যাত্রা শুরু করে।
            </p>

            <p className="text-[#202923]/90 text-sm sm:text-base leading-relaxed font-bengali">
              সমিতির মূল দর্শন হলো সদস্যদের ছোট ছোট সঞ্চয় একত্রিত করে একটি সমৃদ্ধ ও শক্তিশালী মূলধন গঠন করা, যা সদস্যদের জীবনযাত্রার মান উন্নয়ন এবং যেকোনো প্রতিকূলতায় আর্থিক সক্ষমতা তৈরিতে বলিষ্ঠ ভূমিকা রাখে।
            </p>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-xl bg-white border border-[#E2E8E0] hover:border-[#D6B66C]/60 transition-colors">
                <div className="flex items-center gap-2.5 text-[#075B46] font-bold text-base mb-2 font-bengali">
                  <Target className="w-5 h-5 text-[#D6B66C]" />
                  <span>আমাদের মিশন (Mission)</span>
                </div>
                <p className="text-xs sm:text-sm text-[#202923]/80 leading-relaxed font-bengali">
                  নিয়মিত সঞ্চয় অভ্যাস তৈরি, আমানতের পূর্ণ নিরাপত্তা বিধান এবং শতভাগ জবাবদিহিতামূলক ব্যবস্থাপনার মাধ্যমে সদস্যদের সার্বিক অর্থনৈতিক নিরাপত্তা বৃদ্ধি করা।
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-[#E2E8E0] hover:border-[#D6B66C]/60 transition-colors">
                <div className="flex items-center gap-2.5 text-[#075B46] font-bold text-base mb-2 font-bengali">
                  <Eye className="w-5 h-5 text-[#D6B66C]" />
                  <span>আমাদের ভিশন (Vision)</span>
                </div>
                <p className="text-xs sm:text-sm text-[#202923]/80 leading-relaxed font-bengali">
                  একটি সুশৃঙ্খল, সুদমুক্ত ও অনুকরণীয় যৌথ সঞ্চয় মডেল প্রতিষ্ঠা করা যা পারস্পরিক বন্ধন সুদৃঢ় ও সদস্যদের পরিবারবর্গের অর্থনৈতিক স্বনির্ভরতা নিশ্চিত করে।
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-[#E2E8E0] shadow-lg group">
              <img
                src={hallImg}
                alt="Cooperative Council Boardroom"
                className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#073D32]/90 via-[#073D32]/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-english font-semibold text-[#D6B66C] uppercase tracking-wider mb-1">
                  Governance & Collective Trust
                </span>
                <h4 className="text-lg font-bold font-bengali">
                  কার্যনির্বাহী কাউন্সিল ও সাধারণ পরিষদ
                </h4>
                <p className="text-xs text-[#E2E8E0]/90 font-bengali mt-1">
                  সকল সিদ্ধান্ত সর্বসম্মতিক্রমে এবং সমিতির গঠনতন্ত্র অনুযায়ী বাস্তবায়িত হয়।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Objectives Bento Grid */}
        <div className="mb-16">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#073D32] font-bengali flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-[#075B46]" />
              <span>সমিতির প্রধান উদ্দেশ্য ও লক্ষ্যসমূহ</span>
            </h3>
            <p className="text-sm text-[#202923]/70 font-bengali mt-1">
              গঠনতন্ত্রের ধারা ৩ অনুযায়ী নির্ধারিত স্থায়ী লক্ষ্য ও মূলনীতি
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {objectives.map((obj) => (
              <div
                key={obj.num}
                className="bg-white p-6 rounded-xl border border-[#E2E8E0] hover:border-[#075B46] hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl font-extrabold text-[#D6B66C] font-bengali mb-3 group-hover:text-[#075B46] transition-colors">
                    {obj.num}
                  </div>
                  <h4 className="text-base font-bold text-[#073D32] font-bengali mb-2">
                    {obj.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#202923]/75 font-bengali leading-relaxed">
                    {obj.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-[#073D32] text-white p-6 sm:p-8 rounded-2xl border border-[#075B46]">
          <h4 className="text-xl font-bold font-bengali text-[#D6B66C] mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D6B66C]" />
            <span>সমিতির নিয়মিত কার্যক্রম (Key Activities)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((act, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-[#E2E8E0] font-bengali">
                <CheckCircle2 className="w-4 h-4 text-[#D6B66C] shrink-0 mt-0.5" />
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
