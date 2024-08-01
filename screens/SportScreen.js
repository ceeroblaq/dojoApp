import { View, Text } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Matches from '../components/Matches'
import { getUserInfo } from '../firebase'

const SportScreen = () => {

  const navigation = useNavigation()

  const { params: {
    league,
    sport,
    leagues
  } } = useRoute()
  const [isplayer, setIsPlayer] = useState(false)

  const handlePlayerStatus = async () => {
    const user = await getUserInfo()
    console.log('is player', user.isplayer)
    setIsPlayer(user.isplayer)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: sport
    })
    handlePlayerStatus()

  }, [])

  return (
    <View className='p-4'>
      <Matches league={league} leagues={leagues} isplayer={isplayer} />
    </View>
  )
}

export default SportScreen