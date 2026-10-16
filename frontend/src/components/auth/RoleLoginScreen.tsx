import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { UserRole } from '@/types';
import {
  isValidIndianPhone,
  loginWithPhone,
  normalizeIndianPhone,
} from '@/services/auth.service';
import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { FormField } from '@/components/common/FormField';
import { PrimaryButton } from '@/components/common/Buttons';
import { ModalDialog } from '@/components/common/ModalDialog';

interface RoleLoginScreenProps {
  initialRole: UserRole;
}

export const RoleLoginScreen: React.FC<RoleLoginScreenProps> = ({ initialRole }) => {
  const { colors } = useAppTheme();
  const { selectedRole, setSelectedRole, prefilledPhone, setPrefilledPhone } =
    useAppState();
  const router = useRouter();

  const [role, setRole] = useState<UserRole>(initialRole || selectedRole);
  const [phone, setPhone] = useState<string>(prefilledPhone || '');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [unregisteredModalVisible, setUnregisteredModalVisible] = useState<boolean>(false);

  useEffect(() => {
    setRole(initialRole);
    setSelectedRole(initialRole);
  }, [initialRole, setSelectedRole]);

  const handleRoleSwitch = (nextRole: UserRole) => {
    setRole(nextRole);
    setSelectedRole(nextRole);
    setError('');
  };

  const handleContinue = async () => {
    setError('');
    const cleaned = normalizeIndianPhone(phone);

    if (!isValidIndianPhone(cleaned)) {
      setError('Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setLoading(true);
    try {
      const lookup = await loginWithPhone(cleaned, role);
      setPrefilledPhone(cleaned);

      if (lookup.exists) {
        router.push({
          pathname: '/auth/verify-otp',
          params: { phone: cleaned, role },
        });
      } else {
        setUnregisteredModalVisible(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNow = () => {
    const cleaned = normalizeIndianPhone(phone);
    setPrefilledPhone(cleaned);
    setSelectedRole(role);
    setUnregisteredModalVisible(false);
    router.push({
      pathname: role === 'customer' ? '/auth/signup/customer' : '/auth/signup/business',
      params: { phone: cleaned, role },
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.outer}
    >
      <View style={styles.topRow}>
        <AppLogo />
        <ThemeToggle />
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.eyebrow, { color: colors.primaryAccent }]}>
          ACCOUNT AUTHENTICATION
        </Text>
        <Text style={[styles.title, { color: colors.primaryText }]}>
          Welcome to SUBIDHA
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Select your account type and enter your registered mobile number.
        </Text>

        {/* Role Selector */}
        <View
          style={[
            styles.roleSwitcher,
            { backgroundColor: colors.secondaryBackground, borderColor: colors.border },
          ]}
        >
          {(['customer', 'business'] as UserRole[]).map((r) => {
            const active = role === r;
            return (
              <Pressable
                key={r}
                onPress={() => handleRoleSwitch(r)}
                style={[
                  styles.roleTab,
                  {
                    backgroundColor: active ? colors.primaryAccent : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.roleTabText,
                    {
                      color: active ? colors.buttonTextOnAccent : colors.secondaryText,
                    },
                  ]}
                >
                  {r === 'customer' ? 'Customer / Individual' : 'Business / Partner'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FormField
          label="Indian Mobile Number"
          prefixText="+91"
          placeholder="9876543210"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={(t) => {
            setPhone(t.replace(/\D/g, ''));
            if (error) setError('');
          }}
          error={error}
          helperText={
            role === 'customer'
              ? 'Demo registered Customer number: 9876543210'
              : 'Demo registered Business number: 9876501234'
          }
        />

        <PrimaryButton
          label="Continue"
          fullWidth
          loading={loading}
          onPress={handleContinue}
        />

        <View style={styles.linksFooter}>
          <Pressable
            onPress={() =>
              router.push({
                pathname:
                  role === 'customer'
                    ? '/auth/signup/customer'
                    : '/auth/signup/business',
                params: { phone: normalizeIndianPhone(phone), role },
              })
            }
          >
            <Text style={[styles.linkText, { color: colors.primaryAccent }]}>
              New to SUBIDHA? Register as {role === 'customer' ? 'Customer' : 'Business'}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push('/')}>
            <Text style={[styles.backLink, { color: colors.secondaryText }]}>
              ← Back to Home
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Required Unregistered Mobile Number Modal */}
      <ModalDialog
        visible={unregisteredModalVisible}
        title="This mobile number is not registered."
        description="Create your SUBIDHA account to continue."
        primaryLabel="Register Now"
        secondaryLabel="Cancel"
        onPrimaryPress={handleRegisterNow}
        onSecondaryPress={() => setUnregisteredModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRow: {
    width: '100%',
    maxWidth: 460,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  roleSwitcher: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 20,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  linksFooter: {
    marginTop: 22,
    alignItems: 'center',
    gap: 12,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  backLink: {
    fontSize: 13,
  },
});