import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { UserCheck, Truck } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { PrimaryButton, SecondaryButton } from '@/components/common/Buttons';

export default function AuthGatewayPage() {
  const { colors } = useAppTheme();
  const { setSelectedRole } = useAppState();
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.topBar}>
        <AppLogo />
        <ThemeToggle />
      </View>

      <Text style={[styles.title, { color: colors.primaryText }]}>
        Choose Your SUBIDHA Portal
      </Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
        Customer and Business accounts use separate workspaces and registration records.
      </Text>

      <View style={styles.grid}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <UserCheck size={28} color={colors.primaryAccent} />
          <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
            Customer / Individual
          </Text>
          <Text style={[styles.cardDesc, { color: colors.secondaryText }]}>
            Personal assistance, medical escort support, errands, and tourist guidance.
          </Text>
          <PrimaryButton
            label="Customer Sign In"
            fullWidth
            onPress={() => {
              setSelectedRole('customer');
              router.push('/auth/login/customer');
            }}
          />
          <SecondaryButton
            label="Register as Customer"
            fullWidth
            onPress={() => {
              setSelectedRole('customer');
              router.push('/auth/signup/customer');
            }}
          />
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Truck size={28} color={colors.primaryAccent} />
          <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
            Business / Partner
          </Text>
          <Text style={[styles.cardDesc, { color: colors.secondaryText }]}>
            B2B delivery dispatches, pharmacy & retail runs, and field fleet management.
          </Text>
          <PrimaryButton
            label="Business Sign In"
            fullWidth
            onPress={() => {
              setSelectedRole('business');
              router.push('/auth/login/business');
            }}
          />
          <SecondaryButton
            label="Register Business Partner"
            fullWidth
            onPress={() => {
              setSelectedRole('business');
              router.push('/auth/signup/business');
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    width: '100%',
    maxWidth: 820,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 520,
    marginBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    maxWidth: 820,
    width: '100%',
  },
  card: {
    flex: 1,
    minWidth: 300,
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    gap: 14,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 21,
  },
});