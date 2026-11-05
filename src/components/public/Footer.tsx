import React from 'react';
import { Shield, Clock, MapPin } from 'lucide-react';
import emblemImg from '../../assets/images/society_emblem_1793374522881.jpg';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
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

          {/* Col 2: Navigation Links (Pure English labels only) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-english uppercase tracking-wider text-[#D6B66C]">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#E2E8E0] font-english font-medium">
              <li>
                <a href="#home" className="hover:text-[#D6B66C] transition-colors">
                  HOME
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#D6B66C] transition-colors">
                  ABOUT
                </a>
              </li>
              <li>
                <a href="#members" className="hover:text-[#D6B66C] transition-colors">
                  MEMBERS
                </a>
              </li>
              <li>
                <a href="#policy" className="hover:text-[#D6B66C] transition-colors">
                  POLICY
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#D6B66C] transition-colors">
                  CONTACT
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Office Hours & Location Note (No public admin buttons visible) */}
          <div className="space-y-3 font-bengali">
            <h4 className="text-xs font-bold font-english uppercase tracking-wider text-[#D6B66C]">
              কার্যালয় ও সময়সূচি
            </h4>
            <div className="flex items-start gap-2 text-xs text-[#E2E8E0]/80">
              <Clock className="w-4 h-4 text-[#D6B66C] shrink-0 mt-0.5" />
              <span>শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৫:০০ (শুক্রবার বন্ধ)</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#E2E8E0]/80">
              <MapPin className="w-4 h-4 text-[#D6B66C] shrink-0 mt-0.5" />
              <span>উত্তরা, ঢাকা-১২৩০, বাংলাদেশ</span>
            </div>
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
