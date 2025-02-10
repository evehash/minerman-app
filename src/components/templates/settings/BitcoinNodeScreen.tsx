import Button from "@/components/atoms/Button";
import useSettings from "@/hooks/useSettings";
import useTheme from "@/hooks/useTheme";
import BitcoinRpcClient from "@/services/bitcoinRpcClient";
import type { ReactElement } from "react";
import { useRef, useState } from "react";
import type { TextInput } from "react-native";
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Toast from "react-native-simple-toast";
import TextField from "../../atoms/TextField";
import { validateUrl } from "@/utils/validation";
import useFormField from "@/hooks/useFormField";

function SelectableList(): ReactElement {
  const theme = useTheme();
  const { settings, updateSetting } = useSettings();
  // const [isConnected, setConnected] = useState<boolean | null>(null);
  //const [isConnected, setConnected] = useState<boolean | null>(null);
  const [isConnecting, setConnecting] = useState(false);
  const [isTestButtonDisabled, setTestButtonDisabled] = useState(false);

  const urlRef = useRef<TextInput>(null);
  const userRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const urlField = useFormField({
    initialValue: settings.bitcoinRpcUrl,
    autoSubmit: true,
    onBlur: () => setTestButtonDisabled(false),
    onFocus: () => setTestButtonDisabled(true),
    onValidate: validateUrl,
    onSubmit: (value: string) => {
      updateSetting("bitcoinRpcUrl", value);
      userRef.current?.focus();
    },
  });

  const userField = useFormField({
    initialValue: settings.bitcoinRpcUser,
    autoSubmit: true,
    onBlur: () => setTestButtonDisabled(false),
    onFocus: () => setTestButtonDisabled(true),
    onSubmit: (value: string) => {
      updateSetting("bitcoinRpcUser", value);
      passwordRef.current?.focus();
    },
  });

  const passwordField = useFormField({
    initialValue: settings.bitcoinRpcPassword,
    autoSubmit: true,
    onBlur: () => setTestButtonDisabled(false),
    onFocus: () => setTestButtonDisabled(true),
    onSubmit: (value: string): void => {
      updateSetting("bitcoinRpcPassword", value);
      passwordRef.current?.blur();
    },
  });

  const handleOnPressTestConnection = async (): Promise<void> => {
    setConnecting(true);
    const rpcClient = new BitcoinRpcClient({
      url: settings.bitcoinRpcUrl,
      user: settings.bitcoinRpcUser,
      password: settings.bitcoinRpcPassword,
    });

    const isConnectionSuccessful = await rpcClient.testConnection();

    if (isConnectionSuccessful) {
      //setConnected(true);
      Toast.show("Connection established", Toast.SHORT);
    } else {
      //setConnected(false);
      Toast.show("Connection failed. Try again.", Toast.LONG);
    }

    setTimeout(() => setConnecting(false), 1000);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.container, { flex: 1 }]}>
        <Text style={[styles.legend, { color: theme.secondaryColor }]}>Setup a Bitcoin node connection</Text>
        <TextField
          ref={urlRef}
          assistiveText="Example: https://192.168.1.2:8332"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          readOnly={isConnecting}
          value={urlField.value}
          maxLenght={64}
          legend="URL"
          onBlur={urlField.handleBlur}
          onChange={urlField.handleChange}
          onFocus={urlField.handleFocus}
          onSubmit={urlField.handleSubmit}
          error={urlField.error}
        />
        <TextField
          ref={userRef}
          autoCapitalize="none"
          readOnly={isConnecting}
          value={userField.value}
          maxLenght={64}
          legend="User"
          optional
          onBlur={userField.handleBlur}
          onChange={userField.handleChange}
          onFocus={userField.handleFocus}
          onSubmit={userField.handleSubmit}
        />
        <TextField
          ref={passwordRef}
          autoCapitalize="none"
          readOnly={isConnecting}
          value={passwordField.value}
          maxLenght={64}
          legend="Password"
          optional
          onBlur={passwordField.handleBlur}
          onChange={passwordField.handleChange}
          onFocus={passwordField.handleFocus}
          onSubmit={passwordField.handleSubmit}
          secureText
        />
        <Button
          icon={undefined}
          text={isConnecting ? "Connecting..." : "Test connection"}
          disabled={isTestButtonDisabled || isConnecting}
          onPress={handleOnPressTestConnection}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingHorizontal: 20,
  },
  legend: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default SelectableList;
