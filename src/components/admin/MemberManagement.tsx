import React, { useState } from 'react';
import { 
  Users, UserPlus, Search, Edit2, Trash2, Eye, X, Check, AlertCircle, 
  FileText, Shield, Phone, CreditCard 
} from 'lucide-react';
import { Member } from '../../types';
import { dbService } from '../../services/db';
import { toBengaliNumber } from '../../utils/bengali';

interface MemberManagementProps {
  members: Member[];
  adminEmail: string;
  onRefresh: () => void;
}

export const MemberManagement: React.FC<MemberManagementProps> = ({
  members,
  adminEmail,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const initialFormState = {
    member_id: '',
    full_name: '',
    father_or_husband_name: '',
    mother_name: '',
    date_of_birth: '',
    occupation: '',
    permanent_address: '',
    present_address: '',
    mobile_number: '',
    nid_number: '',
    nominee_name: '',
    nominee_relationship: '',
    nominee_address: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const filteredMembers = members.filter((m) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      m.full_name.toLowerCase().includes(q) ||
      m.member_id.toLowerCase().includes(q) ||
      m.mobile_number.toLowerCase().includes(q) ||
      m.nid_number.toLowerCase().includes(q) ||
      (m.occupation && m.occupation.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    // Generate next suggested Member ID
    const nextNum = members.length + 1;
    const formattedId = `AFS-${nextNum < 10 ? `00${nextNum}` : nextNum < 100 ? `0${nextNum}` : nextNum}`;
    setFormData({ ...initialFormState, member_id: formattedId });
    setEditingMember(null);
    setIsAddModalOpen(true);
    setError(null);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setFormData({
      member_id: m.member_id,
      full_name: m.full_name,
      father_or_husband_name: m.father_or_husband_name || '',
      mother_name: m.mother_name || '',
      date_of_birth: m.date_of_birth || '',
      occupation: m.occupation || '',
      permanent_address: m.permanent_address || '',
      present_address: m.present_address || '',
      mobile_number: m.mobile_number || '',
      nid_number: m.nid_number || '',
      nominee_name: m.nominee_name || '',
      nominee_relationship: m.nominee_relationship || '',
      nominee_address: m.nominee_address || '',
    });
    setIsAddModalOpen(true);
    setError(null);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.member_id.trim() || !formData.full_name.trim()) {
      setError('সদস্য আইডি এবং পূর্ণ নাম আবশ্যক।');
      return;
    }

    try {
      if (editingMember) {
        const res = await dbService.updateMember(editingMember.id, formData, adminEmail);
        if (!res.success) {
          setError(res.error || 'সদস্যের তথ্য সংশোধন ব্যর্থ হয়েছে।');
          return;
        }
        setSuccess('সদস্যের তথ্য সফলভাবে সংশোধন করা হয়েছে।');
      } else {
        const res = await dbService.createMember(formData, adminEmail);
        if (!res.success) {
          setError(res.error || 'নতুন সদস্য যোগ করা সম্ভব হয়নি।');
          return;
        }
        setSuccess('নতুন সদস্য সফলভাবে ডাটাবেজে যুক্ত করা হয়েছে।');
      }

      setIsAddModalOpen(false);
      setEditingMember(null);
      onRefresh();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'ডাটাবেজ অপারেশন ব্যর্থ হয়েছে।');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingMember) return;
    try {
      const res = await dbService.deleteMember(deletingMember.id, adminEmail);
      if (res.success) {
        setSuccess(`সদস্য ${deletingMember.full_name} (${deletingMember.member_id}) সফলভাবে মুছে ফেলা হয়েছে।`);
        setDeletingMember(null);
        onRefresh();
        setTimeout(() => setSuccess(null), 4000);
      } else {
        setError(res.error || 'মুছে ফেলা ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setError(err?.message || 'অপারেশন ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#073D32] font-bengali flex items-center gap-2">
            <Users className="w-6 h-6 text-[#075B46]" />
            <span>সদস্য ব্যবস্থাপনা মডিউল (Member Management)</span>
          </h2>
          <p className="text-xs text-gray-500 font-bengali mt-0.5">
            নিবন্ধিত সদস্যদের বিস্তারিত তথ্য, এনআইডি ও নমিনি রেকর্ড পরিচালনা
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075B46] hover:bg-[#097358] text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm self-start sm:self-auto font-bengali"
        >
          <UserPlus className="w-4 h-4" />
          <span>নতুন সদস্য যুক্ত করুন</span>
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

      {/* Search Toolbar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="সদস্যের নাম, আইডি, ফোন বা এনআইডি দিয়ে ফিল্টার করুন..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#075B46] font-bengali"
          />
        </div>
        <div className="text-xs text-gray-500 font-bengali whitespace-nowrap">
          মোট সদস্য: <strong className="text-[#073D32]">{toBengaliNumber(filteredMembers.length)}</strong> জন
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider font-english">
                <th className="py-3.5 px-4">Member ID</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-4">Occupation</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">NID</th>
                <th className="py-3.5 px-4">Nominee</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#075B46] font-english whitespace-nowrap">
                    {member.member_id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900 font-bengali">
                    {member.full_name}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 font-bengali text-xs">
                    {member.occupation || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-english text-xs text-gray-700">
                    {member.mobile_number || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-english text-xs text-gray-600">
                    {member.nid_number || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-bengali text-xs text-gray-600">
                    {member.nominee_name ? `${member.nominee_name} (${member.nominee_relationship || 'নমিনি'})` : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingMember(member)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="সম্পূর্ণ প্রোফাইল দেখুন"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                        title="সংশোধন করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingMember(member)}
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

      {/* VIEW MEMBER DETAILS MODAL */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#073D32] p-5 text-white flex items-center justify-between border-b border-[#075B46]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#075B46] rounded-lg text-[#D6B66C]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-bengali">
                    সদস্য বিবরণী (Official Member Form)
                  </h3>
                  <p className="text-xs text-[#D6B66C] font-english">
                    ID: {viewingMember.member_id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingMember(null)}
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm font-bengali">
              {/* Personal Information */}
              <div>
                <h4 className="text-xs font-bold text-[#075B46] uppercase tracking-wider mb-3 pb-1 border-b border-gray-200">
                  ব্যক্তিগত পরিচয় (Personal Information)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block">সদস্যের নাম:</span>
                    <strong className="text-gray-900 text-base">{viewingMember.full_name}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">সদস্য আইডি (Member ID):</span>
                    <strong className="text-[#075B46] font-english">{viewingMember.member_id}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">পিতা/স্বামীর নাম:</span>
                    <span className="text-gray-900">{viewingMember.father_or_husband_name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">মাতার নাম:</span>
                    <span className="text-gray-900">{viewingMember.mother_name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">জন্ম তারিখ:</span>
                    <span className="text-gray-900 font-english">{viewingMember.date_of_birth || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">পেশা:</span>
                    <span className="text-gray-900">{viewingMember.occupation || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Identification & Contact (Guarded) */}
              <div>
                <h4 className="text-xs font-bold text-[#075B46] uppercase tracking-wider mb-3 pb-1 border-b border-gray-200 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#D6B66C]" />
                  <span>সংরক্ষিত পরিচয় ও যোগাযোগ (Strictly Protected)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block">মোবাইল নম্বর:</span>
                    <span className="text-gray-900 font-english font-medium">{viewingMember.mobile_number || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">জাতীয় পরিচয়পত্র নম্বর (NID):</span>
                    <span className="text-gray-900 font-english font-medium">{viewingMember.nid_number || '—'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs text-gray-500 block">বর্তমান ঠিকানা:</span>
                    <span className="text-gray-900">{viewingMember.present_address || '—'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs text-gray-500 block">স্থায়ী ঠিকানা:</span>
                    <span className="text-gray-900">{viewingMember.permanent_address || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Nominee Details */}
              <div>
                <h4 className="text-xs font-bold text-[#075B46] uppercase tracking-wider mb-3 pb-1 border-b border-gray-200">
                  নমিনি সংক্রান্ত তথ্য (Nominee Details)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block">নমিনির নাম:</span>
                    <span className="text-gray-900 font-semibold">{viewingMember.nominee_name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">সম্পর্ক:</span>
                    <span className="text-gray-900">{viewingMember.nominee_relationship || '—'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs text-gray-500 block">নমিনির ঠিকানা:</span>
                    <span className="text-gray-900">{viewingMember.nominee_address || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setViewingMember(null)}
                className="px-5 py-2 text-xs font-semibold bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-bengali"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#073D32] p-5 text-white flex items-center justify-between border-b border-[#075B46]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#075B46] rounded-lg text-[#D6B66C]">
                  {editingMember ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-bengali">
                    {editingMember ? 'সদস্যের তথ্য সংশোধন করুন' : 'নতুন সমাজ সদস্য নিবন্ধন ফরম'}
                  </h3>
                  <p className="text-xs text-[#D6B66C] font-english">
                    আল-ফালাহ সমবায় সমিতি গঠনতন্ত্র ফরম অনুযায়ী
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="overflow-y-auto p-6 space-y-6 text-sm font-bengali">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Basic Fields */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#075B46] uppercase tracking-wider pb-1 border-b border-gray-200">
                  ১. প্রাথমিক পরিচিতি (Basic Details)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      সদস্য আইডি (Member ID) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.member_id}
                      onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                      placeholder="AFS-001"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-english text-sm focus:outline-none focus:border-[#075B46]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      সদস্যের পূর্ণ নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="উদা: আলহাজ্ব মো: রফিকুল ইসলাম"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      পিতা / স্বামীর নাম
                    </label>
                    <input
                      type="text"
                      value={formData.father_or_husband_name}
                      onChange={(e) => setFormData({ ...formData, father_or_husband_name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      মাতার নাম
                    </label>
                    <input
                      type="text"
                      value={formData.mother_name}
                      onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      জন্ম তারিখ (Date of Birth)
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46] font-english"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      পেশা (Occupation)
                    </label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      placeholder="উদা: ব্যবসায়ী / প্রকৌশলী / শিক্ষক"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                    />
                  </div>
                </div>
              </div>

              {/* Private Identification & Contact */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#075B46] uppercase tracking-wider pb-1 border-b border-gray-200">
                  ২. যোগাযোগ ও গোপনীয় পরিচিতি (Protected Information)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      মোবাইল নম্বর
                    </label>
                    <input
                      type="text"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                      placeholder="+880 17XX-XXXXXX"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-english text-sm focus:outline-none focus:border-[#075B46]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      জাতীয় পরিচয়পত্র নম্বর (NID Number)
                    </label>
                    <input
                      type="text"
                      value={formData.nid_number}
                      onChange={(e) => setFormData({ ...formData, nid_number: e.target.value })}
                      placeholder="NID নম্বর"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-english text-sm focus:outline-none focus:border-[#075B46]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      বর্তমান ঠিকানা (Present Address)
                    </label>
                    <input
                      type="text"
                      value={formData.present_address}
                      onChange={(e) => setFormData({ ...formData, present_address: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      স্থায়ী ঠিকানা (Permanent Address)
                    </label>
                    <input
                      type="text"
                      value={formData.permanent_address}
                      onChange={(e) => setFormData({ ...formData, permanent_address: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                    />
                  </div>
                </div>
              </div>

              {/* Nominee Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#075B46] uppercase tracking-wider pb-1 border-b border-gray-200">
                  ৩. মনোনীত উত্তরাধিকারী / নমিনি (Nominee Details)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      নমিনির পূর্ণ নাম
                    </label>
                    <input
                      type="text"
                      value={formData.nominee_name}
                      onChange={(e) => setFormData({ ...formData, nominee_name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      সম্পর্ক (Relationship)
                    </label>
                    <input
                      type="text"
                      value={formData.nominee_relationship}
                      onChange={(e) => setFormData({ ...formData, nominee_relationship: e.target.value })}
                      placeholder="উদা: স্ত্রী / পুত্র / কন্যা / মাতা"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      নমিনির ঠিকানা
                    </label>
                    <input
                      type="text"
                      value={formData.nominee_address}
                      onChange={(e) => setFormData({ ...formData, nominee_address: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
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
                  {editingMember ? 'পরিবর্তন সংরক্ষণ করুন' : 'সদস্য সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 font-bengali">
                সদস্য মুছে ফেলার নিশ্চিতকরণ
              </h3>
              <p className="text-xs text-gray-500 font-bengali mt-1 leading-relaxed">
                আপনি কি নিশ্চিতভাবে <strong className="text-rose-600">{deletingMember.full_name}</strong> ({deletingMember.member_id}) কে মুছে ফেলতে চান? সংশ্লিষ্ট সকল সঞ্চয় রেকর্ড ডাটাবেজ থেকে মুছে যাবে।
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMember(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg font-bengali"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm font-bengali"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
