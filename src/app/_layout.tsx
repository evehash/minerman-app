import MinersHeaderRight from "@/components/templates/miners/MinersHeaderRight";
import { SwarmContextProvider } from "@/contexts/SwarmContext";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import type { ReactElement } from "react";
import React from "react";
import { View } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../stores";

export default function RootLayout(): ReactElement {
  return (
    <ReduxProvider store={store}>
      <SwarmContextProvider>
        <ThemeContextProvider>
          {(theme) => (
            <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: theme.backgroundColor,
                  },
                  statusBarBackgroundColor: "#121212",

                  headerTintColor: theme.primaryColor,
                  headerTitleStyle: {
                    fontFamily: theme.fontFamily.semiBold,
                    fontSize: 26,
                    color: theme.primaryColor,
                  },
                  headerShadowVisible: false,
                  contentStyle: {
                    backgroundColor: theme.backgroundColor,
                  },
                }}
              >
                <Stack.Screen
                  name="index"
                  options={{
                    animationTypeForReplace: "push",
                    animation: "slide_from_left",
                    title: "Miners",
                    headerRight: MinersHeaderRight,
                  }}
                />
                <Stack.Screen
                  name="settings/index"
                  options={{
                    animation: "slide_from_right",
                    title: "Settings",
                  }}
                />
                <Stack.Screen
                  name="settings/bitcoin-node"
                  options={{
                    animation: "slide_from_right",
                    title: "Bitcoin node",
                  }}
                />
                <Stack.Screen
                  name="add-miner/index"
                  options={{
                    animation: "slide_from_right",
                    title: "Add miner",
                  }}
                />
                <Stack.Screen
                  name="add-miner/connect"
                  options={{
                    animation: "slide_from_right",
                    title: "Connect miner",
                  }}
                />
              </Stack>
            </View>
          )}
        </ThemeContextProvider>
      </SwarmContextProvider>
    </ReduxProvider>
  );
}
