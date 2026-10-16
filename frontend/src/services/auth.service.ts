import {
  AppUser,
  BusinessProfile,
  CustomerProfile,
  OtpVerifyResponse,
  PhoneLookupResponse,
  UserRole,
} from '@/types';
import { INITIAL_BUSINESSES, INITIAL_CUSTOMERS } from '@/mocks/users';
import { API_CONFIG } from './api.config';

// In-memory store for local demo runtime (safe across Jest & Web sessions)
let customersStore: CustomerProfile[] = [...INITIAL_CUSTOMERS];
let businessesStore: BusinessProfile[] = [...INITIAL_BUSINESSES];
let currentSessionUser: AppUser | null = null;

export interface PendingAuthAttempt {
  phone: string;
  role: UserRole;
  isNewRegistration?: boolean;
}

let pendingAuthAttempt: PendingAuthAttempt | null = null;

export function normalizeIndianPhone(raw: string): string {
  return raw.replace(/\D/g, '').slice(-10);
}

export function isValidIndianPhone(raw: string): boolean {
  const cleaned = normalizeIndianPhone(raw);
  return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Future Django REST endpoint: POST /api/v1/auth/phone-lookup/
 * Checks if a mobile number is registered for the selected role (customer vs business).
 * CRITICAL RULE: Never auto-creates an account and never cross-authenticates roles unless registered for that role.
 */
export async function loginWithPhone(
  phoneInput: string,
  role: UserRole
): Promise<PhoneLookupResponse> {
  const phone = normalizeIndianPhone(phoneInput);

  if (!isValidIndianPhone(phone)) {
    return {
      exists: false,
      role,
      phone,
      message: 'Please enter a valid 10-digit Indian mobile number.',
    };
  }

  const matchedUser =
    role === 'customer'
      ? customersStore.find((c) => c.phone === phone)
      : businessesStore.find((b) => b.phone === phone);

  if (!matchedUser) {
    return {
      exists: false,
      role,
      phone,
      message: 'This mobile number is not registered.',
    };
  }

  pendingAuthAttempt = { phone, role, isNewRegistration: false };

  return {
    exists: true,
    role,
    phone,
    maskedPhone: `+91 ••••••${phone.slice(-4)}`,
    message: 'Demo OTP ready for verification.',
  };
}

export interface RegisterCustomerInput {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  preferredLanguage: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  consentAccepted: boolean;
}

/**
 * Future Django REST endpoint: POST /api/v1/auth/register/customer/
 */
export async function registerCustomer(
  input: RegisterCustomerInput
): Promise<{ user: CustomerProfile; otpRequired: boolean }> {
  const phone = normalizeIndianPhone(input.phone);
  const existing = customersStore.find((c) => c.phone === phone);

  const newCustomer: CustomerProfile = existing ?? {
    id: `cust-${Date.now()}`,
    role: 'customer',
    fullName: input.fullName.trim(),
    phone,
    email: input.email?.trim() || undefined,
    city: input.city.trim(),
    preferredLanguage: input.preferredLanguage.trim(),
    emergencyContactName: input.emergencyContactName?.trim() || undefined,
    emergencyContactPhone: input.emergencyContactPhone?.trim() || undefined,
    subscriptionPlanId: 'plan-individual-care',
    subscriptionValidUntil: '2026-12-31',
    createdAt: new Date().toISOString().slice(0, 10),
  };

  if (!existing) {
    customersStore = [newCustomer, ...customersStore];
  }

  pendingAuthAttempt = { phone, role: 'customer', isNewRegistration: true };
  return { user: newCustomer, otpRequired: true };
}

export interface RegisterBusinessInput {
  businessName: string;
  contactPersonName: string;
  phone: string;
  businessEmail: string;
  businessCategory: string;
  city: string;
  businessAddress: string;
  operationalSize: string;
  consentAccepted: boolean;
}

/**
 * Future Django REST endpoint: POST /api/v1/auth/register/business/
 */
export async function registerBusiness(
  input: RegisterBusinessInput
): Promise<{ user: BusinessProfile; otpRequired: boolean }> {
  const phone = normalizeIndianPhone(input.phone);
  const existing = businessesStore.find((b) => b.phone === phone);

  const newBusiness: BusinessProfile = existing ?? {
    id: `biz-${Date.now()}`,
    role: 'business',
    businessName: input.businessName.trim(),
    contactPersonName: input.contactPersonName.trim(),
    phone,
    businessEmail: input.businessEmail.trim(),
    businessCategory: input.businessCategory.trim(),
    city: input.city.trim(),
    businessAddress: input.businessAddress.trim(),
    operationalSize: input.operationalSize.trim(),
    subscriptionPlanId: 'plan-business-growth',
    billingFrequency: 'Monthly',
    includedCapacity: 250,
    usedCapacity: 12,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  if (!existing) {
    businessesStore = [newBusiness, ...businessesStore];
  }

  pendingAuthAttempt = { phone, role: 'business', isNewRegistration: true };
  return { user: newBusiness, otpRequired: true };
}

/**
 * Future Django REST endpoint: POST /api/v1/auth/verify-otp/
 */
export async function verifyDemoOtp(
  otpCode: string,
  overridePhone?: string,
  overrideRole?: UserRole
): Promise<OtpVerifyResponse> {
  const targetPhone = normalizeIndianPhone(
    overridePhone || pendingAuthAttempt?.phone || ''
  );
  const targetRole = overrideRole || pendingAuthAttempt?.role;

  if (!targetPhone || !targetRole) {
    return {
      success: false,
      error: 'No active login session found. Please enter your mobile number again.',
    };
  }

  if (otpCode.trim() !== API_CONFIG.DEMO_OTP_CODE) {
    return {
      success: false,
      error: `Invalid demo OTP. Please enter ${API_CONFIG.DEMO_OTP_CODE} for local verification.`,
    };
  }

  const user =
    targetRole === 'customer'
      ? customersStore.find((c) => c.phone === targetPhone)
      : businessesStore.find((b) => b.phone === targetPhone);

  if (!user) {
    return {
      success: false,
      error: 'This mobile number is not registered for the selected account type.',
    };
  }

  currentSessionUser = user;
  pendingAuthAttempt = null;
  return { success: true, user };
}

export function getPendingAuthAttempt(): PendingAuthAttempt | null {
  return pendingAuthAttempt;
}

export function setPendingAuthAttempt(attempt: PendingAuthAttempt | null): void {
  pendingAuthAttempt = attempt;
}

export function getCurrentUser(): AppUser | null {
  return currentSessionUser;
}

export async function logout(): Promise<void> {
  currentSessionUser = null;
  pendingAuthAttempt = null;
}

export function resetDemoAuthStores(): void {
  customersStore = [...INITIAL_CUSTOMERS];
  businessesStore = [...INITIAL_BUSINESSES];
  currentSessionUser = null;
  pendingAuthAttempt = null;
}