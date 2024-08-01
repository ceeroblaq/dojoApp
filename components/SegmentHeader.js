import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ArrowRightIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'

const SegmentHeader = ({ title, to }) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity onPress={() => {
      navigation.navigate(to, {})
    }
    }>
      <View className='flex flex-row py-2 px-4 items-center w-full'>
        <Text className='flex-1 font-semibold'>{title}</Text>
        {to && <ArrowRightIcon color={'#000000'} />}
      </View>
    </TouchableOpacity>
  )
}

export default SegmentHeader