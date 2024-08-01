import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ArticlesScreen from './ArticlesScreen';
import ArticleScreen from './ArticleScreen';
import FeedScreen from './FeedScreen';
import { useLayoutEffect } from 'react';
import VideosScreen from './VideosScreen';
import VideoScreen from './VideoScreen';
import ProfileScreen from './ProfileScreen';
import NotificationsScreen from './NotificationsScreen';


export default function App() {
  const Stack = createNativeStackNavigator()
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  return (
    <Stack.Navigator>
      <Stack.Screen name="Latest" component={FeedScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Articles" component={ArticlesScreen} />
      <Stack.Screen name="Article" component={ArticleScreen} />
      <Stack.Screen name="Videos" component={VideosScreen} />
      <Stack.Screen name="Video" component={VideoScreen} />
    </Stack.Navigator>
  );
}


