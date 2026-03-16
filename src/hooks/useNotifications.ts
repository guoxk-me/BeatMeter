import { useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 配置通知处理
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: false,
  }),
});

export function useNotifications() {
  // 设置通知权限和配置
  const setupNotifications = useCallback(async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permission not granted');
        return false;
      }

      // 设置渠道 (Android)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('metronome', {
          name: '节拍器',
          importance: Notifications.AndroidImportance.LOW,
          vibrationPattern: [0],
          sound: undefined,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        });
      }

      return true;
    } catch (error) {
      console.error('Notification setup error:', error);
      return false;
    }
  }, []);

  // 显示播放中通知
  const showPlayingNotification = useCallback(async (bpm: number) => {
    try {
      // 先取消之前的通知
      await Notifications.dismissAllNotificationsAsync();
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎵 BeatMeter 正在播放',
          body: `${bpm} BPM`,
          data: { action: 'playing', bpm },
          sticky: true,
          autoDismiss: false,
          ...(Platform.OS === 'android' && {
            channelId: 'metronome',
          }),
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Show notification error:', error);
    }
  }, []);

  // 取消通知
  const dismissNotification = useCallback(async () => {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('Dismiss notification error:', error);
    }
  }, []);

  // 空函数，用于兼容
  const setupNotificationCategories = useCallback(async () => {
    // 通知分类功能在较新版本的expo-notifications中可能有变化
    // 这里留空，后续可以根据需要实现
  }, []);

  return {
    setupNotifications,
    setupNotificationCategories,
    showPlayingNotification,
    dismissNotification,
  };
}
