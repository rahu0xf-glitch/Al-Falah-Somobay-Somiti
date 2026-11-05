import React, { useState, useEffect, useCallback } from 'react';
import { dbService } from './services/db';
import { authService, AdminSession } from './services/auth';
import { SocietyStats, PublicMember, Member, Payment, Policy, ContactContent, AuditLog } from './types';
import { Navbar } from './components/public/Navbar';
import { HeroSection } from './components/public/HeroSection';
import { AboutSection } from './components/public/AboutSection';
import { MembersSection } from './components/public/MembersSection';
import { PolicySection } from './components/public/PolicySection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminPanel } from './components/admin/AdminPanel';

export default function App() {
  // Routing view state: 'public' | 'admin'
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Central Database State
  const [stats, setStats] = useState<SocietyStats>({
    totalMembers: 0,
    totalFund: 0,
    totalDepositsCount: 0,
    totalPaidMonths: 0,
    lastUpdated: '',
  });
  const [publicMembers, setPublicMembers] = useState<PublicMember[]>([]);
  const [fullMembers, setFullMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [contact, setContact] = useState<ContactContent>({
    id: 'contact-main',
    heading: 'যোগাযোগ ও দাপ্তরিক ঠিকানা',
    content: 'আল-ফালাহ সমবায় সমিতির যেকোনো তথ্যানুসন্ধান বা আনুষ্ঠানিক যোগাযোগের জন্য অনুরোধ করা হলো।',
    address: 'আল-ফালাহ ভবন, হাউজ # ১২, রোড # ০৪, সেক্টর # ০৯, উত্তরা, ঢাকা-১২৩০',
    phone: '+880 1711-234567, +880 1819-345678',
    email: 'info@alfalahsomobay.org',
    office_hours: 'শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৫:০০',
    updated_at: '',
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch all state from dbService
  const loadDatabaseState = useCallback(async () => {
    try {
      const [
        fetchedStats,
        fetchedPublicMembers,
        fetchedFullMembers,
        fetchedPayments,
        fetchedPolicies,
        fetchedContact,
        fetchedLogs,
      ] = await Promise.all([
        dbService.getSocietyStats(),
        dbService.getPublicMembers(),
        dbService.getAllMembers(),
        dbService.getAllPayments(),
        dbService.getPolicies(),
        dbService.getContactContent(),
        dbService.getAuditLogs(),
      ]);

      setStats(fetchedStats);
      setPublicMembers(fetchedPublicMembers);
      setFullMembers(fetchedFullMembers);
      setPayments(fetchedPayments);
      setPolicies(fetchedPolicies);
      setContact(fetchedContact);
      setAuditLogs(fetchedLogs);
    } catch (err) {
      console.error('Error loading database state:', err);
    } finally {
      setDataLoaded(true);
    }
  }, []);

  // Initialize session & load database
  useEffect(() => {
    const curSession = authService.getCurrentSession();
    if (curSession) {
      setSession(curSession);
    }

    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.endsWith('/admin') || hash === '#admin') {
        const s = authService.getCurrentSession();
        if (s) {
          setCurrentView('admin');
          setIsLoginModalOpen(false);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };

    checkAdminRoute();
    loadDatabaseState();

    // Listen for url / hash changes
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.endsWith('/admin') || hash === '#admin') {
        const s = authService.getCurrentSession();
        if (s) {
          setCurrentView('admin');
        } else {
          setIsLoginModalOpen(true);
        }
      } else {
        setCurrentView('public');
        setIsLoginModalOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [loadDatabaseState]);

  const handleOpenAdmin = () => {
    if (session) {
      setCurrentView('admin');
      window.history.pushState(null, '', '/admin');
    } else {
      setIsLoginModalOpen(true);
      window.history.pushState(null, '', '/admin');
    }
  };

  const handleLoginSuccess = (newSession: AdminSession) => {
    setSession(newSession);
    setCurrentView('admin');
    window.history.pushState(null, '', '/admin');
    loadDatabaseState();
  };

  const handleLogout = () => {
    authService.logout();
    setSession(null);
    setCurrentView('public');
    window.history.pushState(null, '', '/');
    loadDatabaseState();
  };

  const handleReturnToPublic = () => {
    setCurrentView('public');
    window.history.pushState(null, '', '/');
    loadDatabaseState();
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    if (currentView !== 'admin') {
      window.history.pushState(null, '', '/');
    }
  };

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-[#F8FAF7] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#075B46] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bengali text-[#073D32] text-sm font-semibold">
          আল-ফালাহ সমবায় সমিতির ডাটাবেজ লোড হচ্ছে...
        </p>
      </div>
    );
  }

  // Render Admin View
  if (currentView === 'admin' && session) {
    return (
      <AdminPanel
        session={session}
        stats={stats}
        members={fullMembers}
        payments={payments}
        policies={policies}
        contact={contact}
        auditLogs={auditLogs}
        onLogout={handleLogout}
        onRefreshAllData={loadDatabaseState}
        onReturnToPublicSite={handleReturnToPublic}
      />
    );
  }

  // Render Public View
  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#202923] flex flex-col">
      {/* Public Top Navbar (Admin login button hidden for visitors) */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={!!session}
      />

      {/* Main Single-Page Content */}
      <main className="flex-1">
        {/* Section 1: Home / Hero */}
        <HeroSection stats={stats} />

        {/* Section 2: About */}
        <AboutSection />

        {/* Section 3: Members & Total Fund */}
        <MembersSection
          stats={stats}
          members={publicMembers}
          onDataChange={loadDatabaseState}
        />

        {/* Section 4: Policy & Regulations */}
        <PolicySection policies={policies} />

        {/* Section 5: Contact */}
        <ContactSection contact={contact} />
      </main>

      {/* Public Footer (Admin button hidden) */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Admin Login Modal (Triggered securely via /admin or #admin) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
