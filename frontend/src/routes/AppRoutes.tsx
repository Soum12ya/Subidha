
import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { ROUTES } from './index';

import RootLayout from '@/app/_layout';

// Public pages
import HomePage from '@/app/index';
import AboutPage from '@/app/about';
import PlansPage from '@/app/plan';
import PublicServicesPage from '@/app/services';

// Authentication pages
import LoginPage from '@/app/auth/login';
import CustomerLoginPage from '@/app/auth/login/customer';
import BusinessLoginPage from '@/app/auth/login/business';
import CustomerSignupPage from '@/app/auth/signup/customer';
import BusinessSignupPage from '@/app/auth/signup/business';
import VerifyOtpPage from '@/app/auth/verify-otp';

// Customer pages
import CustomerLayout from '@/app/customer/_layout';
import CustomerDashboard from '@/app/customer/dashboard';
import CustomerServices from '@/app/customer/services';
import CustomerBookings from '@/app/customer/bookings';
import CustomerProfile from '@/app/customer/profile';

// Business pages
import BusinessLayout from '@/app/business/_layout';
import BusinessDashboard from '@/app/business/dashboard';
import BusinessTasks from '@/app/business/tasks';
import BusinessFleet from '@/app/business/fleet';
import BusinessProfile from '@/app/business/profile';
import BusinessSubscription from '@/app/business/subscription';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          {/* Public website */}
          <Route
            path={ROUTES.home}
            element={<HomePage />}
          />
          <Route
            path={ROUTES.about}
            element={<AboutPage />}
          />
          <Route
            path={ROUTES.plans}
            element={<PlansPage />}
          />
          <Route
            path={ROUTES.services}
            element={<PublicServicesPage />}
          />

          {/* Authentication */}
          <Route
            path={ROUTES.auth.index}
            element={<Navigate to={ROUTES.auth.login.index} replace />}
          />
          <Route
            path={ROUTES.auth.login.index}
            element={<LoginPage />}
          />
          <Route
            path={ROUTES.auth.login.customer}
            element={<CustomerLoginPage />}
          />
          <Route
            path={ROUTES.auth.login.business}
            element={<BusinessLoginPage />}
          />
          <Route
            path={ROUTES.auth.signup.index}
            element={<Navigate to={ROUTES.auth.signup.customer} replace />}
          />
          <Route
            path={ROUTES.auth.signup.customer}
            element={<CustomerSignupPage />}
          />
          <Route
            path={ROUTES.auth.signup.business}
            element={<BusinessSignupPage />}
          />
          <Route
            path={ROUTES.auth.verifyOtp}
            element={<VerifyOtpPage />}
          />

          {/* Customer workspace */}
          <Route
            path={ROUTES.customer.index}
            element={<CustomerLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to={ROUTES.customer.dashboard}
                  replace
                />
              }
            />
            <Route
              path="dashboard"
              element={<CustomerDashboard />}
            />
            <Route
              path="services"
              element={<CustomerServices />}
            />
            <Route
              path="bookings"
              element={<CustomerBookings />}
            />
            <Route
              path="profile"
              element={<CustomerProfile />}
            />
          </Route>

          {/* Business workspace */}
          <Route
            path={ROUTES.business.index}
            element={<BusinessLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to={ROUTES.business.dashboard}
                  replace
                />
              }
            />
            <Route
              path="dashboard"
              element={<BusinessDashboard />}
            />
            <Route
              path="tasks"
              element={<BusinessTasks />}
            />
            <Route
              path="fleet"
              element={<BusinessFleet />}
            />
            <Route
              path="profile"
              element={<BusinessProfile />}
            />
            <Route
              path="subscription"
              element={<BusinessSubscription />}
            />
          </Route>

          {/* Unknown URLs */}
          <Route
            path="*"
            element={<Navigate to={ROUTES.home} replace />}
          />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}
