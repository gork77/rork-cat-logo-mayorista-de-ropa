import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

const DEFAULT_USER_INFO: UserInfo = {
  name: 'Usuario Mayorista',
  email: 'cliente@ejemplo.com',
  phone: '+34 600 000 000',
  address: 'Calle Principal 123, 28001 Madrid',
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [userInfo, setUserInfo] = useState<UserInfo>(DEFAULT_USER_INFO);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const stored = await AsyncStorage.getItem('userInfo');
      if (stored) {
        setUserInfo(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading user info:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveUserInfo = async (info: UserInfo) => {
    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(info));
      setUserInfo(info);
    } catch (error) {
      console.log('Error saving user info:', error);
      throw error;
    }
  };

  return {
    userInfo,
    saveUserInfo,
    isLoaded,
  };
});
