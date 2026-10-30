import React, { useState } from 'react';
import { CheckCircle2, XCircle, Filter, Calendar } from 'lucide-react';
import { Payment } from '../../../types';
import { formatBDT, getMonthName, toBengaliNumber, formatDate } from '../../../utils/bengali';

interface MonthlyPaymentTableProps {
  payments: Payment[];
  availableYears: number[];
  memberName: string;
  memberId: string;
}

export const MonthlyPaymentTable: React.FC<MonthlyPaymentTableProps> = ({
  payments,
  availableYears,
  memberName,
  memberId,
}) => {
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');

  const filteredPayments = payments.filter((p) => {
    if (selectedYear === 'ALL') return true;
    return p.payment_year === selectedYear;
  });

  const totalPaidInView = filteredPayments.reduce((acc, curr) => {
    const amt = Number(curr.amount) || 0;
    return amt > 0 ? acc + amt : acc;
  }, 0);

  const paidMonthsCount = filteredPayments.filter((p) => Number(p.amount) > 0).length;
  const unpaidMonthsCount = filteredPayments.filter((p) => Number(p.amount) <= 0).length;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] shadow-sm overflow-hidden">
      {/* Top Header & Year Filter Controls */}
      <div className="p-4 sm:p-6 border-b border-[#E2E8E0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#F8FAF7]">
        <div>
          <h4 className="text-lg font-bold text-[#073D32] font-bengali flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#075B46]" />
            <span>মাসিক সঞ্চয় ও জমার ইতিহাস (Monthly Payment History)</span>
          </h4>
          <p className="text-xs text-[#202923]/70 font-bengali mt-0.5">
            সদস্য: <strong>{memberName}</strong> ({memberId})
          </p>
        </div>

        {/* Year Filter Buttons (Interactive Filter Control - Segmented) */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E2E8E0] rounded-xl self-start sm:self-auto">
          <span className="text-xs text-[#202923]/60 px-2 flex items-center gap-1 font-english">
            <Filter className="w-3 h-3" />
            <span>Year:</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedYear('ALL')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedYear === 'ALL'
                ? 'bg-[#075B46] text-white shadow-sm'
                : 'text-[#202923] hover:bg-gray-100'
            }`}
          >
            সকল বছর
          </button>
          {availableYears.map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedYear === yr
                  ? 'bg-[#075B46] text-white shadow-sm'
                  : 'text-[#202923] hover:bg-gray-100'
              }`}
            >
              {toBengaliNumber(yr)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stat Bar for this view */}
      <div className="grid grid-cols-3 divide-x divide-gray-200 bg-[#F8FAF7]/50 border-b border-[#E2E8E0] text-center p-3 text-xs sm:text-sm font-bengali">
        <div>
          <span className="text-[#202923]/60 block text-[11px]">মোট পরিশোধিত (Total Paid)</span>
          <span className="font-bold text-[#075B46] font-num text-sm sm:text-base">
            {formatBDT(totalPaidInView)}
          </span>
        </div>
        <div>
          <span className="text-[#202923]/60 block text-[11px]">পরিশোধিত কিস্তি (Paid)</span>
          <span className="font-bold text-emerald-700 font-num">
            {toBengaliNumber(paidMonthsCount)} মাস
          </span>
        </div>
        <div>
          <span className="text-[#202923]/60 block text-[11px]">বকেয়া কিস্তি (Unpaid)</span>
          <span className="font-bold text-rose-600 font-num">
            {toBengaliNumber(unpaidMonthsCount)} মাস
          </span>
        </div>
      </div>

      {/* Financial Table View */}
      {filteredPayments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAF7] border-b border-[#E2E8E0] text-[12px] font-bold text-[#073D32] uppercase tracking-wider font-english">
                <th className="py-3.5 px-4 sm:px-6">Month (মাস)</th>
                <th className="py-3.5 px-4 sm:px-6">Year (বছর)</th>
                <th className="py-3.5 px-4 sm:px-6">Deposit Amount (জমার পরিমাণ)</th>
                <th className="py-3.5 px-4 sm:px-6">Deposit Date (তারিখ)</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Status (অবস্থা)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredPayments.map((p) => {
                const isPaid = Number(p.amount) > 0;
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors hover:bg-gray-50/80 ${
                      !isPaid ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-[#202923] font-bengali">
                      {getMonthName(p.payment_month, true)}
                      <span className="text-xs text-gray-400 font-english ml-1.5">
                        ({getMonthName(p.payment_month, false)})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#202923] font-num">
                      {toBengaliNumber(p.payment_year)}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span
                        className={`font-bold font-num ${
                          isPaid ? 'text-[#075B46]' : 'text-rose-600'
                        }`}
                      >
                        {formatBDT(p.amount)}
                      </span>
                      {p.note && (
                        <span className="block text-[11px] text-gray-500 font-bengali truncate max-w-xs">
                          {p.note}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-600 font-bengali">
                      {isPaid ? formatDate(p.payment_date, true) : '—'}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Paid (পরিশোধিত)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Unpaid (বকেয়া)</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-[#202923]/60 font-bengali">
          নির্বাচিত বছরের জন্য কোনো সঞ্চয় কিস্তি তথ্য পাওয়া যায়নি।
        </div>
      )}
    </div>
  );
};
