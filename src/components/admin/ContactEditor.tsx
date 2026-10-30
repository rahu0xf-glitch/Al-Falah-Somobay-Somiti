import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Save, Check, AlertCircle } from 'lucide-react';
import { ContactContent } from '../../types';
import { dbService } from '../../services/db';

interface ContactEditorProps {
  contact: ContactContent;
  adminEmail: string;
  onRefresh: () => void;
}

export const ContactEditor: React.FC<ContactEditorProps> = ({
  contact,
  adminEmail,
  onRefresh,
}) => {
  const [formData, setFormData] = useState<ContactContent>(contact);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await dbService.updateContactContent(formData, adminEmail);
      if (res.success) {
        setSuccess('যোগাযোগ সংক্রান্ত সকল তথ্য সফলভাবে সংরক্ষিত এবং ওয়েবসাইটে হালনাগাদ হয়েছে।');
        onRefresh();
        setTimeout(() => setSuccess(null), 4000);
      } else {
        setError('তথ্য সংরক্ষণ ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setError(err?.message || 'অপারেশন ব্যর্থ হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-[#073D32] font-bengali flex items-center gap-2">
          <Mail className="w-6 h-6 text-[#075B46]" />
          <span>যোগাযোগ ও দাপ্তরিক তথ্য সম্পাদক (Contact Content Management)</span>
        </h2>
        <p className="text-xs text-gray-500 font-bengali mt-0.5">
          ওয়েবসাইটের Contact সেকশনের সম্পূর্ণ বিবরণী, ঠিকানা, ফোন ও সময়সূচি সম্পাদনা
        </p>
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

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6 font-bengali text-sm">
        {/* Section Heading & Description */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#075B46] uppercase tracking-wider pb-1 border-b border-gray-200">
            ১. শিরোনাম ও ভূমিকা বিবরণী (Heading & Intro Prose)
          </h3>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              সেকশন শিরোনাম (Contact Section Heading)
            </label>
            <input
              type="text"
              required
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              বিস্তারিত ভূমিকা বিবরণী (Full Description)
            </label>
            <textarea
              rows={3}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46] leading-relaxed"
            />
          </div>
        </div>

        {/* Physical Office Address */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#075B46] uppercase tracking-wider pb-1 border-b border-gray-200 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#075B46]" />
            <span>২. কার্যালয়ের পূর্ণ ঠিকানা (Official Address)</span>
          </h3>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              দাপ্তরিক ভবন ও পূর্ণ ঠিকানা
            </label>
            <textarea
              rows={2}
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
            />
          </div>
        </div>

        {/* Phone, Email, Office Hours */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#075B46] uppercase tracking-wider pb-1 border-b border-gray-200">
            ৩. যোগাযোগ মাধ্যম ও সময়সূচি (Channels & Hours)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                মোবাইল / হটলাইন নম্বরসমূহ
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46] font-english"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                অফিসিয়াল ইমেইল
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46] font-english"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                দাপ্তরিক কর্মঘণ্টা (Office Hours)
              </label>
              <input
                type="text"
                required
                value={formData.office_hours}
                onChange={(e) => setFormData({ ...formData, office_hours: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46]"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#075B46] uppercase tracking-wider pb-1 border-b border-gray-200">
            ৪. ডিজিটাল ও সোশ্যাল মিডিয়া লিংক (Social Media)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ফেসবুক পেজ লিংক
              </label>
              <input
                type="url"
                value={formData.social_links?.facebook || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social_links: { ...formData.social_links, facebook: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46] font-english"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                হোয়াটসঅ্যাপ নম্বর
              </label>
              <input
                type="text"
                value={formData.social_links?.whatsapp || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social_links: { ...formData.social_links, whatsapp: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#075B46] font-english"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-4 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#075B46] hover:bg-[#097358] text-white font-bold text-sm shadow-md transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'সংরক্ষণ করা হচ্ছে...' : 'হালনাগাদ তথ্য সংরক্ষণ করুন'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
