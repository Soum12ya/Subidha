import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { AppLogo } from '@/components/common/AppLogo';

export const AppFooter: React.FC = () => {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: colors.secondaryBackground,
          borderTopColor: colors.border,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.brandCol}>
          <AppLogo size="lg" />
          <Text style={[styles.desc, { color: colors.secondaryText }]}>
            Subscription-based essential personal assistance, trusted local escort support, and dedicated business logistics.
          </Text>
          <Text style={[styles.disclaimer, { color: colors.secondaryText }]}>
            Prototype Notice: All plans, ratings, bookings, and dispatch states in this frontend are illustrative demo data prepared for Django REST Framework integration.
          </Text>
        </View>

        <View style={styles.linksGrid}>
          <View style={styles.linkCol}>
            <Text style={[styles.colTitle, { color: colors.primaryText }]}>Platform</Text>
            <Pressable onPress={() => router.push('/services')}>
              <Text style={[styles.link, { color: colors.secondaryText }]}>Service Directory</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/plans')}>
              <Text style={[styles.link, { color: colors.secondaryText }]}>Subscription Plans</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/about')}>
              <Text style={[styles.link, { color: colors.secondaryText }]}>How It Works & Safety</Text>
            </Pressable>
          </View>

          <View style={styles.linkCol}>
            <Text style={[styles.colTitle, { color: colors.primaryText }]}>Account Portals</Text>
            <Pressable onPress={() => router.push('/auth/login/customer')}>
              <Text style={[styles.link, { color: colors.secondaryText }]}>Customer Sign In</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/auth/login/business')}>
              <Text style={[styles.link, { color: colors.secondaryText }]}>Business Partner Sign In</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/auth/signup')}>
              <Text style={[styles.link, { color: colors.secondaryText }]}>New Account Registration</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    paddingVertical: 48,
    paddingHorizontal: 20,
    marginTop: 48,
  },
  container: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 32,
  },
  brandCol: {
    maxWidth: 460,
    gap: 12,
  },
  desc: {
    fontSize: 14,
    lineHeight: 22,
  },
  disclaimer: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 48,
  },
  linkCol: {
    gap: 10,
  },
  colTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  link: {
    fontSize: 14,
  },
});