import React, { useState } from 'react';
import { 
  UserCheck, UserPlus, KeyRound, Trash2, Edit2, Shield, Mail, 
  Check, AlertCircle, X, ShieldAlert 
} from 'lucide-react';
import { AdminUser } from '../../types';
import { authService, AdminCredentialUser } from '../../services/auth';

interface AdminUserManagementProps {
  currentAdminEmail: string;
  onRefresh: () => void;
}

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({
  currentAdminEmail,
  onRefresh,
}) => {
  const [adminUsers, setAdminUsers] = useState<AdminCredentialUser[]>(() => authService.getAdminUsers());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminCredentialUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New admin form state
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'super_admin' | 'admin' | 'auditor'>('admin');

  // Edit form state
  const [editFullName, setEditFullName] = useState('');
  const [editRole, setEditRole] = useState<'super_admin' | 'admin' | 'auditor'>('admin');
  const [editPassword, setEditPassword] = useState('');

  const refreshList = () => {
    setAdminUsers(authService.getAdminUsers());
    onRefresh();
  };

  const handleOpenAdd = () => {
    setUsername('');
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('admin');
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = authService.createAdminUser(
      {
        username,
        full_name: fullName,
        email,
        password,
        role,
      },
      currentAdminEmail
    );

    if (res.success) {
      setSuccess(`নতুন অ্যাডমিন ব্যবহারকারী '${username}' সফলভাবে তৈরি হয়েছে।`);
      setIsAddModalOpen(false);
      refreshList();
      setTimeout(() => setSuccess(null), 4000);
    } else {
      setError(res.error || 'অ্যাডমিন ইউজার তৈরিতে সমস্যা হয়েছে।');
    }
  };

  const handleOpenEdit = (user: AdminCredentialUser) => {
    setEditingUser(user);
    setEditFullName(user.full_name);
    setEditRole(user.role);
    setEditPassword('');
    setError(null);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setError(null);

    const res = authService.updateAdminUser(
      editingUser.id,
      {
        full_name: editFullName,
        role: editRole,
        password: editPassword || undefined,
      },
      currentAdminEmail
    );

    if (res.success) {
      setSuccess(`অ্যাডমিন '${editingUser.username}' এর তথ্য সফলভাবে হালনাগাদ হয়েছে।`);
      setEditingUser(null);
      refreshList();
      setTimeout(() => setSuccess(null), 4000);
    } else {
      setError(res.error || 'হালনাগাদ করতে সমস্যা হয়েছে।');
    }
  };

  const handleDeleteUser = (user: AdminCredentialUser) => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে অ্যাডমিন '${user.username}' (${user.full_name}) কে মুছে ফেলতে চান?`)) {
      return;
    }

    const res = authService.deleteAdminUser(user.id, currentAdminEmail);
    if (res.success) {
      setSuccess(`অ্যাডমিন '${user.username}' কে মুছে ফেলা হয়েছে।`);
      refreshList();
      setTimeout(() => setSuccess(null), 4000);
    } else {
      setError(res.error || 'অ্যাডমিন মুছে ফেলা সম্ভব হয়নি।');
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#073D32] font-bengali flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#075B46]" />
            <span>অ্যাডমিন ব্যবহারকারী ব্যবস্থাপনা (WordPress-Style Admin Users)</span>
          </h2>
          <p className="text-xs text-gray-500 font-bengali mt-0.5">
            একাধিক অ্যাডমিন একাউন্ট তৈরি, রোল নির্ধারণ ও পাসওয়ার্ড ব্যবস্থাপনা
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075B46] hover:bg-[#097358] text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm self-start sm:self-auto font-bengali"
        >
          <UserPlus className="w-4 h-4" />
          <span>নতুন অ্যাডমিন তৈরি করুন</span>
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bengali flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bengali flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider font-english">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {adminUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#075B46] font-english whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#073D32] text-[#D6B66C] flex items-center justify-center text-xs font-bold font-english">
                        {user.username.replace('@', '').charAt(0).toUpperCase()}
                      </div>
                      <span>{user.username}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900 font-bengali">
                    {user.full_name}
                  </td>
                  <td className="py-3.5 px-4 font-english text-xs text-gray-600">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        user.role === 'super_admin'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : user.role === 'admin'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      <span>
                        {user.role === 'super_admin'
                          ? 'Super Admin'
                          : user.role === 'admin'
                          ? 'Admin'
                          : 'Auditor'}
                      </span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-english text-xs text-gray-500">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                        title="সম্পাদনা ও পাসওয়ার্ড পরিবর্তন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW ADMIN MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-[#073D32] p-5 text-white flex items-center justify-between border-b border-[#075B46]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#075B46] rounded-lg text-[#D6B66C]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-bengali">
                    নতুন অ্যাডমিন ব্যবহারকারী তৈরি ফরম
                  </h3>
                  <p className="text-xs text-[#D6B66C] font-english">
                    Create New Administrative User
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 font-bengali text-sm">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ইউজারনেম (Username) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="উদা: @manager অথবা @shafiq"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-english focus:outline-none focus:border-[#075B46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  পূর্ণ নাম (Full Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="উদা: শফিকুল ইসলাম"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ইমেইল ঠিকানা (Email) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@alfalah.org"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-english focus:outline-none focus:border-[#075B46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  পাসওয়ার্ড (Password) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={5}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ন্যূনতম ৫ অক্ষরের পাসওয়ার্ড"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  রোল নির্ধারণ (Role) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                >
                  <option value="admin">Admin (সদস্য ও কিস্তি ব্যবস্থাপনা)</option>
                  <option value="super_admin">Super Admin (সম্পূর্ণ নিয়ন্ত্রণ ও ইউজার ম্যানেজমেন্ট)</option>
                  <option value="auditor">Auditor (হিসাব নিরীক্ষা ও অডিট লগ পরিদর্শন)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-[#075B46] hover:bg-[#097358] rounded-lg shadow-sm"
                >
                  তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ADMIN MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-[#073D32] p-5 text-white flex items-center justify-between border-b border-[#075B46]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#075B46] rounded-lg text-[#D6B66C]">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-bengali">
                    অ্যাডমিন তথ্য ও পাসওয়ার্ড হালনাগাদ
                  </h3>
                  <p className="text-xs text-[#D6B66C] font-english">
                    {editingUser.username} ({editingUser.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-full text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4 font-bengali text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  পূর্ণ নাম
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  রোল পরিবর্তন
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                >
                  <option value="admin">Admin (সদস্য ও কিস্তি ব্যবস্থাপনা)</option>
                  <option value="super_admin">Super Admin (সম্পূর্ণ নিয়ন্ত্রণ)</option>
                  <option value="auditor">Auditor (হিসাব নিরীক্ষা)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  নতুন পাসওয়ার্ড (পরিবর্তন করতে চাইলে লিখুন)
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="অপরিবর্তিত রাখতে খালি রাখুন"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-[#075B46] hover:bg-[#097358] rounded-lg shadow-sm"
                >
                  হালনাগাদ সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
