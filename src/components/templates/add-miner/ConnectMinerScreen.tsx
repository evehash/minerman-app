/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-unused-styles */
import Button from "@/components/atoms/Button";
import TextField from "@/components/atoms/TextField";
import useFormField from "@/hooks/useFormField";
import useMiners from "@/hooks/useMiners";
//import useMiners from "@/hooks/useMiners";
import useTheme from "@/hooks/useTheme";
import { getNetworkPrefix } from "@/utils/network";
import { validateIpv4, ValidationResult } from "@/utils/validation";
import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import type { TextInput } from "react-native";
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

function ConnectMinerScreen(): ReactElement {
  const theme = useTheme();
  //const [networkPrefix, setNetworkPrefix] = useState<string>("");
  const [ip, setIp] = useState<string>("");
  //const { settings, updateSetting } = useSettings();
  // const [isConnected, setConnected] = useState<boolean | null>(null);

  const [isTestButtonDisabled, setTestButtonDisabled] = useState(true);
  const { miners, createMiner } = useMiners();

  const validateDuplicatedIp = (ip: string): ValidationResult => {
    const ipDuplicated = miners.some((m) => m.ip === ip);
    if (ipDuplicated) {
      return { valid: false, reason: "IP already in use" };
    }
    return { valid: true };
  };

  const ipRef = useRef<TextInput>(null);

  const ipField = useFormField({
    initialValue: getNetworkPrefix,
    autoSubmit: true,
    onValidate: [validateIpv4, validateDuplicatedIp],
    onFocus: () => setTestButtonDisabled(true),
    onSubmit: (value) => {
      setIp(value);
      setTestButtonDisabled(false);
    },
  });

  //useEffect(() => ipRef.current?.focus(), []);

  //const handleOnFocusAnyInputText = (): void => setTestButtonDisabled(true);
  //const handleOnBlurAnyInputText = (): void => setTestButtonDisabled(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.container, { flex: 1 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.legend, { color: theme.secondaryColor }]}>Setup a Bitcoin node connection</Text>
          <View>
            <Text>
              Try to press the button the device until it shows the IP address, and type down the IP addres below
            </Text>
            <Text>Please, make sure you are under the same WiFi as the device.</Text>
          </View>
          <TextField
            ref={ipRef}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            readOnly={false}
            maxLenght={64}
            legend="IP address"
            value={ipField.value}
            assistiveText="Example: 192.168.1.2"
            onBlur={ipField.handleBlur}
            onFocus={ipField.handleFocus}
            onChange={ipField.handleChange}
            onSubmit={ipField.handleSubmit}
            error={ipField.error}
          />
        </View>
        <Button text={"Add"} disabled={isTestButtonDisabled} onPress={() => {}} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  legend: {
    fontSize: 14,
    fontWeight: "bold",
  },
  option: {
    //alignItems: "center",
    flexDirection: "column",
  },
  textInput: {
    //borderBottomWidth: 1,
    fontSize: 17,
  },
});

export default ConnectMinerScreen;
