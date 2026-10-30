import React, { useState, useEffect } from 'react';
import { Lock, Menu, X, ShieldCheck } from 'lucide-react';
import emblemImg from '../../assets/images/society_emblem_1793374522881.jpg';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, isAdminLoggedIn }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', bnLabel: 'মূলপাতা', href: '#home' },
    { label: 'ABOUT', bnLabel: 'পরিচিতি', href: '#about' },
    { label: 'MEMBERS', bnLabel: 'সদস্য ও তহবিল', href: '#members' },
    { label: 'POLICY', bnLabel: 'নীতিমালা', href: '#policy' },
    { label: 'CONTACT', bnLabel: 'যোগাযোগ', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#073D32]/95 backdrop-blur-md border-b border-[#D6B66C]/25 shadow-lg'
          : 'bg-[#073D32] border-b border-[#075B46]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand wordmark (single text element / link) */}
          <a
            href="#home"
            className="flex items-center gap-3 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66C] rounded-lg p-1 transition-opacity hover:opacity-90 shrink-0"
          >
            <img
              src={emblemImg}
              alt="আল-ফালাহ সমবায় সমিতি মনোগ্রাম"
              className="w-10 h-10 rounded-full border border-[#D6B66C] object-cover shrink-0 shadow"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-bengali text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
                আল-ফালাহ সমবায় সমিতি
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#D6B66C] font-english font-medium whitespace-nowrap">
                Al Falah Somobay Somiti
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#E2E8E0] hover:text-[#D6B66C] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#D6B66C]"
              >
                <span className="font-english tracking-wide">{link.label}</span>
                <span className="text-xs opacity-75 font-bengali ml-1.5">({link.bnLabel})</span>
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm whitespace-nowrap shrink-0 ${
                isAdminLoggedIn
                  ? 'bg-[#D6B66C] text-[#073D32] hover:bg-[#e5c985]'
                  : 'bg-[#075B46] text-[#F8FAF7] border border-[#D6B66C]/40 hover:bg-[#097358]'
              }`}
            >
              {isAdminLoggedIn ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#073D32]" />
                  <span>অ্যাডমিন ড্যাশবোর্ড</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#D6B66C]" />
                  <span>অ্যাডমিন লগইন</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-[#075B46] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#073D32] border-b border-[#075B46] px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-[#E2E8E0] hover:text-[#D6B66C] hover:bg-[#075B46]/60 rounded-md transition-colors"
            >
              {link.bnLabel} · <span className="text-xs uppercase">{link.label}</span>
            </a>
          ))}
          <div className="pt-2 border-t border-[#075B46]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#D6B66C] text-[#073D32]"
            >
              <Lock className="w-4 h-4" />
              <span>{isAdminLoggedIn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন প্রবেশদ্বার'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
