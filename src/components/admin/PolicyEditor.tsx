import React, { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Check, AlertCircle } from 'lucide-react';
import { Policy } from '../../types';
import { dbService } from '../../services/db';

interface PolicyEditorProps {
  policies: Policy[];
  adminEmail: string;
  onRefresh: () => void;
}

export const PolicyEditor: React.FC<PolicyEditorProps> = ({
  policies,
  adminEmail,
  onRefresh,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setOrder(policies.length + 1);
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (policy: Policy) => {
    setEditingId(policy.id);
    setTitle(policy.title);
    setContent(policy.content);
    setOrder(policy.display_order);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('শিরোনাম ও বিস্তারিত বিবরণ পূরণ করুন।');
      return;
    }

    try {
      const res = await dbService.savePolicy(
        {
          id: editingId || undefined,
          title: title.trim(),
          content: content.trim(),
          display_order: Number(order),
        },
        adminEmail
      );

      if (res.success) {
        setSuccess('নীতিমালা সফলভাবে সংরক্ষিত এবং ওয়েবসাইটে প্রকাশিত হয়েছে।');
        setIsModalOpen(false);
        onRefresh();
        setTimeout(() => setSuccess(null), 4000);
      } else {
        setError(res.error || 'নীতিমালা সংরক্ষণ ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setError(err?.message || 'অপারেশন ব্যর্থ হয়েছে।');
    }
  };

  const handleDelete = async (id: string, policyTitle: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে "${policyTitle}" বিধিটি মুছে ফেলতে চান?`)) {
      return;
    }
    try {
      const res = await dbService.deletePolicy(id, adminEmail);
      if (res.success) {
        setSuccess('বিধিমালা মুছে ফেলা হয়েছে।');
        onRefresh();
        setTimeout(() => setSuccess(null), 4000);
      }
    } catch (err: any) {
      setError(err?.message || 'মুছে ফেলা সম্ভব হয়নি।');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= policies.length) return;

    const list = [...policies];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const orderedIds = list.map((p) => p.id);
    await dbService.reorderPolicies(orderedIds, adminEmail);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#073D32] font-bengali flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#075B46]" />
            <span>গঠনতন্ত্র ও নীতিমালা সম্পাদক (Policy Management)</span>
          </h2>
          <p className="text-xs text-gray-500 font-bengali mt-0.5">
            সমিতির সকল অফিশিয়াল নিয়মাবলী সংযোজন, সংশোধন ও ক্রমবিন্যাস
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075B46] hover:bg-[#097358] text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm self-start sm:self-auto font-bengali"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বিধি / ধারা যোগ করুন</span>
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

      {/* Policies List */}
      <div className="space-y-4">
        {policies.map((p, idx) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-[#075B46]/60 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#075B46]/10 text-[#075B46] flex items-center justify-center font-bold text-sm shrink-0">
                  {p.display_order}
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-bengali">
                    {p.title}
                  </h3>
                  <div className="text-xs text-gray-600 font-bengali mt-2 whitespace-pre-line leading-relaxed max-w-4xl">
                    {p.content}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  title="উপরে নিন"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === policies.length - 1}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  title="নিচে নিন"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                  title="সম্পাদনা করুন"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-[#073D32] p-5 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold font-bengali">
                {editingId ? 'নীতিমালা ধারা সম্পাদনা' : 'নতুন বিধিমালা বা ধারা সংযোজন'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 font-bengali text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ধারার শিরোনাম (Clause Title) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="উদা: ৭. জরুরি কল্যাণ তহবিল সংক্রান্ত বিধিমালা"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ক্রম (Display Order)
                </label>
                <input
                  type="number"
                  min="1"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-32 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  বিস্তারিত নিয়মাবলী ও অনুচ্ছেদ (Full Text Content) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="ক) নিয়মের বিবরণ...&#10;খ) শর্তাবলী..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46] leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-[#075B46] hover:bg-[#097358] rounded-lg shadow-sm"
                >
                  সংরক্ষণ ও প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
