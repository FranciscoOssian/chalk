import * as Notifications from 'expo-notifications';

import { registerForPushNotificationsAsync, sendNotification } from './index.js'; // Substitua pelo caminho real para o seu arquivo pushNotifications

// Mock de Expo Device
jest.mock('expo-device', () => ({
  isDevice: true, // Substitua pelo valor desejado (true para simular que é um dispositivo)
}));

// Mock de Expo Notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: () => ({
    status: 'granted',
  }),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: async () => ({
    data: 'mocked-token',
  }),
  scheduleNotificationAsync: jest.fn(),
}));

describe('registerForPushNotificationsAsync', () => {
  it('should register for push notifications', async () => {
    const token = await registerForPushNotificationsAsync();

    expect(token).toEqual('mocked-token');
  });
});

describe('sendNotification', () => {
  it('should schedule a notification with provided data', async () => {
    const data = {
      identifier: 'notification-1',
      title: 'Test Notification',
      body: 'This is a test notification',
      data: { key: 'value' },
    };

    await sendNotification(data);

    // Verifique se a função de agendar notificação foi chamada com os dados corretos
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      identifier: data.identifier,
      content: {
        title: data.title,
        body: data.body,
        data: data.data,
      },
      trigger: { seconds: 2 },
    });
  });
});
