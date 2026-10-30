import React, { useState } from 'react';
import { Lock, Mail, KeyRound, AlertCircle, X, Shield, ArrowRight } from 'lucide-react';
import { authService, AdminSession } from '../../services/auth';
import emblemImg from '../../assets/images/society_emblem_1793374522881.jpg';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: AdminSession) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@alfalah.org');
  const [password, setPassword] = useState('alfalah2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login(email, password);
      if (res.success && res.session) {
        onLoginSuccess(res.session);
        onClose();
      } else {
        setError(res.error || 'লগইন ব্যর্থ হয়েছে। সঠিক তথ্য প্রদান করুন।');
      }
    } catch (err: any) {
      setError(err?.message || 'সার্ভার যোগাযোগে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#D6B66C]/30 overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#073D32] p-6 text-white text-center relative border-b border-[#075B46]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={emblemImg}
            alt="Al Falah Emblem"
            className="w-16 h-16 rounded-full border-2 border-[#D6B66C] object-cover mx-auto mb-3 shadow"
            referrerPolicy="no-referrer"
          />

          <h3 className="text-xl font-bold font-bengali">
            প্রশাসনিক প্রবেশদ্বার
          </h3>
          <p className="text-xs text-[#D6B66C] font-english uppercase tracking-widest mt-0.5">
            Al Falah Somobay Somiti Admin Portal
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#075B46] text-[#D6B66C] text-[11px] font-medium mt-3 border border-[#D6B66C]/20">
            <Shield className="w-3 h-3" />
            <span>শুধুমাত্র অনুমোদিত অ্যাডমিনদের জন্য</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 font-bengali">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-bengali">
            <div>
              <label className="block text-xs font-bold text-[#073D32] mb-1.5">
                অ্যাডমিন ইমেইল (Admin Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@alfalah.org"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#F8FAF7] border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#075B46] font-english"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#073D32] mb-1.5">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#F8FAF7] border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#075B46]"
                />
              </div>
            </div>

            {/* Quick Helper Credentials Note */}
            <div className="p-3 bg-[#F8FAF7] rounded-lg border border-[#E2E8E0] text-[11px] text-[#202923]/70 space-y-1 font-english">
              <div className="font-semibold text-[#075B46]">Default Admin Credentials:</div>
              <div>Email: <code className="text-gray-800">admin@alfalah.org</code></div>
              <div>Password: <code className="text-gray-800">alfalah2026</code></div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#075B46] hover:bg-[#097358] text-white font-semibold text-sm transition-colors shadow-md disabled:opacity-60"
            >
              {loading ? (
                <span>যাচাই করা হচ্ছে...</span>
              ) : (
                <>
                  <span>লগইন করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
