import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import SportCard from '../components/SportCard'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import SportScreen from './SportScreen'
import SportsScreen from './SportsScreen'
import MatchScreen from './MatchScreen'
import PlayerScreen from './PlayerScreen'
import CompareScreen from './CompareScreen'

const DojoScreen = () => {
  const Stack = createNativeStackNavigator()
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  return (
    <Stack.Navigator>
    <Stack.Screen name="Sports" component={SportsScreen} />
      <Stack.Screen name="Match" component={MatchScreen} />
      <Stack.Screen name="Sport" component={SportScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
      <Stack.Screen name="Compare" component={CompareScreen} />
    </Stack.Navigator>
  )
}

export default DojoScreen