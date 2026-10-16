import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { DEMO_SERVICES } from '@/mocks/services';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { AppFooter } from '@/components/layout/AppFooter';
import { PrimaryButton } from '@/components/common/Buttons';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function PublicServicesPage() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <PublicNavbar />
      <View style={styles.container}>
        <StatusBadge label="PUBLIC SERVICE DIRECTORY (ILLUSTRATIVE)" />
        <Text style={[styles.title, { color: colors.primaryText }]}>
          Personal Concierge & Business Logistics Services
        </Text>
        <Text style={[styles.lead, { color: colors.secondaryText }]}>
          Browse illustrative service categories available on SUBIDHA. Sign in as a Customer to book personal assistance or as a Business Partner to dispatch field tasks.
        </Text>

        <View style={styles.grid}>
          {DEMO_SERVICES.map((srv) => (
            <View
              key={srv.id}
              style={[
                styles.card,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            >
              <View style={styles.badgeRow}>
                <StatusBadge label={srv.category} />
                <StatusBadge label={`For ${srv.audience}`} tone="info" />
              </View>
              <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
                {srv.title}
              </Text>
              <Text style={[styles.desc, { color: colors.secondaryText }]}>
                {srv.fullDescription}
              </Text>
              <Text style={[styles.meta, { color: colors.primaryAccent }]}>
                Typical Window: {srv.estimatedDuration} • {srv.baseCoverageNote}
              </Text>
              <Text style={[styles.expense, { color: colors.secondaryText }]}>
                Note: {srv.externalExpenseNote}
              </Text>
              <PrimaryButton
                label={
                  srv.audience === 'business'
                    ? 'Sign In to Business Dispatch'
                    : 'Book This Service'
                }
                onPress={() =>
                  router.push(
                    srv.audience === 'business'
                      ? '/auth/login/business'
                      : '/auth/login/customer'
                  )
                }
              />
            </View>
          ))}
        </View>
      </View>
      <AppFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
    padding: 24,
    gap: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  lead: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 760,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  card: {
    flex: 1,
    minWidth: 320,
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  desc: {
    fontSize: 14,
    lineHeight: 22,
  },
  meta: {
    fontSize: 13,
    fontWeight: '600',
  },
  expense: {
    fontSize: 12,
    lineHeight: 18,
  },
});