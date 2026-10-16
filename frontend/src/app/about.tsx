import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { AppFooter } from '@/components/layout/AppFooter';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function AboutPage() {
  const { colors } = useAppTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <PublicNavbar />
      <View style={styles.container}>
        <StatusBadge label="ABOUT SUBIDHA" />
        <Text style={[styles.title, { color: colors.primaryText }]}>
          Built for Dependable Assistance & Accountable Field Operations
        </Text>
        <Text style={[styles.lead, { color: colors.secondaryText }]}>
          SUBIDHA combines compassionate personal concierge support for households with structured local logistics for businesses.
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionHeading, { color: colors.primaryText }]}>
            Architecture & Backend Readiness
          </Text>
          <Text style={[styles.body, { color: colors.secondaryText }]}>
            This frontend application is built with React Native, Expo Router, and TypeScript. All authentication, booking, and task management workflows are cleanly abstracted in typed service modules (`src/services/`) so they can be connected directly to a Python Django REST Framework and PostgreSQL backend.
          </Text>
        </View>
      </View>
      <AppFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  lead: {
    fontSize: 16,
    lineHeight: 26,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    gap: 12,
    marginTop: 12,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '700',
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
  },
});