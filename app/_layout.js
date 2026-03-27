import { Stack } from 'expo-router';
import { LogBox, AppRegistry, Platform } from 'react-native';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import FullScreenAlert from '../components/FullScreenAlert';
import { MedicineProvider } from '../context/MedicineContext';
import { ToastProvider } from '../context/ToastContext';
import PermissionCheckModal from '../components/PermissionCheckModal';
import AlarmScreen from '../components/AlarmScreen';
import '../utils/ReminderEngine';

LogBox.ignoreLogs(['expo-notifications: Android Push notifications']);

// Register AlarmScreen
AppRegistry.registerComponent('AlarmScreen', () => AlarmScreen);

// 🔔 Handle notifications (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {

  useEffect(() => {
    setupNotifications();
  }, []);

  // 🔥 SETUP FUNCTION (IMPORTANT)
  async function setupNotifications() {
    // 1. Request permission
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Notification permission not granted!');
      return;
    }

    // 2. ANDROID CHANNEL (VERY IMPORTANT)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('medicine-reminder', {
        name: 'Medicine Reminder',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
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
