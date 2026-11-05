import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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

  // Pure English navigation labels without Bangla sub-text
  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'ABOUT', href: '#about' },
    { label: 'MEMBERS', href: '#members' },
    { label: 'POLICY', href: '#policy' },
    { label: 'CONTACT', href: '#contact' },
  ];

  const [clickCount, setClickCount] = useState(0);

  const handleLogoSecretClick = (e: React.MouseEvent) => {
    const newCount = clickCount + 1;
    if (newCount >= 3) {
      setClickCount(0);
      onOpenAdmin();
    } else {
      setClickCount(newCount);
      setTimeout(() => setClickCount(0), 1500);
    }
  };

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
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogoSecretClick}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66C] rounded-full shrink-0 cursor-pointer"
              title="আল-ফালাহ সমবায় সমিতি"
            >
              <img
                src={emblemImg}
                alt="আল-ফালাহ সমবায় সমিতি মনোগ্রাম"
                className="w-10 h-10 rounded-full border border-[#D6B66C] object-cover shadow"
                referrerPolicy="no-referrer"
              />
            </button>
            <a
              href="#home"
              className="flex flex-col text-white focus:outline-none hover:opacity-90"
            >
              <span className="font-bengali text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
                আল-ফালাহ সমবায় সমিতি
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#D6B66C] font-english font-medium whitespace-nowrap">
                Al Falah Somobay Somiti
              </span>
            </a>
          </div>

          {/* Zone 2: Pure English nav links (HOME | ABOUT | MEMBERS | POLICY | CONTACT) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#E2E8E0] hover:text-[#D6B66C] font-english tracking-wider font-semibold transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#D6B66C]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Public admin button is hidden for security as requested;
              only shows if already logged in so admin can quickly jump back to panel */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {isAdminLoggedIn && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#D6B66C] text-[#073D32] hover:bg-[#e5c985] transition-all shadow-sm whitespace-nowrap shrink-0"
              >
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex lg:hidden items-center gap-2">
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
        <div className="lg:hidden bg-[#073D32] border-b border-[#075B46] px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold tracking-wider font-english text-[#E2E8E0] hover:text-[#D6B66C] hover:bg-[#075B46]/60 rounded-md transition-colors"
            >
              {link.label}
            </a>
          ))}
          {isAdminLoggedIn && (
            <div className="pt-2 border-t border-[#075B46]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#D6B66C] text-[#073D32]"
              >
                <span>Admin Dashboard</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
