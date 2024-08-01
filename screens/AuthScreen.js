import { View, Text, SafeAreaView } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import LoginScreen from '../pages/LoginScreen'
import SignUpScreen from '../pages/SignUpScreen'

const AuthScreen = ({handleAuth}) => {
  const Stack = createNativeStackNavigator()
  const navigation = useNavigation()

  useLayoutEffect(() => {
    // navigation.setOptions({
    //   headerShown: false
    // })
  }, [])
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} initialParams={{ handleAuth: handleAuth }}/>
      <Stack.Screen name="Sign up" component={SignUpScreen} />
    </Stack.Navigator>
  )
}

export default AuthScreen