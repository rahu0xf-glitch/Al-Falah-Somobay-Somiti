import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { ContactContent } from '../../types';

interface ContactSectionProps {
  contact: ContactContent;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contact }) => {
  const [formState, setFormState] = useState({
    name: '',
    memberId: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone || !formState.message) {
      alert('অনুগ্রহ করে নাম, ফোন নম্বর এবং বার্তার বিবরণ প্রদান করুন।');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setFormState({ name: '', memberId: '', phone: '', message: '' });
      setSubmitted(false);
    }, 5000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#F8FAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#075B46] uppercase tracking-wider mb-3">
            <Mail className="w-4 h-4 text-[#D6B66C]" />
            <span>অফিসিয়াল যোগাযোগ · Contact & Secretariat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#073D32] tracking-tight font-bengali">
            {contact.heading || 'যোগাযোগ ও দাপ্তরিক ঠিকানা'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#202923]/80 font-bengali">
            {contact.content || 'সমিতির হিসাব সংক্রান্ত তথ্য যাচাই বা লিখিত যোগাযোগের জন্য আমাদের দপ্তরে সরাসরি আগমন অথবা নিম্নোক্ত মাধ্যমে যোগাযোগ করার জন্য অনুরোধ করা হলো।'}
          </p>
          <div className="w-20 h-1 bg-[#D6B66C] mx-auto mt-4 rounded-full" />
        </div>

        {/* 2-Column Grid: Contact Information & Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Official Contact Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#075B46]/10 text-[#075B46] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#073D32] font-bengali uppercase tracking-wide">
                  দাপ্তরিক কার্যালয় (Head Office)
                </h4>
                <p className="text-sm text-[#202923]/85 font-bengali mt-1 leading-relaxed">
                  {contact.address}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#075B46]/10 text-[#075B46] shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#073D32] font-bengali uppercase tracking-wide">
                  টেলিফোন ও হটলাইন (Hotline)
                </h4>
                <p className="text-sm text-[#202923]/85 font-english font-medium mt-1">
                  {contact.phone}
                </p>
                <span className="text-xs text-[#202923]/60 font-bengali block mt-0.5">
                  সদস্য সেবা ও হিসাব সংক্রান্ত যোগাযোগ
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#075B46]/10 text-[#075B46] shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#073D32] font-bengali uppercase tracking-wide">
                  ইমেইল যোগাযোগ (Official Email)
                </h4>
                <p className="text-sm text-[#075B46] font-english font-semibold mt-1 hover:underline">
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#075B46]/10 text-[#075B46] shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#073D32] font-bengali uppercase tracking-wide">
                  দাপ্তরিক সময়সূচি (Office Hours)
                </h4>
                <p className="text-sm text-[#202923]/85 font-bengali mt-1">
                  {contact.office_hours}
                </p>
              </div>
            </div>

            {/* Google Map Visual Embed */}
            <div className="rounded-2xl overflow-hidden border border-[#E2E8E0] shadow-sm h-48 bg-gray-200 relative">
              <iframe
                title="Al Falah Somobay Somiti Office Location"
                src="https://maps.google.com/maps?q=Sector+9+Uttara+Dhaka+Bangladesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Column: Member Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-[#E2E8E0] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-[#073D32] text-[#D6B66C]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#073D32] font-bengali">
                  সদস্য তথ্যানুসন্ধান ও আনুষ্ঠানিক বার্তা
                </h3>
                <p className="text-xs text-[#202923]/60 font-bengali">
                  সমিতির কার্যনির্বাহী কমিটির নিকট বার্তা প্রেরণের ফরম
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-800 font-bengali">
                  আপনার বার্তা সফলভাবে গৃহীত হয়েছে
                </h4>
                <p className="text-xs sm:text-sm text-emerald-700 font-bengali">
                  সমিতির দায়িত্বপ্রাপ্ত সমন্বয়কারী অতিসত্বর আপনার সাথে যোগাযোগ করবেন। জাযাকুমুল্লাহু খাইরান।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-bengali">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#073D32] mb-1">
                      আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="উদা: আলহাজ্ব রফিকুল ইসলাম"
                      className="w-full px-4 py-2.5 text-sm bg-[#F8FAF7] border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#075B46]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073D32] mb-1">
                      সদস্য আইডি (যদি থাকে)
                    </label>
                    <input
                      type="text"
                      value={formState.memberId}
                      onChange={(e) => setFormState({ ...formState, memberId: e.target.value })}
                      placeholder="AFS-001"
                      className="w-full px-4 py-2.5 text-sm bg-[#F8FAF7] border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#075B46] font-english"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#073D32] mb-1">
                    মোবাইল নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="+880 17XX-XXXXXX"
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAF7] border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#075B46] font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#073D32] mb-1">
                    বার্তার বিষয়বস্তু বা প্রশ্ন <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="আপনার জিজ্ঞাসা বা নোটিশের বিবরণ লিখুন..."
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAF7] border border-[#E2E8E0] rounded-xl focus:outline-none focus:border-[#075B46]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#075B46] text-white font-semibold text-sm hover:bg-[#097358] transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>বার্তা প্রেরণ করুন</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
