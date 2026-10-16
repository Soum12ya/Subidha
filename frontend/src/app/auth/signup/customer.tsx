import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { registerCustomer } from '@/services/auth.service';
import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { FormField } from '@/components/common/FormField';
import { PrimaryButton } from '@/components/common/Buttons';

const customerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z
    .string()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),
  city: z.string().min(2, 'City is required'),
  preferredLanguage: z.string().min(2, 'Preferred language is required'),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  consentAccepted: z.boolean().refine((v) => v === true, {
    message: 'You must accept the terms and privacy notice to continue',
  }),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function CustomerSignupPage() {
  const { colors } = useAppTheme();
  const { prefilledPhone, setSelectedRole } = useAppState();
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: '',
      phone: params.phone || prefilledPhone || '',
      email: '',
      city: 'Kolkata',
      preferredLanguage: 'English',
      emergencyContactName: '',
      emergencyContactPhone: '',
      consentAccepted: false,
    },
  });

  useEffect(() => {
    setSelectedRole('customer');
    if (params.phone) {
      setValue('phone', params.phone);
    }
  }, [params.phone, setSelectedRole, setValue]);

  const onSubmit = async (values: CustomerFormValues) => {
    await registerCustomer(values);
    router.push({
      pathname: '/auth/verify-otp',
      params: { phone: values.phone, role: 'customer' },
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
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.eyebrow, { color: colors.primaryAccent }]}>
          CUSTOMER REGISTRATION
        </Text>
        <Text style={[styles.title, { color: colors.primaryText }]}>
          Create Your Personal Assistance Account
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Register your mobile number for individual or family concierge services.
        </Text>

        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Full Name *"
              placeholder="e.g., Sohini Dutta"
              value={value}
              onChangeText={onChange}
              error={errors.fullName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Mobile Number *"
              prefixText="+91"
              placeholder="9876543210"
              keyboardType="phone-pad"
              maxLength={10}
              value={value}
              onChangeText={(t) => onChange(t.replace(/\D/g, ''))}
              error={errors.phone?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Email Address (Optional)"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="City *"
              placeholder="Kolkata"
              value={value}
              onChangeText={onChange}
              error={errors.city?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="preferredLanguage"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Preferred Language *"
              placeholder="English / Bengali / Hindi"
              value={value}
              onChangeText={onChange}
              error={errors.preferredLanguage?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="emergencyContactName"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Emergency Contact Name (Optional)"
              placeholder="Family contact name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="emergencyContactPhone"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Emergency Contact Phone (Optional)"
              prefixText="+91"
              placeholder="9876543211"
              keyboardType="phone-pad"
              maxLength={10}
              value={value}
              onChangeText={(t) => onChange(t.replace(/\D/g, ''))}
            />
          )}
        />

        <Controller
          control={control}
          name="consentAccepted"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 18 }}>
              <Pressable
                onPress={() => onChange(!value)}
                style={styles.checkboxRow}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: value }}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: colors.primaryAccent,
                      backgroundColor: value ? colors.primaryAccent : 'transparent',
                    },
                  ]}
                />
                <Text style={[styles.consentText, { color: colors.secondaryText }]}>
                  I agree to the SUBIDHA Terms of Service and Privacy Policy (Demo Account).
                </Text>
              </Pressable>
              {errors.consentAccepted ? (
                <Text style={{ color: colors.sos, fontSize: 12, marginTop: 4 }}>
                  {errors.consentAccepted.message}
                </Text>
              ) : null}
            </View>
          )}
        />

        <PrimaryButton
          label="Register & Proceed to OTP"
          fullWidth
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />

        <Pressable
          onPress={() => router.push('/auth/login/customer')}
          style={{ marginTop: 16, alignItems: 'center' }}
        >
          <Text style={{ color: colors.primaryAccent, fontSize: 14, fontWeight: '600' }}>
            Already registered? Sign In
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    maxWidth: 520,
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
  },
  consentText: {
    fontSize: 13,
    flex: 1,
  },
});