import { Stack } from 'expo-router';
import React from 'react';


export default function StartLayout() {


  return (
    <Stack
    screenOptions={{
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    }}
>
    <Stack.Screen name='index'
        options={{
            headerShown: false
        }}></Stack.Screen>

        </Stack>
  );
}
