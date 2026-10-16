import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, X, Smartphone } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { PrimaryButton, SecondaryButton } from '@/components/common/Buttons';

// Replace with your production Play Store / App Store / APK link when ready
const FUTURE_APP_DOWNLOAD_URL = 'https://expo.dev';

export const PublicNavbar: React.FC = () => {
  const { colors } = useAppTheme();
  const { user, setSelectedRole, showToast } = useAppState();
  const { width } = useWindowDimensions();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSmartBanner, setShowSmartBanner] = useState(true);

  const isDesktop = width >= 1024;

  const navItems = [
    { label: 'Services', href: '/services' },
    { label: 'How It Works', href: '/about' },
    { label: 'Subscription Plans', href: '/plans' },
    {
      label: 'For Businesses',
      action: () => {
        setSelectedRole('business');
        router.push('/auth/login/business');
      },
    },
    {
      label: 'For Individuals',
      action: () => {
        setSelectedRole('customer');
        router.push('/auth/login/customer');
      },
    },
    { label: 'About Us', href: '/about' },
  ];

  const handleDashboardRedirect = () => {
    if (!user) {
      router.push('/auth');
      return;
    }
    router.push(
      user.role === 'customer' ? '/customer/dashboard' : '/business/dashboard'
    );
  };

  const handleDownloadMobileApp = () => {
    showToast('Redirecting to SUBIDHA Mobile App download (Android & iOS)...');
    Linking.openURL(FUTURE_APP_DOWNLOAD_URL).catch(() => {});
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Mobile-Only Top App Banner (Like Blinkit Mobile Inspect image_60584b.jpg) */}
      {!isDesktop && showSmartBanner ? (
        <View style={styles.smartAppBanner}>
          <View style={styles.smartBannerLeft}>
            <Pressable
              onPress={() => setShowSmartBanner(false)}
              accessibilityLabel="Close app banner"
            >
              <X size={16} color="#FFFFFF" />
            </Pressable>
            <View style={styles.smartBannerIcon}>
              <Smartphone size={16} color="#065F46" />
            </View>
            <View>
              <Text style={styles.smartBannerTitle}>Get The SUBIDHA App</Text>
              <Text style={styles.smartBannerSub}>
                For Better Experience & Live SOS
              </Text>
            </View>
          </View>
          <Pressable
            onPress={handleDownloadMobileApp}
            style={styles.useAppPill}
          >
            <Text style={styles.useAppPillText}>Use App</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.inner}>
        <AppLogo />

        {isDesktop ? (
          <View style={styles.desktopLinks}>
            {navItems.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => {
                  if (item.action) item.action();
                  else if (item.href) router.push(item.href as any);
                }}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Text style={[styles.navLink, { color: colors.secondaryText }]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <View style={styles.rightActions}>
          <ThemeToggle />
          {isDesktop ? (
            <>
              {user ? (
                <SecondaryButton
                  label={
                    user.role === 'customer'
                      ? 'Customer Dashboard'
                      : 'Business Console'
                  }
                  onPress={handleDashboardRedirect}
                />
              ) : (
                <SecondaryButton
                  label="Sign In"
                  onPress={() => router.push('/auth/login')}
                />
              )}
              <PrimaryButton
                label="Download Mobile App"
                onPress={handleDownloadMobileApp}
              />
            </>
          ) : (
            <Pressable
              onPress={() => setMobileMenuOpen((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel="Toggle navigation menu"
              style={[
                styles.menuBtn,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              {mobileMenuOpen ? (
                <X size={20} color={colors.primaryText} />
              ) : (
                <Menu size={20} color={colors.primaryText} />
              )}
            </Pressable>
          )}
        </View>
      </View>

      {!isDesktop && mobileMenuOpen ? (
        <View
          style={[
            styles.mobileDrawer,
            {
              backgroundColor: colors.secondaryBackground,
              borderTopColor: colors.border,
            },
          ]}
        >
          {navItems.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => {
                setMobileMenuOpen(false);
                if (item.action) item.action();
                else if (item.href) router.push(item.href as any);
              }}
              style={styles.mobileLinkItem}
            >
              <Text style={[styles.mobileLinkText, { color: colors.primaryText }]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
          <View style={styles.mobileCtaRow}>
            {user ? (
              <SecondaryButton
                label="Open Dashboard"
                fullWidth
                onPress={() => {
                  setMobileMenuOpen(false);
                  handleDashboardRedirect();
                }}
              />
            ) : (
              <SecondaryButton
                label="Sign In"
                fullWidth
                onPress={() => {
                  setMobileMenuOpen(false);
                  router.push('/auth/login');
                }}
              />
            )}
            <PrimaryButton
              label="Download Mobile App"
              fullWidth
              onPress={() => {
                setMobileMenuOpen(false);
                handleDownloadMobileApp();
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default PublicNavbar;

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    width: '100%',
  },
  smartAppBanner: {
    backgroundColor: '#15803D',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  smartBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smartBannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FDE047',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smartBannerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  smartBannerSub: {
    color: '#DCFCE7',
    fontSize: 11,
  },
  useAppPill: {
    backgroundColor: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  useAppPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  inner: {
    maxWidth: 1360,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  desktopLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  navLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuBtn: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  mobileDrawer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 10,
  },
  mobileLinkItem: {
    paddingVertical: 10,
  },
  mobileLinkText: {
    fontSize: 15,
    fontWeight: '600',
  },
  mobileCtaRow: {
    marginTop: 8,
    gap: 10,
  },
});