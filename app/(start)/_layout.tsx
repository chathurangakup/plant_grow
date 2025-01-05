import { Stack } from "expo-router";
import React from "react";

export default function StartLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },

        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="show-pots-data"
        options={{
          headerShown: true,
          title: "Show Pot Data",
        }}
      ></Stack.Screen>
        <Stack.Screen
        name="show-pots-history"
        options={{
          headerShown: true,
          title: "Show Pots History",
        }}
      ></Stack.Screen>
    </Stack>
  );
}
