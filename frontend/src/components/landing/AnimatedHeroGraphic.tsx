import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, AccessibilityInfo } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAppTheme } from '@/context/ThemeContext';
import { ShieldCheck, Truck, HeartHandshake } from 'lucide-react-native';

export const AnimatedHeroGraphic: React.FC = () => {
  const { colors } = useAppTheme();
  const [reduceMotion, setReduceMotion] = useState(false);
  const floatOffset = useSharedValue(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        setReduceMotion(Boolean(enabled));
        if (!enabled) {
          floatOffset.value = withRepeat(
            withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.quad) }),
            -1,
            true
          );
        }
      })
      .catch(() => {});
  }, [floatOffset]);

  const floatingCardA = useAnimatedStyle(() => ({
    transform: [{ translateY: reduceMotion ? 0 : floatOffset.value * -8 }],
  }));

  const floatingCardB = useAnimatedStyle(() => ({
    transform: [{ translateY: reduceMotion ? 0 : floatOffset.value * 8 }],
  }));

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.secondaryBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <Svg width="100%" height="290" viewBox="0 0 540 290" fill="none">
        <Defs>
          <LinearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={colors.primaryAccent} stopOpacity="0.65" />
            <Stop offset="100%" stopColor={colors.secondaryAccent} stopOpacity="0.15" />
          </LinearGradient>
        </Defs>
        {/* Subtle 3D-inspired isometric grid planes */}
        <G opacity="0.32">
          <Path
            d="M70 210 L270 110 L470 210 L270 275 Z"
            stroke={colors.border}
            strokeWidth="1.5"
            fill={colors.cardBackground}
          />
          <Path
            d="M120 185 L270 110 L420 185 L270 245 Z"
            stroke={colors.primaryAccent}
            strokeWidth="1"
            strokeDasharray="5 5"
          />
        </G>
        {/* Connected Route Network */}
        <Path
          d="M95 190 C180 90, 350 90, 445 180"
          stroke="url(#routeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Path
          d="M135 215 C235 155, 310 230, 415 145"
          stroke={colors.secondaryAccent}
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        {/* Hub Nodes */}
        <Circle cx="95" cy="190" r="9" fill={colors.primaryAccent} />
        <Circle cx="270" cy="128" r="12" fill={colors.secondaryAccent} />
        <Circle cx="445" cy="180" r="9" fill={colors.primaryAccent} />
        <Rect
          x="248"
          y="106"
          width="44"
          height="44"
          rx="12"
          stroke={colors.primaryAccent}
          strokeWidth="1.5"
        />
      </Svg>

      {/* Left Floating Card: Personal Concierge */}
      <Animated.View
        style={[
          styles.floatingPillLeft,
          floatingCardA,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <HeartHandshake size={18} color={colors.primaryAccent} />
        <View>
          <Text style={[styles.pillTitle, { color: colors.primaryText }]}>
            Individual Assistance
          </Text>
          <Text style={[styles.pillSub, { color: colors.secondaryText }]}>
            Escort • Errands • Care
          </Text>
        </View>
      </Animated.View>

      {/* Right Floating Card: Business Logistics */}
      <Animated.View
        style={[
          styles.floatingPillRight,
          floatingCardB,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <Truck size={18} color={colors.primaryAccent} />
        <View>
          <Text style={[styles.pillTitle, { color: colors.primaryText }]}>
            Business Logistics
          </Text>
          <Text style={[styles.pillSub, { color: colors.secondaryText }]}>
            Fleet • Dispatch • B2B Runs
          </Text>
        </View>
      </Animated.View>

      {/* Bottom Trust Strip */}
      <View
        style={[
          styles.bottomStrip,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <ShieldCheck size={16} color={colors.primaryAccent} />
        <Text style={[styles.stripText, { color: colors.secondaryText }]}>
          Unified Concierge & Field Operations Network (Illustrative Architecture Preview)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  floatingPillLeft: {
    position: 'absolute',
    top: 22,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  floatingPillRight: {
    position: 'absolute',
    bottom: 66,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  pillTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  pillSub: {
    fontSize: 11,
  },
  bottomStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  stripText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
});