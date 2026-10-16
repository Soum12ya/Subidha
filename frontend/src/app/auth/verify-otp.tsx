import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { UserRole } from '@/types';
import { API_CONFIG } from '@/services/api.config';
import { getPendingAuthAttempt, verifyDemoOtp } from '@/services/auth.service';
import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { OtpSixBoxInput } from '@/components/common/OtpSixBoxInput';
import { PrimaryButton } from '@/components/common/Buttons';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function VerifyOtpPage() {
  const { colors } = useAppTheme();
  const { setAuthenticatedUser, showToast, selectedRole, prefilledPhone } =
    useAppState();
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; role?: UserRole }>();

  const pending = getPendingAuthAttempt();
  const activePhone = params.phone || pending?.phone || prefilledPhone || '';
  const activeRole: UserRole =
    (params.role as UserRole) || pending?.role || selectedRole;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
      setLockoutSeconds((l) => (l > 0 ? l - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerify = async () => {
    if (lockoutSeconds > 0) return;
    setError('');

    if (otp.length !== 6) {
      setError('Please enter all 6 digits in the OTP boxes.');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyDemoOtp(otp, activePhone, activeRole);
      if (!result.success || !result.user) {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= 5) {
          setLockoutSeconds(30);
          setError('Too many invalid attempts. Box input locked for 30s (DoS protection).');
        } else {
          setError(result.error || 'Invalid OTP code.');
        }
        return;
      }

      setAuthenticatedUser(result.user);
      showToast(
        `Verified! Welcome ${
          result.user.role === 'customer'
            ? result.user.fullName
            : result.user.businessName
        }`
      );

      router.replace(
        result.user.role === 'customer'
          ? '/customer/dashboard'
          : '/business/dashboard'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Pinned Top Logo Header */}
      <View
        style={[
          styles.pinnedHeader,
          {
            backgroundColor: colors.secondaryBackground,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.pinnedHeaderInner}>
          <AppLogo size="md" />
          <ThemeToggle />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.outer}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <StatusBadge
            label={`6-BOX OTP VERIFICATION • ${activeRole.toUpperCase()}`}
          />
          <Text style={[styles.title, { color: colors.primaryText }]}>
            Verify Mobile Number
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Enter the 6-digit code sent to +91 {activePhone || '9876543210'}.
          </Text>

          {/* 6-Box OTP Input */}
          <OtpSixBoxInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (error) setError('');
            }}
            error={error}
            disabled={lockoutSeconds > 0}
          />

          <View
            style={[
              styles.devHint,
              { backgroundColor: colors.secondaryBackground, borderColor: colors.border },
            ]}
          >
            <ShieldCheck size={16} color={colors.primaryAccent} />
            <Text style={[styles.devHintText, { color: colors.primaryAccent }]}>
              Demo OTP: {API_CONFIG.DEMO_OTP_CODE} • Segmented 6-box input with 5-attempt rate limiting.
            </Text>
          </View>

          <PrimaryButton
            label={
              lockoutSeconds > 0
                ? `Locked (${lockoutSeconds}s)`
                : 'Verify & Continue'
            }
            fullWidth
            disabled={lockoutSeconds > 0}
            loading={loading}
            onPress={handleVerify}
          />

          <View style={styles.footerLinks}>
            <Pressable
              disabled={countdown > 0}
              onPress={() => {
                setCountdown(30);
                setOtp('');
                showToast('Demo OTP timer reset (Enter 1 2 3 4 5 6).');
              }}
            >
              <Text
                style={{
                  color: countdown > 0 ? colors.secondaryText : colors.primaryAccent,
                  fontSize: 13,
                  fontWeight: '700',
                }}
              >
                {countdown > 0
                  ? `Resend OTP in ${countdown}s`
                  : 'Resend 6-Digit OTP'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                router.push(
                  activeRole === 'customer'
                    ? '/auth/login/customer'
                    : '/auth/login/business'
                )
              }
            >
              <Text style={{ color: colors.secondaryText, fontSize: 13 }}>
                ← Change mobile number
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pinnedHeader: {
    borderBottomWidth: 1,
    width: '100%',
  },
  pinnedHeaderInner: {
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outer: {
    padding: 18,
    paddingTop: 28,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  devHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  devHintText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  footerLinks: {
    marginTop: 14,
    alignItems: 'center',
    gap: 10,
  },
});