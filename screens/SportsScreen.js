import { View, Text, SafeAreaView, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import SportCard from '../components/SportCard'
import { useNavigation } from '@react-navigation/native'
import { getSports } from '../firebase'
import { ArrowRightIcon } from 'react-native-heroicons/solid'

const SportsScreen = () => {

  const [sports, setSports] = useState(null)

  useEffect(() => {
    getSports().then((res) => {
      setSports(res)
    })
  }, [])

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Dojo'
    })
  }, [])

  return (
    <SafeAreaView>
      <View className="flex flex-col h-full">

        <TouchableOpacity
        onPress={()=>{navigation.navigate('Compare')}}
          className='mt-8 mx-4 border border-red-500 rounded-xl py-4 px-8 bg-orange-50 flex flex-row items-center justify-evenly space-x-8'>
          <Text className='text-red-500'>Compare and view player stats</Text>
          <ArrowRightIcon color={'#e91e63'} />
        </TouchableOpacity>
        <ScrollView>
          <View className='flex flex-row flex-wrap justify-center'>
            {sports?.map((sport, idx) => { return (<SportCard key={idx} sport={sport} />) })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default SportsScreen