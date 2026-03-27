import { Stack } from 'expo-router';
import { LogBox, AppRegistry } from 'react-native';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import FullScreenAlert from '../components/FullScreenAlert';
import { MedicineProvider } from '../context/MedicineContext';
import { ToastProvider } from '../context/ToastContext';
import PermissionCheckModal from '../components/PermissionCheckModal';
import AlarmScreen from '../components/AlarmScreen';
import '../utils/ReminderEngine'; 

LogBox.ignoreLogs(['expo-notifications: Android Push notifications']);

// Register AlarmScreen for the native AlarmActivity to find it.
AppRegistry.registerComponent('AlarmScreen', () => AlarmScreen);

// 🔔 IMPORTANT: Handle notifications when app is foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {

  // 🔔 REQUEST PERMISSION HERE
  useEffect(() => {
    requestPermissions();
  }, []);

  async function requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Notification permission not granted!');
    }
  }

  return (
    <ToastProvider>
      <MedicineProvider>
        <>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ title: 'Login', headerBackTitle: 'Back' }} />
            <Stack.Screen name="auth/register" options={{ title: 'Register', headerBackTitle: 'Back' }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="alarm" options={{ presentation: 'fullScreenModal', headerShown: false }} />
            <Stack.Screen name="adherence-dashboard" options={{ headerShown: false }} />
          </Stack>

          <FullScreenAlert />
          <PermissionCheckModal />
        </>
      </MedicineProvider>
    </ToastProvider>
  );
}
