import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { useAppState } from '@/context/AppStateContext';
import { useAppTheme } from '@/context/ThemeContext';
import { DashboardShell, NavItemConfig } from '@/components/layout/DashboardShell';
import { PrimaryButton } from '@/components/common/Buttons';
import { ModalDialog } from '@/components/common/ModalDialog';

// Replace Siren, Wrench, Train with universally supported AlertTriangle, Settings, Compass:
import {
  AlertTriangle,
  UserCheck,
  Package,
  Settings,
  Compass,
  ArrowRight,
} from 'lucide-react-native';

// Full Sidebar Navigation Menu
const CUSTOMER_SIDEBAR_NAV: NavItemConfig[] = [
  { label: 'Home Dashboard', href: '/customer/dashboard', icon: 'home' },
  { label: 'Request Personal Escort', href: '/customer/services', icon: 'tasks' },
  { label: 'Active Task & Store Bills', href: '/customer/bookings', icon: 'bills' },
  { label: 'Profile & Ledger', href: '/customer/profile', icon: 'profile' },
];

// Bottom 4-Grid Footer matching 01_B2C_Home_Dashboard.png
const CUSTOMER_BOTTOM_GRID: NavItemConfig[] = [
  { label: 'Home', href: '/customer/dashboard', icon: 'home' },
  { label: 'Tasks', href: '/customer/services', icon: 'tasks' },
  { label: 'Bills', href: '/customer/bookings', icon: 'bills' },
  { label: 'Profile', href: '/customer/profile', icon: 'profile' },
];

export default function CustomerLayout() {
  const { user } = useAppState();
  const { colors } = useAppTheme();
  const router = useRouter();
  const [sosModalVisible, setSosModalVisible] = useState(false);

  if (!user || user.role !== 'customer') {
    return (
      <View style={[styles.guardBox, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.guardCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.guardTitle, { color: colors.primaryText }]}>
            Customer Account Required
          </Text>
          <Text style={[styles.guardDesc, { color: colors.secondaryText }]}>
            Please sign in with a registered Customer mobile number (+91 9876543210).
          </Text>
          <PrimaryButton
            label="Sign In as Customer"
            onPress={() => router.replace('/auth/login/customer')}
          />
        </View>
      </View>
    );
  }

  return (
    <>
      <DashboardShell
        roleLabel="SENIOR PASS ACTIVE"
        navItems={CUSTOMER_SIDEBAR_NAV}
        bottomGridItems={CUSTOMER_BOTTOM_GRID}
        maxFrameWidth={480}
        onTriggerSos={() => setSosModalVisible(true)}
      >
        <Slot />
      </DashboardShell>

      <ModalDialog
        visible={sosModalVisible}
        variant="danger"
        title="CRITICAL SOS EMERGENCY RADAR"
        description={`Countdown: 3... 2... 1... Triggering Alerts (Simulated)\n\n• [Ambulance Liaison Contacted]\n• [Family Contacts Notified via SMS: ${
          user.emergencyContactName || 'Meera Sen'
        }]\n• [Nearest Agent Rahul S. Redirected]\n\n(Note: Prototype simulation only.)`}
        primaryLabel="Cancel / Acknowledge Demo SOS"
        onPrimaryPress={() => setSosModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  guardBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  guardCard: {
    maxWidth: 420,
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    gap: 14,
  },
  guardTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  guardDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
});