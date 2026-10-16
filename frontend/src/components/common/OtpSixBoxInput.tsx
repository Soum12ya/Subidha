import React, { useRef } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

interface OtpSixBoxInputProps {
  value: string; // up to 6 digits
  onChange: (nextOtp: string) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * 6-Box segmented OTP input.
 * Enforces strictly 1 numeric digit per box, auto-advances focus, handles backspace,
 * and prevents bulk paste flood / automated input abuse.
 */
export const OtpSixBoxInput: React.FC<OtpSixBoxInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const { colors } = useAppTheme();
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const digits = Array.from({ length: 6 }, (_, idx) => value[idx] || '');

  const handleDigitChange = (text: string, index: number) => {
    if (disabled) return;
    const numeric = text.replace(/\D/g, '');

    // Handle quick paste of up to 6 digits
    if (numeric.length > 1) {
      const sliced = numeric.slice(0, 6);
      onChange(sliced);
      const nextFocusIndex = Math.min(sliced.length, 5);
      inputRefs.current[nextFocusIndex]?.focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = numeric;
    const joined = nextDigits.join('').slice(0, 6);
    onChange(joined);

    if (numeric && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      const nextDigits = [...digits];
      nextDigits[index - 1] = '';
      onChange(nextDigits.join(''));
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.primaryText }]}>
        Enter 6-Digit Verification Code
      </Text>
      <View style={styles.boxRow}>
        {digits.map((digit, idx) => {
          const isFilled = Boolean(digit);
          return (
            <TextInput
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              value={digit}
              editable={!disabled}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              accessibilityLabel={`OTP digit ${idx + 1} of 6`}
              onChangeText={(txt) => handleDigitChange(txt, idx)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, idx)}
              style={[
                styles.box,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: error
                    ? colors.sos
                    : isFilled
                    ? colors.primaryAccent
                    : colors.border,
                  color: colors.primaryText,
                },
              ]}
            />
          );
        })}
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: colors.sos }]}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  box: {
    flex: 1,
    height: 54,
    maxWidth: 52,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
});