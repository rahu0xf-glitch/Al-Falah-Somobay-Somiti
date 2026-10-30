import { Member, PublicMember, Payment, Policy, ContactContent, AuditLog, SocietyStats } from '../types';

const STORAGE_KEYS = {
  MEMBERS: 'afs_db_members_v1',
  PAYMENTS: 'afs_db_payments_v1',
  POLICIES: 'afs_db_policies_v1',
  CONTACT: 'afs_db_contact_v1',
  AUDIT_LOGS: 'afs_db_audit_logs_v1',
  LAST_RECALC: 'afs_db_last_recalc_v1',
};

// Initial realistic members data
const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm-001',
    member_id: 'AFS-001',
    full_name: 'আলহাজ্ব মো: রফিকুল ইসলাম',
    father_or_husband_name: 'মরহুম আব্দুল গণি মিয়া',
    mother_name: 'রোকেয়া বেগম',
    date_of_birth: '1976-03-15',
    occupation: 'ব্যবসায়ী (আমদানি ও রপ্তানি)',
    permanent_address: 'গ্রাম: চরপাড়া, পো: সোনারগাঁও, জেলা: নারায়ণগঞ্জ',
    present_address: 'হাউজ # ১২/এ, রোড # ০৩, সেক্টর # ০৯, উত্তরা, ঢাকা-১২৩০',
    mobile_number: '+880 1711-234567',
    nid_number: '19766715890000123',
    nominee_name: 'সামিয়া ইসলাম (স্ত্রী)',
    nominee_relationship: 'স্ত্রী',
    nominee_address: 'হাউজ # ১২/এ, রোড # ০৩, সেক্টর # ০৯, উত্তরা, ঢাকা',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'm-002',
    member_id: 'AFS-002',
    full_name: 'ইঞ্জিনিয়ার মো: এনামুল হক',
    father_or_husband_name: 'আজিজুর রহমান',
    mother_name: 'ফাতেমা খাতুন',
    date_of_birth: '1982-08-22',
    occupation: 'সিভিল ইঞ্জিনিয়ার',
    permanent_address: 'থানা রোড, শেরপুর সদর, শেরপুর',
    present_address: 'ফ্ল্যাট ৪বি, গ্রিন টাওয়ার, নিকুঞ্জ-২, খিলক্ষেত, ঢাকা',
    mobile_number: '+880 1819-345678',
    nid_number: '19828912340000567',
    nominee_name: 'নুসরাত জাহান (স্ত্রী)',
    nominee_relationship: 'স্ত্রী',
    nominee_address: 'নিকুঞ্জ-২, খিলক্ষেত, ঢাকা',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'm-003',
    member_id: 'AFS-003',
    full_name: 'ড. মোহাম্মদ আব্দুল মালেক',
    father_or_husband_name: 'মৌলভী বশির উদ্দিন',
    mother_name: 'জাহানারা বেগম',
    date_of_birth: '1970-11-10',
    occupation: 'বিশ্ববিদ্যালয় অধ্যাপক',
    permanent_address: 'উত্তর কাজিরদেউড়ী, কোতোয়ালী, চট্টগ্রাম',
    present_address: 'বাড়ি # ২১, রোড # ০৭, সেক্টর # ০৪, উত্তরা, ঢাকা',
    mobile_number: '+880 1912-456789',
    nid_number: '19701543210000890',
    nominee_name: 'মাহমুদুল মালেক (পুত্র)',
    nominee_relationship: 'পুত্র',
    nominee_address: 'বাড়ি # ২১, উত্তরা, ঢাকা',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'm-004',
    member_id: 'AFS-004',
    full_name: 'মো: কামরুল হাসান',
    father_or_husband_name: 'শামসুল হক সরকার',
    mother_name: 'মমতাজ বেগম',
    date_of_birth: '1985-05-18',
    occupation: 'ব্যাংক কর্মকর্তা',
    permanent_address: 'গ্রাম: রাধানগর, পো: পাবনা সদর, পাবনা',
    present_address: 'রোড # ১১, সেক্টর # ০৬, উত্তরা, ঢাকা',
    mobile_number: '+880 1675-567890',
    nid_number: '19857654320000345',
    nominee_name: 'শরীফা হাসান (স্ত্রী)',
    nominee_relationship: 'স্ত্রী',
    nominee_address: 'রোড # ১১, সেক্টর # ০৬, উত্তরা, ঢাকা',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'm-005',
    member_id: 'AFS-005',
    full_name: 'মাওলানা মো: মিজানুর রহমান',
    father_or_husband_name: 'হাফেজ ক্বারী নূর মোহাম্মদ',
    mother_name: 'আয়েশা সিদ্দিকা',
    date_of_birth: '1978-01-25',
    occupation: 'ইসলামিক স্কলার ও শিক্ষক',
    permanent_address: 'চরভাংগা, রায়পুর, লক্ষ্মীপুর',
    present_address: 'মাদ্রাসা কমপ্লেক্স কোয়ার্টার, তুরাগ, ঢাকা',
    mobile_number: '+880 1715-678901',
    nid_number: '19785123450000678',
    nominee_name: 'আমেনা খাতুন (স্ত্রী)',
    nominee_relationship: 'স্ত্রী',
    nominee_address: 'তুরাগ, ঢাকা',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'm-006',
    member_id: 'AFS-006',
    full_name: 'মো: ফজলুর রহমান চৌধুরী',
    father_or_husband_name: 'মুকবুল হোসেন চৌধুরী',
    mother_name: 'সখিনা বানু',
    date_of_birth: '1980-09-14',
    occupation: 'ফার্মাসিউটিক্যাল কনসালট্যান্ট',
    permanent_address: 'মিরের ময়দান, কোতোয়ালী, সিলেট',
    present_address: 'হাউজ # ৪৪, লেইক ড্রাইভ, সেক্টর # ০৭, উত্তরা, ঢাকা',
    mobile_number: '+880 1841-789012',
    nid_number: '19809182730000456',
    nominee_name: 'তাহমিনা চৌধুরী (স্ত্রী)',
    nominee_relationship: 'স্ত্রী',
    nominee_address: 'উত্তরা সেক্টর ৭, ঢাকা',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'm-007',
    member_id: 'AFS-007',
    full_name: 'মো: শাহজাহান আলী মৃধা',
    father_or_husband_name: 'আকবর আলী মৃধা',
    mother_name: 'লতিফুন্নেসা',
    date_of_birth: '1983-04-05',
    occupation: 'আইটি উদ্যোক্তা ও সফটওয়্যার আর্কিটেক্ট',
    permanent_address: 'আমলাপাড়া, সদর, সিরাজগঞ্জ',
    present_address: 'অ্যাপার্টমেন্ট ৭সি, স্কাই ভিউ, বসুন্ধরা আ/এ, ঢাকা',
    mobile_number: '+880 1718-890123',
    nid_number: '19836789120000789',
    nominee_name: 'সাদিয়া মৃধা (স্ত্রী)',
    nominee_relationship: 'স্ত্রী',
    nominee_address: 'বসুন্ধরা আ/এ, ঢাকা',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'm-008',
    member_id: 'AFS-008',
    full_name: 'কাজী মো: নুরুল ইসলাম',
    father_or_husband_name: 'কাজী মতিউর রহমান',
    mother_name: 'শামসুন্নাহার কাজী',
    date_of_birth: '1974-12-30',
    occupation: 'আইনজীবী (সুপ্রিম কোর্ট)',
    permanent_address: 'আদালত পাড়া, কুমিল্লা সদর, কুমিল্লা',
    present_address: 'রোড # ১৮, সেক্টর # ০৩, উত্তরা, ঢাকা',
    mobile_number: '+880 1911-901234',
    nid_number: '19741928370000123',
    nominee_name: 'কাজী নাফিস ইসলাম (পুত্র)',
    nominee_relationship: 'পুত্র',
    nominee_address: 'সেক্টর ০৩, উত্তরা, ঢাকা',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'm-009',
    member_id: 'AFS-009',
    full_name: 'মো: তারিকুল ইসলাম',
    father_or_husband_name: 'ডা: মোহাম্মদ মোজাম্মেল হক',
    mother_name: 'বিলকিস আরা',
    date_of_birth: '1988-06-20',
    occupation: 'চার্টার্ড অ্যাকাউন্ট্যান্ট (CA)',
    permanent_address: 'কলেজ রোড, বগুড়া সদর, বগুড়া',
    present_address: 'রোড # ০২, সেক্টর # ১৩, উত্তরা, ঢাকা',
    mobile_number: '+880 1552-012345',
    nid_number: '19882837460000890',
    nominee_name: 'ডা: সুমাইয়া আক্তার (স্ত্রী)',
    nominee_relationship: 'স্ত্রী',
    nominee_address: 'সেক্টর ১৩, উত্তরা, ঢাকা',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'm-010',
    member_id: 'AFS-010',
    full_name: 'মো: জিয়াউর রহমান',
    father_or_husband_name: 'মরহুম লুৎফর রহমান',
    mother_name: 'আমিনা বেগম',
    date_of_birth: '1981-10-08',
    occupation: 'টেক্সটাইল মার্চেন্ডাইজার',
    permanent_address: 'বটতলা, টাঙ্গাইল সদর, টাঙ্গাইল',
    present_address: 'বাড়ি # ০৮, রোড # ০৫, সেক্টর # ১০, উত্তরা, ঢাকা',
    mobile_number: '+880 1713-123456',
    nid_number: '19818273640000543',
    nominee_name: 'ফারহানা রহমান (স্ত্রী)',
    nominee_relationship: 'স্ত্রী',
    nominee_address: 'সেক্টর ১০, উত্তরা, ঢাকা',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
];

// Generate realistic payments history (12 months in 2025, and months up to October 2026)
function generateInitialPayments(): Payment[] {
  const payments: Payment[] = [];
  const monthlyDeposit = 1000; // ৳1,000 monthly contribution

  INITIAL_MEMBERS.forEach((member, memberIdx) => {
    // 2025: All 12 months paid
    for (let m = 1; m <= 12; m++) {
      const monthStr = m < 10 ? `0${m}` : `${m}`;
      payments.push({
        id: `p-${member.member_id}-2025-${m}`,
        member_id: member.member_id,
        payment_month: m,
        payment_year: 2025,
        amount: monthlyDeposit,
        payment_date: `2025-${monthStr}-08`,
        note: `মাসিক নিয়মিত সঞ্চয় কিস্তি (${m}/2025)`,
        created_at: `2025-${monthStr}-08T10:00:00Z`,
        updated_at: `2025-${monthStr}-08T10:00:00Z`,
      });
    }

    // 2026: Months 1 to 10
    // Members 1 to 8 have paid up to month 10, member 9 missed month 9 & 10, member 10 missed month 10
    for (let m = 1; m <= 10; m++) {
      const monthStr = m < 10 ? `0${m}` : `${m}`;
      let isPaid = true;

      if (memberIdx === 8 && (m === 9 || m === 10)) {
        isPaid = false;
      } else if (memberIdx === 9 && m === 10) {
        isPaid = false;
      }

      payments.push({
        id: `p-${member.member_id}-2026-${m}`,
        member_id: member.member_id,
        payment_month: m,
        payment_year: 2026,
        amount: isPaid ? monthlyDeposit : 0,
        payment_date: isPaid ? `2026-${monthStr}-07` : `2026-${monthStr}-01`,
        note: isPaid ? `নিয়মিত সঞ্চয় জমা (${m}/2026)` : `বকেয়া (Unpaid)`,
        created_at: `2026-${monthStr}-07T11:00:00Z`,
        updated_at: `2026-${monthStr}-07T11:00:00Z`,
      });
    }
  });

  return payments;
}

const INITIAL_POLICIES: Policy[] = [
  {
    id: 'pol-1',
    title: '১. সমিতি গঠন, আদর্শ ও সদস্যপদ কাঠামো',
    content: `আল-ফালাহ সমবায় সমিতি একটি পারস্পরিক কল্যাণমুখী ও শরীয়াহ-সম্মত আর্থিক সঞ্চয়ী সংগঠন। 
এই সমিতি নির্দিষ্ট সংখ্যক সচেতন সদস্যদের পারস্পরিক আস্থা, ঐক্য ও অর্থনৈতিক নিরাপত্তার লক্ষ্যে পরিচালিত। 
সমিতি কোনো উন্মুক্ত বা সাধারণ জনসাধারণের নিকট থেকে সদস্য আবেদন গ্রহণ করে না। 
সকল সদস্যকে সমিতির নির্ধারিত গঠনতন্ত্র ও পারস্পরিক সম্মতির শর্তসমূহ অক্ষরে অক্ষরে পালন করতে হবে।`,
    display_order: 1,
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pol-2',
    title: '২. নিয়মিত মাসিক সঞ্চয় কিস্তি ও সময়সীমা',
    content: `ক) প্রত্যেক নিবন্ধিত সদস্যকে প্রতি ক্যালেন্ডার মাসের ১০ (দশ) তারিখের মধ্যে বাধ্যতামূলকভাবে নির্ধারিত মাসিক সঞ্চয় কিস্তি জমা প্রদান করতে হবে।
খ) মাসিক কিস্তির পরিমাণ সাধারণ পরিষদের সর্বসম্মত সিদ্ধান্তে নির্ধারিত ৳ ১,০০০ (এক হাজার টাকা)।
গ) জমাকৃত সকল অর্থ সরাসরি সমিতির ব্যাংক অ্যাকাউন্টে জমা হবে অথবা নির্ধারিত ক্যাশিয়ারের নিকট জমা দিয়ে অফিসিয়াল রসিদ/সিস্টেম ভেরিফিকেশন নিশ্চিত করতে হবে।`,
    display_order: 2,
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pol-3',
    title: '৩. বিলম্ব ফি ও অপরিশোধিত কিস্তি সংক্রান্ত নীতিমালা',
    content: `ক) কোনো সদস্য যথাসময়ে কিস্তি প্রদানে ব্যর্থ হলে সংশ্লিষ্ট মাসের পরবর্তী মাসের কিস্তির সাথে বকেয়া পরিশোধ করতে হবে।
খ) যৌক্তিক কারণ ব্যতিরেকে পরপর তিন (৩) মাস কিস্তি প্রদানে ব্যর্থ হলে কার্যনির্বাহী কমিটি সংশ্লিষ্ট সদস্যের কারণ দর্শানোর নোটিশ প্রদান করবে।
গ) সমিতির তহবিল সম্পূর্ণ সুদমুক্ত। কোনো ধরনের সুদভিত্তিক জরিমানা বা অতিরিক্ত চার্জ আরোপ করা হবে না; তবে প্রশাসনিক শৃঙ্খলার স্বার্থে বিলম্ব সংশোধনযোগ্য বিলম্ব-নোট হিসেবে লিপিবদ্ধ থাকবে।`,
    display_order: 3,
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pol-4',
    title: '৪. সঞ্চিত তহবিলের নিরাপত্তা ও হালাল বিনিয়োগ বিধি',
    content: `ক) সমিতির মোট তহবিল (Total Fund) সদস্যদের একক ও যৌথ আমানত হিসেবে সংরক্ষিত থাকবে।
খ) কোনো প্রকার ঝুঁকিপূর্ণ ফটকা বাজার, সুদভিত্তিক প্রতিষ্ঠান বা অনুৎপাদনশীল খাতে তহবিলের অর্থ বিনিয়োগ করা সম্পূর্ণ নিষিদ্ধ।
গ) সকল বিনিয়োগ প্রকল্প সাধারণ পরিষদের অনুমোদিত শরীয়াহ বোর্ড এবং কার্যনির্বাহী কমিটির প্রত্যক্ষ যৌথ স্বাক্ষরে পরিচালিত হবে।`,
    display_order: 4,
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pol-5',
    title: '৫. সদস্যপদ প্রত্যাহার, মৃত্যু ও চূড়ান্ত হিসাব নিষ্পত্তি',
    content: `ক) কোনো সদস্য স্বেচ্ছায় সদস্যপদ প্রত্যাহার করতে চাইলে কার্যনির্বাহী কমিটির নিকট অন্তত ৩ (তিন) মাস পূর্বে লিখিত আবেদন দাখিল করতে হবে।
খ) নিরীক্ষা সম্পন্ন হওয়ার পর প্রত্যাহারকারী সদস্যের প্রকৃত জমাকৃত মূল অর্থ কোনো প্রকার কর্তন ছাড়াই যথাযথ নিয়মে ফেরত প্রদান করা হবে।
গ) কোনো সদস্যের অনাকাঙ্ক্ষিত মৃত্যু ঘটলে তাঁর সংরক্ষিত নমিনি আবেদনের প্রেক্ষিতে যথাযথ আইনগত প্রক্রিয়া অনুসরণপূর্বক সমুদয় সঞ্চয় ও প্রাপ্য হস্তান্তর করা হবে।`,
    display_order: 5,
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pol-6',
    title: '৬. স্বচ্ছতা, বার্ষিক সাধারণ সভা (AGM) ও অডিট',
    content: `ক) প্রতি আর্থিক বছরের শেষে নিরপেক্ষ অভ্যন্তরীণ অডিট সম্পন্ন করে সাধারণ সভায় হিসাব দাখিল করা বাধ্যতামূলক।
খ) প্রত্যেক সদস্য সমিতির ডিজিটাল পোর্টালের মাধ্যমে যেকোনো সময় তাঁর ব্যক্তিগত মাসিক জমার ইতিহাস ও সমিতির মোট তহবিল সংক্রান্ত হিসাব যাচাই করতে পারবেন।`,
    display_order: 6,
    updated_at: '2026-01-01T00:00:00Z',
  },
];

const INITIAL_CONTACT: ContactContent = {
  id: 'contact-main',
  heading: 'যোগাযোগ ও দাপ্তরিক ঠিকানা',
  content: 'আল-ফালাহ সমবায় সমিতির যেকোনো তথ্যানুসন্ধান, হিসাব নিরীক্ষা বা আনুষ্ঠানিক যোগাযোগের জন্য আমাদের দপ্তরে সরাসরি আগমন অথবা নিম্নোক্ত মাধ্যমে যোগাযোগ করার জন্য অনুরোধ করা হলো।',
  address: 'আল-ফালাহ ভবন, হাউজ # ১২, রোড # ০৪, সেক্টর # ০৯, উত্তরা, ঢাকা-১২৩০, বাংলাদেশ',
  phone: '+880 1711-234567, +880 1819-345678',
  email: 'info@alfalahsomobay.org',
  office_hours: 'শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৫:০০ (শুক্রবার সাপ্তাহিক বন্ধ)',
  social_links: {
    facebook: 'https://facebook.com/alfalahsomobay',
    whatsapp: '+8801711234567',
  },
  updated_at: '2026-01-01T00:00:00Z',
};

class DatabaseService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Initialize data if not already existing
  private ensureInitialized(): void {
    if (!this.isBrowser()) return;

    if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(generateInitialPayments()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.POLICIES)) {
      localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(INITIAL_POLICIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTACT)) {
      localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(INITIAL_CONTACT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      const initialLog: AuditLog = {
        id: 'log-init',
        admin_id: 'sys-admin',
        admin_email: 'admin@alfalah.org',
        action: 'CREATE',
        affected_table: 'members',
        summary: 'সিস্টেমের ভিত্তি ডাটাবেজ ও প্রাথমিক সদস্য তালিকা সফলভাবে শুরু হয়েছে',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([initialLog]));
    }
  }

  // Read collection
  private getCollection<T>(key: string, defaultVal: T): T {
    this.ensureInitialized();
    if (!this.isBrowser()) return defaultVal;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.error(`Error reading ${key}`, e);
      return defaultVal;
    }
  }

  // Save collection
  private setCollection<T>(key: string, data: T): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Record Audit Log
  private recordAuditLog(
    adminEmail: string,
    action: AuditLog['action'],
    table: AuditLog['affected_table'],
    recordId: string | undefined,
    summary: string,
    prevData?: any,
    newData?: any
  ): void {
    const logs = this.getCollection<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      admin_id: adminEmail,
      admin_email: adminEmail,
      action,
      affected_table: table,
      affected_record_id: recordId,
      summary,
      previous_data: prevData,
      new_data: newData,
      created_at: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // Keep last 300 logs
    this.setCollection(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 300));
  }

  // ----------------------------------------------------------------------
  // PUBLIC QUERIES (Sanitized, Safe, Fast)
  // ----------------------------------------------------------------------

  /**
   * Calculate Total Fund dynamically from all valid payments (amount > 0)
   */
  async getSocietyStats(): Promise<SocietyStats> {
    const members = this.getCollection<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const payments = this.getCollection<Payment[]>(STORAGE_KEYS.PAYMENTS, []);

    // Sum of all valid deposits (amount > 0)
    let totalFund = 0;
    let totalDepositsCount = 0;
    let totalPaidMonths = 0;
    let latestPaymentDate = '';

    payments.forEach((p) => {
      const amt = Number(p.amount) || 0;
      if (amt > 0) {
        totalFund += amt;
        totalDepositsCount++;
        totalPaidMonths++;
        if (!latestPaymentDate || p.payment_date > latestPaymentDate) {
          latestPaymentDate = p.payment_date;
        }
      }
    });

    return {
      totalMembers: members.length,
      totalFund,
      totalDepositsCount,
      totalPaidMonths,
      lastUpdated: latestPaymentDate || new Date().toISOString().split('T')[0],
    };
  }

  /**
   * Get sanitized member list for public dropdown
   * Strictly omits NID, Mobile, DOB, Nominee info!
   */
  async getPublicMembers(): Promise<PublicMember[]> {
    const members = this.getCollection<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const payments = this.getCollection<Payment[]>(STORAGE_KEYS.PAYMENTS, []);

    return members.map((m) => {
      const memberPayments = payments.filter((p) => p.member_id === m.member_id || p.member_id === m.id);
      let total_deposited = 0;
      let paid_months_count = 0;
      let unpaid_months_count = 0;
      let last_deposit_date = '';

      memberPayments.forEach((p) => {
        const amt = Number(p.amount) || 0;
        if (amt > 0) {
          total_deposited += amt;
          paid_months_count++;
          if (!last_deposit_date || p.payment_date > last_deposit_date) {
            last_deposit_date = p.payment_date;
          }
        } else {
          unpaid_months_count++;
        }
      });

      return {
        id: m.id,
        member_id: m.member_id,
        full_name: m.full_name,
        occupation: m.occupation,
        total_deposited,
        paid_months_count,
        unpaid_months_count,
        last_deposit_date: last_deposit_date || undefined,
      };
    });
  }

  /**
   * Get complete financial breakdown for selected member (Public Safe)
   */
  async getMemberPublicFinancialDetails(memberIdentifier: string): Promise<{
    member: PublicMember;
    payments: Payment[];
    summary: {
      totalPaid: number;
      paidCount: number;
      unpaidCount: number;
      years: number[];
      recentDate?: string;
    };
  } | null> {
    const members = await this.getPublicMembers();
    const target = members.find(
      (m) => m.member_id.toLowerCase() === memberIdentifier.toLowerCase() || m.id === memberIdentifier
    );

    if (!target) return null;

    const allPayments = this.getCollection<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    const memberPayments = allPayments
      .filter((p) => p.member_id === target.member_id || p.member_id === target.id)
      .sort((a, b) => {
        if (b.payment_year !== a.payment_year) return b.payment_year - a.payment_year;
        return b.payment_month - a.payment_month;
      });

    const yearsSet = new Set<number>();
    let totalPaid = 0;
    let paidCount = 0;
    let unpaidCount = 0;
    let recentDate = '';

    memberPayments.forEach((p) => {
      yearsSet.add(p.payment_year);
      const amt = Number(p.amount) || 0;
      if (amt > 0) {
        totalPaid += amt;
        paidCount++;
        if (!recentDate || p.payment_date > recentDate) {
          recentDate = p.payment_date;
        }
      } else {
        unpaidCount++;
      }
    });

    const years = Array.from(yearsSet).sort((a, b) => b - a);

    return {
      member: target,
      payments: memberPayments,
      summary: {
        totalPaid,
        paidCount,
        unpaidCount,
        years,
        recentDate: recentDate || target.last_deposit_date,
      },
    };
  }

  /**
   * Get public policies list
   */
  async getPolicies(): Promise<Policy[]> {
    const policies = this.getCollection<Policy[]>(STORAGE_KEYS.POLICIES, INITIAL_POLICIES);
    return policies.sort((a, b) => a.display_order - b.display_order);
  }

  /**
   * Get public contact content
   */
  async getContactContent(): Promise<ContactContent> {
    return this.getCollection<ContactContent>(STORAGE_KEYS.CONTACT, INITIAL_CONTACT);
  }

  // ----------------------------------------------------------------------
  // SECURE ADMIN OPERATIONS
  // ----------------------------------------------------------------------

  /**
   * Admin: View all members including full sensitive fields
   */
  async getAllMembers(): Promise<Member[]> {
    const members = this.getCollection<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    return members.sort((a, b) => a.member_id.localeCompare(b.member_id));
  }

  /**
   * Admin: Get member by ID
   */
  async getMemberById(id: string): Promise<Member | null> {
    const members = await this.getAllMembers();
    return members.find((m) => m.id === id || m.member_id === id) || null;
  }

  /**
   * Admin: Create new member
   */
  async createMember(
    data: Omit<Member, 'id' | 'created_at' | 'updated_at'>,
    adminEmail: string
  ): Promise<{ success: boolean; member?: Member; error?: string }> {
    const members = this.getCollection<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);

    // Validate unique Member ID
    const trimmedId = data.member_id.trim();
    if (!trimmedId) {
      return { success: false, error: 'সদস্য আইডি (Member ID) আবশ্যক।' };
    }

    const existing = members.find((m) => m.member_id.toLowerCase() === trimmedId.toLowerCase());
    if (existing) {
      return { success: false, error: `সদস্য আইডি '${trimmedId}' ইতিমধ্যে বিদ্যমান। ভিন্ন আইডি প্রদান করুন।` };
    }

    if (!data.full_name?.trim()) {
      return { success: false, error: 'সদস্যের পূর্ণ নাম আবশ্যক।' };
    }

    const now = new Date().toISOString();
    const newMember: Member = {
      ...data,
      id: `m-${Date.now()}`,
      member_id: trimmedId.toUpperCase(),
      full_name: data.full_name.trim(),
      created_at: now,
      updated_at: now,
    };

    members.push(newMember);
    this.setCollection(STORAGE_KEYS.MEMBERS, members);

    this.recordAuditLog(
      adminEmail,
      'CREATE',
      'members',
      newMember.member_id,
      `নতুন সদস্য যোগ করা হয়েছে: ${newMember.full_name} (${newMember.member_id})`,
      null,
      newMember
    );

    return { success: true, member: newMember };
  }

  /**
   * Admin: Update member details
   */
  async updateMember(
    id: string,
    data: Partial<Member>,
    adminEmail: string
  ): Promise<{ success: boolean; member?: Member; error?: string }> {
    const members = this.getCollection<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const index = members.findIndex((m) => m.id === id || m.member_id === id);

    if (index === -1) {
      return { success: false, error: 'সদস্যের তথ্য খুঁজে পাওয়া যায়নি।' };
    }

    const prev = members[index];

    // If changing member_id, check uniqueness
    if (data.member_id && data.member_id.trim().toUpperCase() !== prev.member_id) {
      const duplicate = members.find(
        (m) => m.id !== prev.id && m.member_id.toLowerCase() === data.member_id!.trim().toLowerCase()
      );
      if (duplicate) {
        return { success: false, error: `সদস্য আইডি '${data.member_id}' অন্য সদস্যের জন্য ইতিমধ্যে ব্যবহৃত।` };
      }
    }

    const updated: Member = {
      ...prev,
      ...data,
      member_id: data.member_id ? data.member_id.trim().toUpperCase() : prev.member_id,
      updated_at: new Date().toISOString(),
    };

    members[index] = updated;
    this.setCollection(STORAGE_KEYS.MEMBERS, members);

    this.recordAuditLog(
      adminEmail,
      'UPDATE',
      'members',
      updated.member_id,
      `সদস্যের তথ্য সংশোধন করা হয়েছে: ${updated.full_name} (${updated.member_id})`,
      prev,
      updated
    );

    return { success: true, member: updated };
  }

  /**
   * Admin: Delete member with confirmation and cascade clean
   */
  async deleteMember(
    id: string,
    adminEmail: string
  ): Promise<{ success: boolean; error?: string }> {
    const members = this.getCollection<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const target = members.find((m) => m.id === id || m.member_id === id);

    if (!target) {
      return { success: false, error: 'সদস্য খুঁজে পাওয়া যায়নি।' };
    }

    const remainingMembers = members.filter((m) => m.id !== target.id);
    this.setCollection(STORAGE_KEYS.MEMBERS, remainingMembers);

    // Also remove associated payments or cascade
    const payments = this.getCollection<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    const remainingPayments = payments.filter(
      (p) => p.member_id !== target.member_id && p.member_id !== target.id
    );
    this.setCollection(STORAGE_KEYS.PAYMENTS, remainingPayments);

    this.recordAuditLog(
      adminEmail,
      'DELETE',
      'members',
      target.member_id,
      `সদস্য ও সংশ্লিষ্ট পেমেন্ট রেকর্ড মুছে ফেলা হয়েছে: ${target.full_name} (${target.member_id})`,
      target,
      null
    );

    return { success: true };
  }

  // ----------------------------------------------------------------------
  // PAYMENTS MANAGEMENT & AUTOMATIC FUND RECALCULATION
  // ----------------------------------------------------------------------

  /**
   * Get all payment records with flexible filtering
   */
  async getAllPayments(filters?: {
    member_id?: string;
    year?: number;
    month?: number;
  }): Promise<Payment[]> {
    let payments = this.getCollection<Payment[]>(STORAGE_KEYS.PAYMENTS, []);

    if (filters?.member_id) {
      payments = payments.filter((p) => p.member_id === filters.member_id);
    }
    if (filters?.year) {
      payments = payments.filter((p) => p.payment_year === Number(filters.year));
    }
    if (filters?.month) {
      payments = payments.filter((p) => p.payment_month === Number(filters.month));
    }

    return payments.sort((a, b) => {
      if (b.payment_year !== a.payment_year) return b.payment_year - a.payment_year;
      if (b.payment_month !== a.payment_month) return b.payment_month - a.payment_month;
      return a.member_id.localeCompare(b.member_id);
    });
  }

  /**
   * Save or Update a Payment Record
   * Enforces Unique Constraint: (member_id, payment_month, payment_year)
   * Updates original record if duplicate rather than creating new.
   * Recalculates Total Fund immediately!
   */
  async savePayment(
    data: {
      member_id: string;
      payment_month: number;
      payment_year: number;
      amount: number;
      payment_date: string;
      note?: string;
    },
    adminEmail: string
  ): Promise<{ success: boolean; payment?: Payment; isUpdate?: boolean; error?: string }> {
    const payments = this.getCollection<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    const memberId = data.member_id.trim().toUpperCase();
    const month = Number(data.payment_month);
    const year = Number(data.payment_year);
    const amount = Math.max(0, Number(data.amount) || 0);

    if (!memberId) {
      return { success: false, error: 'সদস্য আইডি নির্বাচন আবশ্যক।' };
    }
    if (month < 1 || month > 12) {
      return { success: false, error: 'মাস ১ থেকে ১২ এর মধ্যে হতে হবে।' };
    }
    if (year < 2000 || year > 2100) {
      return { success: false, error: 'সঠিক বছর নির্বাচন করুন।' };
    }

    // Check unique constraint: (member_id, payment_month, payment_year)
    const existingIndex = payments.findIndex(
      (p) => p.member_id === memberId && p.payment_month === month && p.payment_year === year
    );

    const now = new Date().toISOString();
    let savedPayment: Payment;
    let isUpdate = false;
    let prevData: Payment | null = null;

    if (existingIndex >= 0) {
      // Update existing record
      isUpdate = true;
      prevData = { ...payments[existingIndex] };
      savedPayment = {
        ...prevData,
        amount,
        payment_date: data.payment_date || prevData.payment_date,
        note: data.note !== undefined ? data.note : prevData.note,
        updated_at: now,
      };
      payments[existingIndex] = savedPayment;
    } else {
      // Create new record
      savedPayment = {
        id: `p-${memberId}-${year}-${month}`,
        member_id: memberId,
        payment_month: month,
        payment_year: year,
        amount,
        payment_date: data.payment_date || now.split('T')[0],
        note: data.note || '',
        created_at: now,
        updated_at: now,
      };
      payments.push(savedPayment);
    }

    this.setCollection(STORAGE_KEYS.PAYMENTS, payments);

    // Audit log
    const actionDesc = isUpdate
      ? `পেমেন্ট সংশোধন: ${memberId} এর ${month}/${year} কিস্তি পরিমাণ ৳ ${prevData?.amount} থেকে ৳ ${amount} করা হয়েছে`
      : `নতুন পেমেন্ট সংযোজন: ${memberId} এর ${month}/${year} কিস্তি পরিমাণ ৳ ${amount}`;

    this.recordAuditLog(
      adminEmail,
      isUpdate ? 'UPDATE' : 'CREATE',
      'payments',
      savedPayment.id,
      actionDesc,
      prevData,
      savedPayment
    );

    return { success: true, payment: savedPayment, isUpdate };
  }

  /**
   * Delete a Payment Record
   * Recalculates Total Fund immediately
   */
  async deletePayment(
    id: string,
    adminEmail: string
  ): Promise<{ success: boolean; error?: string }> {
    const payments = this.getCollection<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    const target = payments.find((p) => p.id === id);

    if (!target) {
      return { success: false, error: 'পেমেন্ট রেকর্ড খুঁজে পাওয়া যায়নি।' };
    }

    const remaining = payments.filter((p) => p.id !== id);
    this.setCollection(STORAGE_KEYS.PAYMENTS, remaining);

    this.recordAuditLog(
      adminEmail,
      'DELETE',
      'payments',
      target.id,
      `পেমেন্ট মুছে ফেলা হয়েছে: ${target.member_id} এর ${target.payment_month}/${target.payment_year} এর ৳ ${target.amount} টাকা`,
      target,
      null
    );

    return { success: true };
  }

  // ----------------------------------------------------------------------
  // POLICY MANAGEMENT
  // ----------------------------------------------------------------------

  async savePolicy(
    data: { id?: string; title: string; content: string; display_order?: number },
    adminEmail: string
  ): Promise<{ success: boolean; policy?: Policy; error?: string }> {
    const policies = this.getCollection<Policy[]>(STORAGE_KEYS.POLICIES, INITIAL_POLICIES);

    if (!data.title?.trim() || !data.content?.trim()) {
      return { success: false, error: 'নীতিমালার শিরোনাম ও বিষয়বস্তু আবশ্যক।' };
    }

    const now = new Date().toISOString();
    let saved: Policy;
    let isUpdate = false;

    if (data.id) {
      const idx = policies.findIndex((p) => p.id === data.id);
      if (idx === -1) return { success: false, error: 'নীতিমালা খুঁজে পাওয়া যায়নি।' };
      isUpdate = true;
      saved = {
        ...policies[idx],
        title: data.title.trim(),
        content: data.content.trim(),
        display_order: data.display_order ?? policies[idx].display_order,
        updated_at: now,
      };
      policies[idx] = saved;
    } else {
      saved = {
        id: `pol-${Date.now()}`,
        title: data.title.trim(),
        content: data.content.trim(),
        display_order: data.display_order ?? policies.length + 1,
        updated_at: now,
      };
      policies.push(saved);
    }

    this.setCollection(STORAGE_KEYS.POLICIES, policies);

    this.recordAuditLog(
      adminEmail,
      isUpdate ? 'UPDATE' : 'CREATE',
      'policies',
      saved.id,
      `নীতিমালা ${isUpdate ? 'সংশোধন' : 'সংযোজন'}: ${saved.title}`,
      null,
      saved
    );

    return { success: true, policy: saved };
  }

  async deletePolicy(id: string, adminEmail: string): Promise<{ success: boolean; error?: string }> {
    const policies = this.getCollection<Policy[]>(STORAGE_KEYS.POLICIES, INITIAL_POLICIES);
    const target = policies.find((p) => p.id === id);

    if (!target) return { success: false, error: 'নীতিমালা খুঁজে পাওয়া যায়নি।' };

    const remaining = policies.filter((p) => p.id !== id);
    this.setCollection(STORAGE_KEYS.POLICIES, remaining);

    this.recordAuditLog(
      adminEmail,
      'DELETE',
      'policies',
      target.id,
      `নীতিমালা মুছে ফেলা হয়েছে: ${target.title}`,
      target,
      null
    );

    return { success: true };
  }

  async reorderPolicies(orderedIds: string[], adminEmail: string): Promise<void> {
    const policies = this.getCollection<Policy[]>(STORAGE_KEYS.POLICIES, INITIAL_POLICIES);
    orderedIds.forEach((id, index) => {
      const p = policies.find((item) => item.id === id);
      if (p) {
        p.display_order = index + 1;
        p.updated_at = new Date().toISOString();
      }
    });
    this.setCollection(STORAGE_KEYS.POLICIES, policies);
    this.recordAuditLog(adminEmail, 'UPDATE', 'policies', undefined, 'নীতিমালার ক্রম পুনঃবিন্যাস করা হয়েছে');
  }

  // ----------------------------------------------------------------------
  // CONTACT MANAGEMENT
  // ----------------------------------------------------------------------

  async updateContactContent(
    data: Partial<ContactContent>,
    adminEmail: string
  ): Promise<{ success: boolean; contact?: ContactContent }> {
    const prev = this.getCollection<ContactContent>(STORAGE_KEYS.CONTACT, INITIAL_CONTACT);
    const updated: ContactContent = {
      ...prev,
      ...data,
      updated_at: new Date().toISOString(),
    };

    this.setCollection(STORAGE_KEYS.CONTACT, updated);

    this.recordAuditLog(
      adminEmail,
      'UPDATE',
      'contact_content',
      updated.id,
      'যোগাযোগ ও দাপ্তরিক তথ্যের সেকশন হালনাগাদ করা হয়েছে',
      prev,
      updated
    );

    return { success: true, contact: updated };
  }

  // ----------------------------------------------------------------------
  // AUDIT LOGS & DATA EXPORT / IMPORT
  // ----------------------------------------------------------------------

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.getCollection<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  }

  async resetToDefaults(adminEmail: string): Promise<void> {
    this.setCollection(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    this.setCollection(STORAGE_KEYS.PAYMENTS, generateInitialPayments());
    this.setCollection(STORAGE_KEYS.POLICIES, INITIAL_POLICIES);
    this.setCollection(STORAGE_KEYS.CONTACT, INITIAL_CONTACT);

    this.recordAuditLog(
      adminEmail,
      'RECALCULATE',
      'members',
      undefined,
      'সকল ডাটাবেজ টেবিল মূল প্রাথমিক অবস্থায় (Default Seed) পুনর্বহাল করা হয়েছে'
    );
  }

  exportDataAsJSON(): string {
    const dump = {
      exported_at: new Date().toISOString(),
      organization: 'Al Falah Somobay Somiti',
      members: this.getCollection(STORAGE_KEYS.MEMBERS, []),
      payments: this.getCollection(STORAGE_KEYS.PAYMENTS, []),
      policies: this.getCollection(STORAGE_KEYS.POLICIES, []),
      contact: this.getCollection(STORAGE_KEYS.CONTACT, {}),
      audit_logs: this.getCollection(STORAGE_KEYS.AUDIT_LOGS, []),
    };
    return JSON.stringify(dump, null, 2);
  }

  importDataFromJSON(jsonData: string, adminEmail: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.members) && Array.isArray(parsed.payments)) {
        this.setCollection(STORAGE_KEYS.MEMBERS, parsed.members);
        this.setCollection(STORAGE_KEYS.PAYMENTS, parsed.payments);
        if (Array.isArray(parsed.policies)) this.setCollection(STORAGE_KEYS.POLICIES, parsed.policies);
        if (parsed.contact) this.setCollection(STORAGE_KEYS.CONTACT, parsed.contact);
        
        this.recordAuditLog(adminEmail, 'UPDATE', 'members', undefined, 'JSON ব্যাকআপ থেকে সম্পূর্ণ ডাটাবেজ রিস্টোর করা হয়েছে');
        return { success: true };
      }
      return { success: false, error: 'অকার্যকর ব্যাকআপ ফাইল ফরম্যাট।' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'JSON পার্সিং ব্যর্থ হয়েছে।' };
    }
  }
}

export const dbService = new DatabaseService();
