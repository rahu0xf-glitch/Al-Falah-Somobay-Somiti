import React, { useState } from 'react';
import { 
  Users, CreditCard, BookOpen, Clock, Activity, Database, LogOut, 
  ExternalLink, Home, Shield, Bell, Check, UserCheck, X 
} from 'lucide-react';
import { AdminSession } from '../../services/auth';
import { SocietyStats, Member, Payment, Policy, ContactContent, AuditLog } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { MemberManagement } from './MemberManagement';
import { PaymentManagement } from './PaymentManagement';
import { PolicyEditor } from './PolicyEditor';
import { ContactEditor } from './ContactEditor';
import { AuditLogViewer } from './AuditLogViewer';
import { AdminUserManagement } from './AdminUserManagement';
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

type TabType = 'dashboard' | 'members' | 'payments' | 'policy' | 'contact' | 'users' | 'logs';

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Admin identifier for audit attribution
  const adminIdentifier = `${session.user.username} (${session.user.email})`;

  const tabs: { id: TabType; label: string; enLabel: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'সার্বিক চিত্র', enLabel: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'members', label: 'সদস্য ব্যবস্থাপনা', enLabel: 'Members', icon: <Users className="w-4 h-4" />, badge: `${members.length}` },
    { id: 'payments', label: 'মাসিক কিস্তি জমা', enLabel: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'policy', label: 'গঠনতন্ত্র ও নীতিমালা', enLabel: 'Policies', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'contact', label: 'যোগাযোগ সম্পাদক', enLabel: 'Contact', icon: <Clock className="w-4 h-4" /> },
    { id: 'users', label: 'অ্যাডমিন ইউজার', enLabel: 'Admin Users', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'logs', label: 'অডিট হিস্ট্রি', enLabel: 'Audit Logs', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#202923] flex flex-col font-bengali">
      {/* Top Admin Bar */}
      <header className="bg-[#073D32] text-white border-b border-[#075B46] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Brand & Logged in Admin Indicator */}
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
                <p className="text-[11px] text-[#E2E8E0]/90 font-english truncate max-w-xs flex items-center gap-1.5">
                  <span className="font-bold text-[#D6B66C]">{session.user.username}</span>
                  <span>·</span>
                  <span className="text-gray-300">{session.user.email}</span>
                </p>
              </div>
            </div>

            {/* Right Header Actions & Notification Center */}
            <div className="flex items-center gap-2 sm:gap-3 relative">
              {/* Notification Center Trigger */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl bg-[#075B46] hover:bg-[#097358] text-[#E2E8E0] hover:text-white transition-colors"
                  title="অ্যাডমিন অ্যাক্টিভিটি নোটিফিকেশন"
                  aria-label="Activity Notifications"
                >
                  <Bell className="w-4 h-4 text-[#D6B66C]" />
                  {auditLogs.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center font-english">
                      {auditLogs.length > 9 ? '9+' : auditLogs.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-[#202923] rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in duration-150">
                    <div className="bg-[#073D32] p-3.5 text-white flex items-center justify-between border-b border-[#075B46]">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#D6B66C]" />
                        <span className="font-bold text-xs font-bengali">অ্যাডমিন অ্যাক্টিভিটি নোটিফিকেশন</span>
                      </div>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="text-white/70 hover:text-white text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 text-xs">
                      {auditLogs.slice(0, 8).map((log) => (
                        <div key={log.id} className="p-3 hover:bg-gray-50 transition-colors font-bengali">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-[#075B46] font-english text-[11px] truncate">
                              {log.admin_email}
                            </span>
                            <span className="text-[10px] text-gray-400 font-english whitespace-nowrap">
                              {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-gray-700 text-xs leading-relaxed">
                            {log.summary}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                      <button
                        onClick={() => {
                          setNotificationsOpen(false);
                          setActiveTab('logs');
                        }}
                        className="text-xs font-bold text-[#075B46] hover:underline font-bengali"
                      >
                        সকল অডিট ইতিহাস দেখুন →
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
            onNavigateTab={(tab) => setActiveTab(tab as any)}
          />
        )}

        {activeTab === 'members' && (
          <MemberManagement
            members={members}
            adminEmail={adminIdentifier}
            onRefresh={onRefreshAllData}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentManagement
            payments={payments}
            members={members}
            adminEmail={adminIdentifier}
            onRefresh={onRefreshAllData}
          />
        )}

        {activeTab === 'policy' && (
          <PolicyEditor
            policies={policies}
            adminEmail={adminIdentifier}
            onRefresh={onRefreshAllData}
          />
        )}

        {activeTab === 'contact' && (
          <ContactEditor
            contact={contact}
            adminEmail={adminIdentifier}
            onRefresh={onRefreshAllData}
          />
        )}

        {activeTab === 'users' && (
          <AdminUserManagement
            currentAdminEmail={adminIdentifier}
            onRefresh={onRefreshAllData}
          />
        )}

        {activeTab === 'logs' && (
          <AuditLogViewer
            logs={auditLogs}
            adminEmail={adminIdentifier}
            onRefresh={onRefreshAllData}
          />
        )}
      </main>

      {/* Supabase Diagnostics & Architecture Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        adminEmail={adminIdentifier}
        onDataReset={onRefreshAllData}
      />
    </div>
  );
};
