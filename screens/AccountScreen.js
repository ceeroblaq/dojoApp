import { View, Text, Image, Button } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import ProfileScreen from './ProfileScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import EditProfileScreen from './EditProfileScreen'
import { getUserInfo } from '../firebase'
import Toast from 'react-native-toast-message';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const AccountScreen = ({ route }) => {
    const Stack = createNativeStackNavigator()
    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    },
        []
    )

    const relay = () => {
        route.params.handleAuth()
    }

    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={ProfileScreen} initialParams={{ relay: relay }} />
            <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
        </Stack.Navigator>
    )
}

export default AccountScreen