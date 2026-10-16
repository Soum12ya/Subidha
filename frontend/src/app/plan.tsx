import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { DEMO_PLANS } from '@/mocks/services';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { AppFooter } from '@/components/layout/AppFooter';
import { PrimaryButton } from '@/components/common/Buttons';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function PlansPage() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <PublicNavbar />
      <View style={styles.container}>
        <StatusBadge label="ILLUSTRATIVE SUBSCRIPTION PLANS" />
        <Text style={[styles.title, { color: colors.primaryText }]}>
          Transparent Membership & Operational Plans
        </Text>
        <Text style={[styles.lead, { color: colors.secondaryText }]}>
          Choose an Individual, Tourist, Business, or Enterprise demo plan. No real payments are processed in this frontend prototype.
        </Text>

        <View style={styles.grid}>
          {DEMO_PLANS.map((plan) => (
            <View
              key={plan.id}
              style={[
                styles.card,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            >
              <StatusBadge label={plan.badge || plan.audience} />
              <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
                {plan.name}
              </Text>
              <Text style={[styles.price, { color: colors.primaryAccent }]}>
                {plan.priceDisplay}{' '}
                <Text style={{ fontSize: 13, color: colors.secondaryText }}>
                  {plan.billingPeriod}
                </Text>
              </Text>
              <Text style={[styles.desc, { color: colors.secondaryText }]}>
                {plan.description}
              </Text>
              {plan.features.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <CheckCircle2 size={16} color={colors.primaryAccent} />
                  <Text style={[styles.featureText, { color: colors.primaryText }]}>
                    {f}
                  </Text>
                </View>
              ))}
              <Text style={[styles.policy, { color: colors.secondaryText }]}>
                External Expense Policy: {plan.externalExpensePolicy}
              </Text>
              <PrimaryButton
                label={
                  plan.audience === 'business' || plan.audience === 'enterprise'
                    ? 'Register Business Account'
                    : 'Register Customer Account'
                }
                onPress={() =>
                  router.push(
                    plan.audience === 'business' || plan.audience === 'enterprise'
                      ? '/auth/signup/business'
                      : '/auth/signup/customer'
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
    minWidth: 300,
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
  },
  desc: {
    fontSize: 14,
    lineHeight: 22,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    flex: 1,
  },
  policy: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
});