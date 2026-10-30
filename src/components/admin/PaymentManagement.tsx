import React, { useState } from 'react';
import { 
  CreditCard, Plus, Edit2, Trash2, Search, Filter, CheckCircle2, 
  XCircle, AlertCircle, Check, DollarSign, Calendar, RefreshCw 
} from 'lucide-react';
import { Member, Payment } from '../../types';
import { dbService } from '../../services/db';
import { formatBDT, getMonthName, toBengaliNumber, formatDate, MONTH_NAMES_BN } from '../../utils/bengali';

interface PaymentManagementProps {
  payments: Payment[];
  members: Member[];
  adminEmail: string;
  onRefresh: () => void;
}

export const PaymentManagement: React.FC<PaymentManagementProps> = ({
  payments,
  members,
  adminEmail,
  onRefresh,
}) => {
  const currentYear = new Date().getFullYear();
  const [filterYear, setFilterYear] = useState<number>(currentYear);
  const [filterMember, setFilterMember] = useState<string>('ALL');
  const [filterMonth, setFilterMonth] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Active form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form inputs
  const [formMemberId, setFormMemberId] = useState<string>(members[0]?.member_id || '');
  const [formMonth, setFormMonth] = useState<number>(new Date().getMonth() + 1);
  const [formYear, setFormYear] = useState<number>(currentYear);
  const [formAmount, setFormAmount] = useState<string>('1000');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formNote, setFormNote] = useState<string>('');

  // Open modal for new payment
  const handleOpenAdd = () => {
    setEditingPaymentId(null);
    setFormMemberId(members[0]?.member_id || '');
    setFormMonth(new Date().getMonth() + 1);
    setFormYear(currentYear);
    setFormAmount('1000');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNote('নিয়মিত মাসিক সঞ্চয় কিস্তি');
    setError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing payment
  const handleOpenEdit = (p: Payment) => {
    setEditingPaymentId(p.id);
    setFormMemberId(p.member_id);
    setFormMonth(p.payment_month);
    setFormYear(p.payment_year);
    setFormAmount(p.amount.toString());
    setFormDate(p.payment_date || new Date().toISOString().split('T')[0]);
    setFormNote(p.note || '');
    setError(null);
    setIsModalOpen(true);
  };

  // Submit payment form (handles insert OR update, enforces unique constraint, recalculates fund)
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amountNum = parseFloat(formAmount);
    if (isNaN(amountNum) || amountNum < 0) {
      setError('সঠিক জমার পরিমাণ (টাকা) প্রদান করুন।');
      return;
    }

    try {
      const res = await dbService.savePayment(
        {
          member_id: formMemberId,
          payment_month: Number(formMonth),
          payment_year: Number(formYear),
          amount: amountNum,
          payment_date: formDate,
          note: formNote.trim(),
        },
        adminEmail
      );

      if (!res.success) {
        setError(res.error || 'পেমেন্ট সংরক্ষণ ব্যর্থ হয়েছে।');
        return;
      }

      setSuccess(
        res.isUpdate
          ? `পেমেন্ট সফলভাবে সংশোধন করা হয়েছে এবং মোট তহবিল স্বয়ংক্রিয়ভাবে পুনর্গণনা করা হয়েছে।`
          : `নতুন মাসিক সঞ্চয় সফলভাবে যুক্ত করা হয়েছে এবং তহবিল হালনাগাদ হয়েছে।`
      );

      setIsModalOpen(false);
      onRefresh();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'ডাটাবেজ অপারেশন ব্যর্থ হয়েছে।');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingPayment) return;
    try {
      const res = await dbService.deletePayment(deletingPayment.id, adminEmail);
      if (res.success) {
        setSuccess('পেমেন্ট রেকর্ড মুছে ফেলা হয়েছে এবং মোট তহবিল পুনর্গণনা করা হয়েছে।');
        setDeletingPayment(null);
        onRefresh();
        setTimeout(() => setSuccess(null), 4000);
      } else {
        setError(res.error || 'পেমেন্ট মুছে ফেলা সম্ভব হয়নি।');
      }
    } catch (err: any) {
      setError(err?.message || 'অপারেশন ব্যর্থ হয়েছে।');
    }
  };

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    if (filterYear !== p.payment_year) return false;
    if (filterMember !== 'ALL' && p.member_id !== filterMember) return false;
    if (filterMonth !== 'ALL' && p.payment_month !== Number(filterMonth)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const member = members.find((m) => m.member_id === p.member_id);
      const name = member?.full_name?.toLowerCase() || '';
      return p.member_id.toLowerCase().includes(q) || name.includes(q) || (p.note && p.note.toLowerCase().includes(q));
    }
    return true;
  });

  // Calculate year totals
  const totalPaidInFilter = filteredPayments.reduce((acc, curr) => acc + (Number(curr.amount) > 0 ? Number(curr.amount) : 0), 0);
  const paidCount = filteredPayments.filter((p) => Number(p.amount) > 0).length;
  const unpaidCount = filteredPayments.filter((p) => Number(p.amount) <= 0).length;

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#073D32] font-bengali flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#075B46]" />
            <span>মাসিক কিস্তি ও সঞ্চয় ব্যবস্থাপনা (Monthly Payment Management)</span>
          </h2>
          <p className="text-xs text-gray-500 font-bengali mt-0.5">
            সদস্যের মাসিক সঞ্চয় জমা, সংশোধন এবং স্বয়ংক্রিয় তহবিল গণনার প্রধান মডিউল
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075B46] hover:bg-[#097358] text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm self-start sm:self-auto font-bengali"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কিস্তি জমা করুন</span>
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

      {/* Metric Summary Card for current filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="bg-[#F8FAF7] p-3 rounded-lg border border-gray-200">
          <span className="text-[11px] text-gray-500 font-bengali block">নির্বাচিত ফিল্টারে মোট জমা</span>
          <span className="text-xl font-bold text-[#075B46] font-num">
            {formatBDT(totalPaidInFilter)}
          </span>
        </div>
        <div className="bg-[#F8FAF7] p-3 rounded-lg border border-gray-200">
          <span className="text-[11px] text-gray-500 font-bengali block">পরিশোধিত কিস্তি (Paid)</span>
          <span className="text-xl font-bold text-emerald-700 font-num">
            {toBengaliNumber(paidCount)} টি
          </span>
        </div>
        <div className="bg-[#F8FAF7] p-3 rounded-lg border border-gray-200">
          <span className="text-[11px] text-gray-500 font-bengali block">বকেয়া কিস্তি (Unpaid / ৳0)</span>
          <span className="text-xl font-bold text-rose-600 font-num">
            {toBengaliNumber(unpaidCount)} টি
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
        {/* Year Selector */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1 font-bengali">বছর নির্বাচন:</label>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-english focus:outline-none focus:border-[#075B46]"
          >
            {[2026, 2025, 2024].map((yr) => (
              <option key={yr} value={yr}>
                {yr} ({toBengaliNumber(yr)})
              </option>
            ))}
          </select>
        </div>

        {/* Member Selector */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1 font-bengali">সদস্য ফিল্টার:</label>
          <select
            value={filterMember}
            onChange={(e) => setFilterMember(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bengali focus:outline-none focus:border-[#075B46]"
          >
            <option value="ALL">সকল সদস্য ({toBengaliNumber(members.length)} জন)</option>
            {members.map((m) => (
              <option key={m.id} value={m.member_id}>
                {m.member_id} - {m.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Month Selector */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1 font-bengali">মাস ফিল্টার:</label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bengali focus:outline-none focus:border-[#075B46]"
          >
            <option value="ALL">সকল মাস (১-১২)</option>
            {MONTH_NAMES_BN.map((name, idx) => (
              <option key={idx} value={idx + 1}>
                {name} ({idx + 1})
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1 font-bengali">সার্চ নোট / আইডি:</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="আইডি বা নোট..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#075B46]"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider font-english">
                <th className="py-3 px-4">Member ID</th>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Month / Year</th>
                <th className="py-3 px-4">Amount (টাকা)</th>
                <th className="py-3 px-4">Deposit Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Note</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => {
                  const member = members.find((m) => m.member_id === p.member_id);
                  const isPaid = Number(p.amount) > 0;
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-gray-50/80 transition-colors ${
                        !isPaid ? 'bg-rose-50/25' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-[#075B46] font-english whitespace-nowrap">
                        {p.member_id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 font-bengali">
                        {member?.full_name || '—'}
                      </td>
                      <td className="py-3 px-4 font-bengali text-xs">
                        <span className="font-semibold text-gray-800">
                          {getMonthName(p.payment_month, true)}
                        </span>{' '}
                        <span className="font-num text-gray-500">
                          ({toBengaliNumber(p.payment_year)})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold font-num ${
                            isPaid ? 'text-[#075B46]' : 'text-rose-600'
                          }`}
                        >
                          {formatBDT(p.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-english text-xs text-gray-600">
                        {p.payment_date || '—'}
                      </td>
                      <td className="py-3 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Paid</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Unpaid</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500 font-bengali max-w-xs truncate">
                        {p.note || '—'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                            title="সংশোধন করুন (Edit Payment)"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingPayment(p)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-gray-500 font-bengali">
                    কোনো পেমেন্ট তথ্য পাওয়া যায়নি। নতুন কিস্তি জমা করতে 'নতুন কিস্তি জমা করুন' চাপুন।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PAYMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-[#073D32] p-5 text-white flex items-center justify-between border-b border-[#075B46]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#075B46] rounded-lg text-[#D6B66C]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-bengali">
                    {editingPaymentId ? 'পেমেন্ট সংশোধন ফরম' : 'সদস্যের মাসিক সঞ্চয় জমা'}
                  </h3>
                  <p className="text-xs text-[#D6B66C] font-english">
                    {editingPaymentId ? 'Update Existing Deposit Record' : 'Record Monthly Member Deposit'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4 font-bengali text-sm">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Select Member */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  সদস্য নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formMemberId}
                  onChange={(e) => setFormMemberId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bengali focus:outline-none focus:border-[#075B46]"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.member_id}>
                      {m.member_id} — {m.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month and Year Split */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    মাস (Month) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formMonth}
                    onChange={(e) => setFormMonth(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bengali focus:outline-none focus:border-[#075B46]"
                  >
                    {MONTH_NAMES_BN.map((name, idx) => (
                      <option key={idx} value={idx + 1}>
                        {name} ({idx + 1})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    বছর (Year) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-english focus:outline-none focus:border-[#075B46]"
                  >
                    {[2026, 2025, 2024, 2023].map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Deposit Amount */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  জমার পরিমাণ (Deposit Amount in ৳) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-base font-bold font-num focus:outline-none focus:border-[#075B46]"
                  />
                </div>
                <span className="text-[11px] text-gray-500 mt-1 block">
                  নিয়মিত মাসিক কিস্তির পরিমাণ ৳ ১,০০০ (বকেয়া চিহ্নিত করতে ০ দিতে পারেন)।
                </span>
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  জমার তারিখ (Payment Date) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-english text-sm focus:outline-none focus:border-[#075B46]"
                />
              </div>

              {/* Optional Note */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  মন্তব্য / রসিদ নম্বর (Optional Note)
                </label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="উদা: ক্যাশ জমা / ব্যাংক ট্রান্সফার রসিদ #৭৮২"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
                />
              </div>

              {/* Rules Callout */}
              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-800">
                <strong>স্বয়ংক্রিয় তহবিল হিসাব:</strong> সংরক্ষণ করামাত্র সমিতির মূল Total Fund স্বয়ংক্রিয়ভাবে নতুন করে গণনাকৃত হবে। একই সদস্য ও একই মাসের রেকর্ড থাকলে স্বয়ংক্রিয়ভাবে পূর্বের রেকর্ড প্রতিস্থাপিত হবে (ডুপ্লিকেট প্রতিরোধ)।
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#075B46] hover:bg-[#097358] rounded-lg shadow-sm"
                >
                  {editingPaymentId ? 'কিস্তি সংশোধন করুন' : 'কিস্তি সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 font-bengali">
                পেমেন্ট রেকর্ড মুছে ফেলার নিশ্চিতকরণ
              </h3>
              <p className="text-xs text-gray-500 font-bengali mt-1 leading-relaxed">
                আপনি কি নিশ্চিতভাবে সদস্য <strong>{deletingPayment.member_id}</strong> এর {getMonthName(deletingPayment.payment_month, true)}/{deletingPayment.payment_year} এর <strong className="text-rose-600">{formatBDT(deletingPayment.amount)}</strong> টাকা জমা রেকর্ড মুছে ফেলতে চান? সমিতির মোট তহবিল থেকে এই পরিমাণ টাকা স্বয়ংক্রিয়ভাবে কমে যাবে।
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPayment(null)}
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
