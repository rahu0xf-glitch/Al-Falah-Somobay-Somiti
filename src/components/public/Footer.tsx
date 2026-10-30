import React from 'react';
import { Shield, Lock } from 'lucide-react';
import emblemImg from '../../assets/images/society_emblem_1793374522881.jpg';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#073D32] text-white border-t border-[#075B46]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={emblemImg}
                alt="Al Falah Emblem"
                className="w-12 h-12 rounded-full border border-[#D6B66C] object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-bengali text-lg sm:text-xl font-bold text-white">
                  আল-ফালাহ সমবায় সমিতি
                </h3>
                <p className="font-english text-xs text-[#D6B66C] font-semibold tracking-wider uppercase">
                  Al Falah Somobay Somiti
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#E2E8E0]/80 leading-relaxed font-bengali max-w-md">
              একটি শৃঙ্খলাবদ্ধ ও বিশ্বস্ত ইসলামিক সমবায় সমিতি। নির্দিষ্ট সদস্যদের আমানত সংরক্ষণ, যৌথ কল্যাণ ও শতভাগ আর্থিক স্বচ্ছতা প্রতিষ্ঠায় নিবেদিত।
            </p>
            <div className="pt-2 text-xs text-[#D6B66C] font-bengali flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>নির্ধারিত সদস্য সংখ্যাভিত্তিক সমবায় প্রতিষ্ঠান · সাধারণ সদস্য আবেদন বন্ধ</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-english uppercase tracking-wider text-[#D6B66C]">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#E2E8E0] font-bengali">
              <li>
                <a href="#home" className="hover:text-[#D6B66C] transition-colors">
                  মূলপাতা (Home)
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#D6B66C] transition-colors">
                  সমিতি পরিচিতি (About)
                </a>
              </li>
              <li>
                <a href="#members" className="hover:text-[#D6B66C] transition-colors">
                  সদস্য খতিয়ান ও তহবিল (Members & Fund)
                </a>
              </li>
              <li>
                <a href="#policy" className="hover:text-[#D6B66C] transition-colors">
                  গঠনতন্ত্র ও নীতিমালা (Policy)
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#D6B66C] transition-colors">
                  যোগাযোগ (Contact)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Admin Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-english uppercase tracking-wider text-[#D6B66C]">
              System Administration
            </h4>
            <p className="text-xs text-[#E2E8E0]/70 font-bengali leading-relaxed">
              অনুমোদিত কার্যনির্বাহী সদস্য ও অডিটরদের জন্য সংরক্ষিত প্রশাসনিক পোর্টাল।
            </p>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#075B46] hover:bg-[#097358] text-[#F8FAF7] border border-[#D6B66C]/30 text-xs font-semibold transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-[#D6B66C]" />
              <span>প্রশাসনিক প্রবেশদ্বার (/admin)</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#075B46] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E2E8E0]/60">
          <p className="font-bengali text-center sm:text-left">
            © {new Date().getFullYear()} আল-ফালাহ সমবায় সমিতি (Al Falah Somobay Somiti). সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-4 text-[11px] font-english">
            <span>Security Protected</span>
            <span>·</span>
            <span>Audited Accounts</span>
            <span>·</span>
            <span>Shariah Compliant Principles</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
