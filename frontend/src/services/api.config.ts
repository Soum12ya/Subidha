/**
 * Central API Configuration for future Python Django REST Framework + PostgreSQL integration.
 * No production secrets are stored here.
 */
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  USE_MOCK_SERVICES: true,
  DEMO_OTP_CODE: '123456',
  ENDPOINTS: {
    AUTH_LOOKUP_PHONE: '/auth/phone-lookup/',
    AUTH_REGISTER_CUSTOMER: '/auth/register/customer/',
    AUTH_REGISTER_BUSINESS: '/auth/register/business/',
    AUTH_VERIFY_OTP: '/auth/verify-otp/',
    AUTH_SESSION_ME: '/auth/me/',
    AUTH_LOGOUT: '/auth/logout/',
    CUSTOMER_BOOKINGS: '/customer/bookings/',
    BUSINESS_TASKS: '/business/tasks/',
    BUSINESS_AGENTS: '/business/fleet/agents/',
  },
} as const;