export interface Member {
  id: string;
  member_id: string; // e.g. "AFS-001"
  full_name: string;
  father_or_husband_name: string;
  mother_name: string;
  date_of_birth: string;
  occupation: string;
  permanent_address: string;
  present_address: string;
  mobile_number: string;
  nid_number: string;
  nominee_name: string;
  nominee_relationship: string;
  nominee_address: string;
  created_at: string;
  updated_at: string;
}

// Sanitized member information for public display - STRICT PRIVACY
export interface PublicMember {
  id: string;
  member_id: string;
  full_name: string;
  occupation?: string;
  joined_year?: string;
  total_deposited: number;
  paid_months_count: number;
  unpaid_months_count: number;
  last_deposit_date?: string;
}

export interface Payment {
  id: string;
  member_id: string; // references member.member_id or member.id
  payment_month: number; // 1 = January, 12 = December
  payment_year: number; // e.g. 2025, 2026
  amount: number; // in Taka ৳
  payment_date: string; // ISO date YYYY-MM-DD
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface Policy {
  id: string;
  title: string;
  content: string;
  display_order: number;
  updated_at: string;
}

export interface ContactContent {
  id: string;
  heading: string;
  content: string;
  address: string;
  phone: string;
  email: string;
  office_hours: string;
  social_links?: {
    facebook?: string;
    whatsapp?: string;
    youtube?: string;
  };
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'auditor';
  full_name: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  admin_email: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'RECALCULATE';
  affected_table: 'members' | 'payments' | 'policies' | 'contact_content' | 'auth';
  affected_record_id?: string;
  summary: string;
  previous_data?: any;
  new_data?: any;
  created_at: string;
}

export interface SocietyStats {
  totalMembers: number;
  totalFund: number;
  totalDepositsCount: number;
  totalPaidMonths: number;
  lastUpdated: string;
}
