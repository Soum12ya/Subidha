
/**
 * SUBIDHA route registry
 *
 * Central source of truth for application URLs.
 * Import ROUTES wherever navigation links or redirects are needed.
 */

export const ROUTES = {
  home: '/',
  about: '/about',
  plans: '/plan',
  services: '/services',

  auth: {
    index: '/auth',

    login: {
      index: '/auth/login',
      customer: '/auth/login/customer',
      business: '/auth/login/business',
    },

    signup: {
      index: '/auth/signup',
      customer: '/auth/signup/customer',
      business: '/auth/signup/business',
    },

    verifyOtp: '/auth/verify-otp',
  },

  customer: {
    index: '/customer',
    dashboard: '/customer/dashboard',
    services: '/customer/services',
    bookings: '/customer/bookings',
    profile: '/customer/profile',
  },

  business: {
    index: '/business',
    dashboard: '/business/dashboard',
    tasks: '/business/tasks',
    fleet: '/business/fleet',
    profile: '/business/profile',
    subscription: '/business/subscription',
  },
} as const;
