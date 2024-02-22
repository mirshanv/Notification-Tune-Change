import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { Picker } from '@react-native-picker/picker';

// Import your sound files statically
import testSound from './assets/test.wav';
import test1Sound from './assets/test1.wav';
import test2Sound from './assets/test2.wav';
import test3Sound from './assets/test3.wav';

export default function App() {
  const [selectedTune, setSelectedTune] = useState('default');

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  };

  const handleChangeTune = async () => {
    switch (selectedTune) {
      case 'default':
        await Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldPlaySound: true,
            shouldShowAlert: true,
            shouldSetBadge: false,
          }),
        });
        break;
      case 'silent':
        await Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldPlaySound: false,
            shouldShowAlert: true,
            shouldSetBadge: false,
          }),
        });
        break;
      case 'custom':
        await playCustomTune(testSound);
        break;
      case 'custom1':
        await playCustomTune(test1Sound);
        break;
      case 'custom2':
        await playCustomTune(test2Sound);
        break;
      case 'custom3':
        await playCustomTune(test3Sound);
        break;
      default:
        break;
    }
  };

  const playCustomTune = async (soundFile) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play notification tune', error);
    }
  };

  const handleTestNotification = async () => {
    let shouldPlaySound = true;
    switch (selectedTune) {
      case 'default':
        shouldPlaySound = true;
        break;
      case 'silent':
        shouldPlaySound = false;
        break;
      case 'custom':
        await playCustomTune(testSound);
        break;
      case 'custom1':
        await playCustomTune(test1Sound);
        break;
      case 'custom2':
        await playCustomTune(test2Sound);
        break;
      case 'custom3':
        await playCustomTune(test3Sound);
        break;
      default:
        break;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification!',
      },
      trigger: null,
      sound: shouldPlaySound ? 'default' : null, 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      <Text style={styles.subtitle}>Notification Tune:</Text>
      <Picker
        selectedValue={selectedTune}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setSelectedTune(itemValue)}
      >
        <Picker.Item label="Default Tune" value="default" />
        <Picker.Item label="Silent" value="silent" />
        <Picker.Item label="Custom Tune" value="custom" />
        <Picker.Item label="Custom Tune1" value="custom1" />
        <Picker.Item label="Custom Tune2" value="custom2" />
        <Picker.Item label="Custom Tune3" value="custom3" />
      </Picker>
      <Button title="Save Settings" onPress={handleChangeTune} />
      <View style={styles.separator}></View>
      <Button title="Test Notification" onPress={handleTestNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    width: '80%',
    marginBottom: 20,
  },
  separator: {
    marginVertical: 20,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '80%',
  },
});


