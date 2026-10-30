import { AdminUser } from '../types';
import { dbService } from './db';

const AUTH_STORAGE_KEY = 'afs_admin_session_v1';
const ADMIN_CREDENTIALS_KEY = 'afs_admin_credentials_v1';

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

const DEFAULT_ADMIN = {
  id: 'usr-admin-1',
  email: 'admin@alfalah.org',
  password: 'alfalah2026', // Default secure pass, can be changed via admin
  full_name: 'প্রধান সমন্বয়কারী (Head Administrator)',
  role: 'super_admin' as const,
};

class AuthService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private getCredentials() {
    if (!this.isBrowser()) return DEFAULT_ADMIN;
    const stored = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!stored) {
      localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(DEFAULT_ADMIN));
      return DEFAULT_ADMIN;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_ADMIN;
    }
  }

  /**
   * Log in administrator
   */
  async login(email: string, pass: string): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
    const creds = this.getCredentials();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === creds.email.toLowerCase() && pass === creds.password) {
      const user: AdminUser = {
        id: creds.id,
        email: creds.email,
        full_name: creds.full_name,
        role: creds.role,
        created_at: new Date().toISOString(),
      };

      const session: AdminSession = {
        user,
        token: `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };

      if (this.isBrowser()) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      }

      // Record audit log
      // @ts-ignore
      dbService['recordAuditLog']?.(
        user.email,
        'LOGIN',
        'auth',
        user.id,
        `অ্যাডমিন সফলভাবে সিস্টেমে লগইন করেছেন: ${user.email}`
      );

      return { success: true, session };
    }

    return { success: false, error: 'ভুল ইমেইল অথবা পাসওয়ার্ড। পুনরায় চেষ্টা করুন।' };
  }

  /**
   * Check if current session is active and valid
   */
  getCurrentSession(): AdminSession | null {
    if (!this.isBrowser()) return null;
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    try {
      const session: AdminSession = JSON.parse(stored);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  /**
   * Logout
   */
  logout(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  /**
   * Change admin password
   */
  changePassword(currentPass: string, newPass: string): { success: boolean; error?: string } {
    const creds = this.getCredentials();
    if (currentPass !== creds.password) {
      return { success: false, error: 'বর্তমান পাসওয়ার্ড সঠিক নয়।' };
    }
    if (newPass.length < 6) {
      return { success: false, error: 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।' };
    }

    const updated = { ...creds, password: newPass };
    if (this.isBrowser()) {
      localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(updated));
    }
    return { success: true };
  }
}

export const authService = new AuthService();
