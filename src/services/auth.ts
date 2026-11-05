import { AdminUser } from '../types';
import { dbService } from './db';

const AUTH_STORAGE_KEY = 'afs_admin_session_v2';
const ADMIN_USERS_KEY = 'afs_admin_users_v2';

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

export interface AdminCredentialUser extends AdminUser {
  password: string;
}

const INITIAL_ADMINS: AdminCredentialUser[] = [
  {
    id: 'usr-rago',
    username: '@rago',
    email: 'rahu0xf@gmail.com',
    password: 'rago@123',
    full_name: 'Rahu (Super Admin)',
    role: 'super_admin',
    created_at: '2026-01-01T00:00:00Z',
  },
];

class AuthService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Get all admin user credentials from localStorage
   */
  getAdminUsers(): AdminCredentialUser[] {
    if (!this.isBrowser()) return INITIAL_ADMINS;
    const stored = localStorage.getItem(ADMIN_USERS_KEY);
    if (!stored) {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(INITIAL_ADMINS));
      return INITIAL_ADMINS;
    }
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(INITIAL_ADMINS));
      return INITIAL_ADMINS;
    } catch {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(INITIAL_ADMINS));
      return INITIAL_ADMINS;
    }
  }

  private saveAdminUsers(users: AdminCredentialUser[]) {
    if (!this.isBrowser()) return;
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  }

  /**
   * Log in administrator using either email OR username
   */
  async login(identifier: string, pass: string): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
    const users = this.getAdminUsers();
    const cleanId = identifier.trim().toLowerCase();
    const cleanIdWithoutAt = cleanId.startsWith('@') ? cleanId.slice(1) : cleanId;

    const matched = users.find((u) => {
      const uEmail = u.email.trim().toLowerCase();
      const uUsername = u.username.trim().toLowerCase();
      const uUsernameWithoutAt = uUsername.startsWith('@') ? uUsername.slice(1) : uUsername;
      return (
        (uEmail === cleanId || uUsername === cleanId || uUsernameWithoutAt === cleanIdWithoutAt) &&
        u.password === pass
      );
    });

    if (matched) {
      const user: AdminUser = {
        id: matched.id,
        username: matched.username,
        email: matched.email,
        full_name: matched.full_name,
        role: matched.role,
        created_at: matched.created_at,
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
        `${user.username} (${user.email})`,
        'LOGIN',
        'auth',
        user.id,
        `অ্যাডমিন সফলভাবে সিস্টেমে লগইন করেছেন: ${user.full_name} [${user.username}]`
      );

      return { success: true, session };
    }

    return { success: false, error: 'ভুল ইমেইল/ইউজারনেম অথবা পাসওয়ার্ড। পুনরায় চেষ্টা করুন।' };
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
   * WordPress-Style Admin Users Management: Create a new admin user
   */
  createAdminUser(
    data: {
      username: string;
      email: string;
      password: string;
      full_name: string;
      role: 'super_admin' | 'admin' | 'auditor';
    },
    creatorIdentifier: string
  ): { success: boolean; error?: string; user?: AdminUser } {
    const users = this.getAdminUsers();
    let username = data.username.trim();
    if (!username.startsWith('@')) {
      username = `@${username}`;
    }
    const email = data.email.trim().toLowerCase();

    // Check duplicate username or email
    const duplicate = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email
    );
    if (duplicate) {
      return { success: false, error: 'এই ইউজারনেম অথবা ইমেইল ইতিমধ্যে অন্য অ্যাডমিনের জন্য ব্যবহৃত।' };
    }

    if (data.password.length < 5) {
      return { success: false, error: 'পাসওয়ার্ড ন্যূনতম ৫ অক্ষরের হতে হবে।' };
    }

    const newUser: AdminCredentialUser = {
      id: `usr-${Date.now()}`,
      username,
      email,
      password: data.password,
      full_name: data.full_name.trim(),
      role: data.role,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveAdminUsers(users);

    // Audit log
    // @ts-ignore
    dbService['recordAuditLog']?.(
      creatorIdentifier,
      'CREATE',
      'auth',
      newUser.id,
      `নতুন অ্যাডমিন ইউজার তৈরি করা হয়েছে: ${newUser.full_name} (${newUser.username}) - রোল: ${newUser.role}`
    );

    return {
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        created_at: newUser.created_at,
      },
    };
  }

  /**
   * Update an existing admin user
   */
  updateAdminUser(
    id: string,
    data: {
      full_name?: string;
      password?: string;
      role?: 'super_admin' | 'admin' | 'auditor';
    },
    updaterIdentifier: string
  ): { success: boolean; error?: string } {
    const users = this.getAdminUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return { success: false, error: 'অ্যাডমিন ইউজার খুঁজে পাওয়া যায়নি।' };
    }

    const prev = users[idx];
    const updated: AdminCredentialUser = {
      ...prev,
      full_name: data.full_name ? data.full_name.trim() : prev.full_name,
      role: data.role || prev.role,
      password: data.password && data.password.trim().length >= 5 ? data.password.trim() : prev.password,
    };

    users[idx] = updated;
    this.saveAdminUsers(users);

    // Audit log
    // @ts-ignore
    dbService['recordAuditLog']?.(
      updaterIdentifier,
      'UPDATE',
      'auth',
      updated.id,
      `অ্যাডমিন ইউজারের তথ্য পরিবর্তন করা হয়েছে: ${updated.full_name} (${updated.username})`
    );

    return { success: true };
  }

  /**
   * Delete an admin user (Cannot delete last super admin)
   */
  deleteAdminUser(id: string, deleterIdentifier: string): { success: boolean; error?: string } {
    const users = this.getAdminUsers();
    const target = users.find((u) => u.id === id);
    if (!target) {
      return { success: false, error: 'অ্যাডমিন ইউজার খুঁজে পাওয়া যায়নি।' };
    }

    const superAdmins = users.filter((u) => u.role === 'super_admin');
    if (target.role === 'super_admin' && superAdmins.length <= 1) {
      return { success: false, error: 'সিস্টেমে অন্তত একজন সুপার অ্যাডমিন থাকতে হবে। এটি মুছে ফেলা সম্ভব নয়।' };
    }

    const filtered = users.filter((u) => u.id !== id);
    this.saveAdminUsers(filtered);

    // Audit log
    // @ts-ignore
    dbService['recordAuditLog']?.(
      deleterIdentifier,
      'DELETE',
      'auth',
      target.id,
      `অ্যাডমিন ইউজার মুছে ফেলা হয়েছে: ${target.full_name} (${target.username})`
    );

    return { success: true };
  }
}

export const authService = new AuthService();
