import useTheme from "@/hooks/useTheme";
import type { ReactElement } from "react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface InputTextProps {
  autoCapitalize?: "none";
  autoCorrect?: boolean;
  autoComplete?: "off";
  defaultValue?: string;
  assistiveText?: string;
  secureText?: boolean;
  legend: string;
  optional?: boolean;
  readOnly?: boolean;
  maxLenght: number | undefined;
  value: string;
  //onValidate?: (value: string) => boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit(): void;
  onChange(newValue: string): void;
  //validate?: (value: string) => boolean;
  error?: { error: false } | { error: true; message: string };
}

const TextField = forwardRef<Pick<TextInput, "focus" | "blur">, InputTextProps>(function TextField(
  {
    autoCapitalize,
    autoCorrect,
    autoComplete,
    assistiveText,
    //defaultValue = "",
    value,
    readOnly = false,
    legend,
    onSubmit,
    secureText = false,
    optional = false,
    maxLenght = 255,
    onChange,
    onBlur,
    onFocus,
    error,
    //validate,
    //onValidate,
  },
  inputRef,
): ReactElement {
  const localRef = useRef<TextInput>(null);
  useImperativeHandle(inputRef, () => ({
    focus: (): void => localRef.current?.focus(),
    blur: (): void => localRef.current?.blur(),
  }));

  const theme = useTheme();
  //const [value, setValue] = useState(defaultValue);
  const [isSecureTextOn, setSecureTextOn] = useState(secureText);
  //const [hasInvalidValue, setInvalidValue] = useState(false);
  const color = error?.error == true ? theme.dangerColor : readOnly ? theme.secondaryColor : theme.primaryColor;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ backgroundColor: theme.buttonColor, borderRadius: 15, padding: 5, paddingLeft: 15 }}
        onPress={() => {
          localRef.current?.focus();
          //localRef.current?.setSelection(value.length, value.length);
        }}
      >
        <Text style={[styles.legend, { color: theme.secondaryColor }]}>{legend}</Text>
        <TextInput
          ref={localRef}
          style={[styles.textInput, { color, borderBottomColor: color }]}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          secureTextEntry={isSecureTextOn}
          readOnly={readOnly}
          maxLength={maxLenght}
          onBlur={(): void => {
            onBlur?.();
            setSecureTextOn(secureText);
          }}
          onFocus={(): void => {
            localRef.current?.setSelection(value.length, value.length);
            onFocus?.();
            setSecureTextOn(false);
          }}
          value={value}
          onChangeText={onChange}
          submitBehavior={"submit"}
          onSubmitEditing={onSubmit}
          underlineColorAndroid={"transparent"}
        />
      </TouchableOpacity>
      {(assistiveText !== undefined || optional) && !error?.error && (
        <Text style={[styles.assistiveText, { color: theme.secondaryColor }]}>
          {assistiveText !== undefined ? assistiveText : "Optional"}
        </Text>
      )}
      {error?.error === true && (
        <Text style={[styles.assistiveText, { color: theme.dangerColor }]}>{error.message}</Text>
      )}
    </View>
  );
});

type Validator = (value: string) => ValidationResult;

type ValidationResult = { isValid: true } | { isValid: false; reason: string };

const styles = StyleSheet.create({
  assistiveText: {
    fontSize: 12,
    marginLeft: 15,
    paddingTop: 5,
  },
  container: {
    // /paddingHorizontal: 20,
    //paddingVertical: 10,
  },
  legend: {
    fontSize: 12,
  },
  option: {
    flexDirection: "column",
  },
  textInput: {
    fontSize: 15,
    padding: 3,
  },
});

export default TextField;
export type { ValidationResult, Validator };
