import React, {VFC, useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Button,
} from 'react-native';

import {
  setNotificationHandler,
  requestPermissionsAsync,
  getPermissionsAsync,
  scheduleNotificationAsync,
  getAllScheduledNotificationsAsync,
  NotificationPermissionsStatus,
  NotificationRequest,
} from 'expo-notifications';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App: VFC = () => {
  const [notificationPermissionStatus, setNotificationPermissionsStatus] =
    useState<NotificationPermissionsStatus>();
  const [notificationRequestList, setNotificationRequestList] = useState<
    NotificationRequest[]
  >([]);

  const handlePressRequestPermissions = async () => {
    const status = await requestPermissionsAsync();
    setNotificationPermissionsStatus(status);
  };

  const handlePressScheduleNotification = async () => {
    await scheduleNotificationAsync({
      content: {
        title: 'title',
        body: 'body',
      },
      trigger: {
        seconds: 10, // 10秒後
      },
    });

    const list = await getAllScheduledNotificationsAsync();
    setNotificationRequestList(list);
  };

  const handlePressGetSchedules = async () => {
    const list = await getAllScheduledNotificationsAsync();
    setNotificationRequestList(list);
  };

  useEffect(() => {
    getPermissionsAsync().then(status => {
      setNotificationPermissionsStatus(status);
    });
    getAllScheduledNotificationsAsync().then(list => {
      setNotificationRequestList(list);
    });
  }, []);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <SafeAreaView style={styles.safe_area_view}>
        <Button
          title="Request Permissions"
          onPress={handlePressRequestPermissions}
        />
        <Button
          title="Schedule Notification"
          onPress={handlePressScheduleNotification}
        />
        <Button title="Get Schedules" onPress={handlePressGetSchedules} />

        <View style={styles.section}>
          <Text style={styles.section_title}>
            Notificatoin Permission Status
          </Text>
          <View style={styles.info_box}>
            <Text>{JSON.stringify(notificationPermissionStatus, null, 2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.section_title}>Notification Request List</Text>
          <View style={styles.info_box}>
            <Text>
              {notificationRequestList.length > 0
                ? JSON.stringify(notificationRequestList, null, 2)
                : 'None'}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safe_area_view: {
    flex: 1,
    paddingVertical: 32,
  },
  section: {
    marginTop: 16,
    alignItems: 'center',
  },
  section_title: {
    fontSize: 16,
  },
  info_box: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    width: '80%',
    padding: 8,
  },
});

export default App;
