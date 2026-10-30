import React, { useState } from 'react';
import { Database, Copy, Check, X, Shield, Server, RefreshCw, Key, Code } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../../services/supabaseSchema';
import { dbService } from '../../services/db';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string;
  onDataReset: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  adminEmail,
  onDataReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleReset = async () => {
    await dbService.resetToDefaults(adminEmail);
    setResetConfirm(false);
    onDataReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#073D32] p-5 text-white flex items-center justify-between border-b border-[#075B46]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#075B46] rounded-lg text-[#D6B66C]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-bengali">
                ডাটাবেজ আর্কিটেকচার ও Supabase PostgreSQL ইন্টিগ্রেশন
              </h3>
              <p className="text-xs text-[#D6B66C] font-english">
                Supabase Schema, RLS Security Policies & Storage Diagnostics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm font-bengali">
          {/* Active Engine Diagnostics */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <Server className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-900 text-sm">
                সক্রিয় ডাটাবেজ স্টোরেজ ইঞ্জিন (Active Storage Engine)
              </h4>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                বর্তমানে সিস্টেমটি শতভাগ পারসিস্টেন্ট লোকাল ডাটাবেজ এবং স্বয়ংক্রিয় তহবিল গণনার সাথে রিয়েল-টাইমে পরিচালিত হচ্ছে। সকল সদস্য, পেমেন্ট, গঠনতন্ত্র ও অডিট রেকর্ড ব্রাউজার রিফ্রেশের পরও অবিকৃত থাকে।
              </p>
            </div>
          </div>

          {/* Supabase Connection Setup Instructions */}
          <div className="bg-[#F8FAF7] border border-gray-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#075B46] font-bold text-sm">
              <Key className="w-4 h-4 text-[#D6B66C]" />
              <span>লাইভ Supabase ক্লাউড প্রজেক্ট কানেক্ট করার নিয়মাবলী:</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              আপনি যদি নিজস্ব ক্লাউড Supabase প্রজেক্টে এই ডাটাবেজ স্থানান্তর করতে চান, তবে আপনার প্রোজেক্টের <code>.env</code> ফাইলে নিম্নোক্ত ভেরিয়েবলসমূহ যুক্ত করুন:
            </p>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs font-mono select-all">
              VITE_SUPABASE_URL="https://your-project.supabase.co"<br />
              VITE_SUPABASE_ANON_KEY="your-anon-public-key"
            </div>
          </div>

          {/* PostgreSQL DDL Script with 1-click Copy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5 font-english">
                <Code className="w-4 h-4 text-[#075B46]" />
                <span>Supabase SQL Schema Script (Tables, Indexes, RLS Policies)</span>
              </span>
              <button
                type="button"
                onClick={handleCopySQL}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#075B46] hover:bg-[#097358] text-white text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে!' : 'সম্পূর্ণ SQL কপি করুন'}</span>
              </button>
            </div>
            <pre className="p-4 bg-gray-900 text-gray-200 rounded-xl text-xs font-mono overflow-x-auto max-h-56 leading-relaxed">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>

          {/* Reset Database to Fresh Default Seed */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h5 className="font-bold text-rose-800 text-xs">
                ডাটাবেজ রিসেট (Reset to Default Sample Seed)
              </h5>
              <p className="text-[11px] text-gray-500">
                সকল টেবিলকে প্রারম্ভিক ১০ জন সদস্য ও পূর্বনির্ধারিত কিস্তির অবস্থায় ফিরিয়ে আনুন।
              </p>
            </div>

            {resetConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setResetConfirm(false)}
                  className="px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                >
                  হ্যাঁ, রিসেট করুন
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setResetConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Default Seed পুনর্বহাল করুন</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
