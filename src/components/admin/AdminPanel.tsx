import React, { useState } from 'react';
import { 
  Users, CreditCard, BookOpen, Clock, Activity, Database, LogOut, 
  ExternalLink, Home, Shield, ChevronRight 
} from 'lucide-react';
import { AdminSession } from '../../services/auth';
import { SocietyStats, Member, Payment, Policy, ContactContent, AuditLog } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { MemberManagement } from './MemberManagement';
import { PaymentManagement } from './PaymentManagement';
import { PolicyEditor } from './PolicyEditor';
import { ContactEditor } from './ContactEditor';
import { AuditLogViewer } from './AuditLogViewer';
import { SupabaseModal } from './SupabaseModal';
import emblemImg from '../../assets/images/society_emblem_1793374522881.jpg';

interface AdminPanelProps {
  session: AdminSession;
  stats: SocietyStats;
  members: Member[];
  payments: Payment[];
  policies: Policy[];
  contact: ContactContent;
  auditLogs: AuditLog[];
  onLogout: () => void;
  onRefreshAllData: () => void;
  onReturnToPublicSite: () => void;
}

type TabType = 'dashboard' | 'members' | 'payments' | 'policy' | 'contact' | 'logs';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  session,
  stats,
  members,
  payments,
  policies,
  contact,
  auditLogs,
  onLogout,
  onRefreshAllData,
  onReturnToPublicSite,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const tabs: { id: TabType; label: string; enLabel: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'সার্বিক চিত্র', enLabel: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'members', label: 'সদস্য ব্যবস্থাপনা', enLabel: 'Members', icon: <Users className="w-4 h-4" />, badge: `${members.length}` },
    { id: 'payments', label: 'মাসিক কিস্তি জমা', enLabel: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'policy', label: 'গঠনতন্ত্র ও নীতিমালা', enLabel: 'Policies', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'contact', label: 'যোগাযোগ সম্পাদক', enLabel: 'Contact', icon: <Clock className="w-4 h-4" /> },
    { id: 'logs', label: 'অডিট হিস্ট্রি', enLabel: 'Audit Logs', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#202923] flex flex-col font-bengali">
      {/* Top Admin Bar */}
      <header className="bg-[#073D32] text-white border-b border-[#075B46] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img
                src={emblemImg}
                alt="Al Falah Emblem"
                className="w-10 h-10 rounded-full border border-[#D6B66C] object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    আল-ফালাহ সমবায় সমিতি
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold font-english uppercase bg-[#D6B66C] text-[#073D32]">
                    ADMIN PANEL
                  </span>
                </div>
                <p className="text-[11px] text-[#E2E8E0]/70 font-english truncate max-w-xs">
                  Logged in: {session.user.email} ({session.user.role})
                </p>
              </div>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Supabase & DB Schema Modal Trigger */}
              <button
                onClick={() => setIsSupabaseModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#075B46] hover:bg-[#097358] text-white text-xs font-semibold border border-[#D6B66C]/30 transition-colors"
                title="Database Architecture & SQL Schema"
              >
                <Database className="w-3.5 h-3.5 text-[#D6B66C]" />
                <span className="font-english">Database / Supabase</span>
              </button>

              {/* Back to Public Site */}
              <button
                onClick={onReturnToPublicSite}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#075B46] hover:bg-[#097358] text-[#F8FAF7] text-xs font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#D6B66C]" />
                <span className="hidden sm:inline">পাবলিক ওয়েবসাইট</span>
                <span className="sm:hidden">ওয়েবসাইট</span>
              </button>

              {/* Log Out */}
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold transition-colors"
                title="লগ আউট"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs (Segmented Control Bar) */}
        <div className="bg-[#054434] border-t border-[#075B46] overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 sm:space-x-2 py-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#D6B66C] text-[#073D32] shadow-sm'
                      : 'text-[#E2E8E0] hover:text-white hover:bg-[#075B46]/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-english ${
                        isActive ? 'bg-[#073D32] text-white' : 'bg-[#075B46] text-[#D6B66C]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Tab Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            stats={stats}
            recentLogs={auditLogs}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'members' && (
          <MemberManagement
            members={members}
            adminEmail={session.user.email}
            onRefresh={onRefreshAllData}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentManagement
            payments={payments}
            members={members}
            adminEmail={session.user.email}
            onRefresh={onRefreshAllData}
          />
        )}

        {activeTab === 'policy' && (
          <PolicyEditor
            policies={policies}
            adminEmail={session.user.email}
            onRefresh={onRefreshAllData}
          />
        )}

        {activeTab === 'contact' && (
          <ContactEditor
            contact={contact}
            adminEmail={session.user.email}
            onRefresh={onRefreshAllData}
          />
        )}

        {activeTab === 'logs' && (
          <AuditLogViewer
            logs={auditLogs}
            adminEmail={session.user.email}
            onRefresh={onRefreshAllData}
          />
        )}
      </main>

      {/* Supabase Diagnostics & Architecture Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        adminEmail={session.user.email}
        onDataReset={onRefreshAllData}
      />
    </div>
  );
};
