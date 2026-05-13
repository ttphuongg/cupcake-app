import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export interface CustomTextInputProps extends TextInputProps {
  label: string;
  fieldKey?: string;
  isPassword?: boolean;
  showPassword?: boolean;
  onToggleShow?: () => void;
  error?: boolean;
  errorMsg?: string;
  focusedInput?: string | null;
  onFocusKey?: (key: string) => void;
  onBlurKey?: () => void;
  onClearError?: (key: string) => void;
}

export const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  fieldKey = '',
  isPassword = false,
  showPassword = false,
  onToggleShow,
  error = false,
  errorMsg = '',
  focusedInput,
  onFocusKey,
  onBlurKey,
  onClearError,
  onChangeText,
  ...rest
}) => {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          focusedInput === fieldKey && styles.inputWrapperActive,
          error && styles.inputWrapperError,
        ]}
      >
        <TextInput
          style={styles.textInput}
          placeholderTextColor="#9ca3af"
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          textContentType="none"
          autoComplete="off"
          importantForAutofill="no"
          autoCorrect={false}
          spellCheck={false}
          onFocus={(e) => {
            if (onFocusKey) onFocusKey(fieldKey);
            if (rest.onFocus) rest.onFocus(e);
          }}
          onBlur={(e) => {
            if (onBlurKey) onBlurKey();
            if (rest.onBlur) rest.onBlur(e);
          }}
          onChangeText={(text) => {
            if (onChangeText) onChangeText(text);
            if (error && onClearError) onClearError(fieldKey);
          }}
          {...rest}
        />
        {isPassword && onToggleShow && (
          <TouchableOpacity onPress={onToggleShow} style={styles.eyeButton}>
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={18}
              color={error ? '#ef4444' : Colors.mutedForeground}
            />
          </TouchableOpacity>
        )}
      </View>
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  field: { gap: 8 },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.foreground,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputWrapperActive: { borderColor: 'rgba(232, 160, 191, 0.5)' },
  inputWrapperError: { borderColor: '#ef4444' },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.foreground,
    backgroundColor: 'transparent',
  },
  eyeButton: { paddingHorizontal: 14, paddingVertical: 14 },
  errorText: { color: '#ef4444', fontSize: 12, fontWeight: '500', marginTop: 2, marginLeft: 4 },
});
