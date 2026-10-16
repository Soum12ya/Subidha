import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  disableLink?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', disableLink = false }) => {
  const { colors } = useAppTheme();
  const router = useRouter();
  const iconDim = size === 'sm' ? 28 : size === 'lg' ? 40 : 34;
  const fontSize = size === 'sm' ? 17 : size === 'lg' ? 24 : 20;

  const content = (
    <View style={styles.container}>
      <Svg width={iconDim} height={iconDim} viewBox="0 0 40 40" fill="none">
        <Rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="10"
          fill={colors.secondaryBackground}
          stroke={colors.primaryAccent}
          strokeWidth="2"
        />
        <Path
          d="M12 24C12 18.5 16.5 15 21.5 15H27M27 15L23.5 11.5M27 15L23.5 18.5"
          stroke={colors.primaryAccent}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M28 17C28 22.5 23.5 26 18.5 26H13"
          stroke={colors.secondaryAccent}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <Circle cx="13" cy="26" r="2.5" fill={colors.primaryAccent} />
      </Svg>
      <View>
        <Text style={[styles.wordmark, { color: colors.primaryText, fontSize }]}>SUBIDHA</Text>
        {size === 'lg' && (
          <Text style={[styles.tagline, { color: colors.secondaryText }]}>
            CONCIERGE & LOGISTICS
          </Text>
        )}
      </View>
    </View>
  );

  if (disableLink) return content;

  return (
    <Pressable
      onPress={() => router.push('/')}
      accessibilityRole="link"
      accessibilityLabel="SUBIDHA Home"
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  tagline: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '600',
    marginTop: 1,
  },
});