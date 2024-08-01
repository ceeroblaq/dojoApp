import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ArrowLeftIcon, ArrowRightOnRectangleIcon, BellAlertIcon, BellIcon, UserCircleIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'


const Header = ({ title, back }) => {
  const navigation = useNavigation()

  return (
    <View className='h-14 bg-red-500 flex flex-row items-center px-4 space-x-4'>
      {back &&
        <TouchableOpacity onPress={() => {
          navigation.goBack
        }}>
          <ArrowLeftIcon size={30} color='white' />
        </TouchableOpacity>
      }
      <Text className='text-white font-semibold text-3xl flex-1'>{title}</Text>
      {!back &&
        <View className='flex flex-row items-center space-x-4'>
          <TouchableOpacity onPress={() => {
            navigation.navigate('Notifications', {})
          }}>
            <BellIcon size={30} color='white' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigation.navigate('Account', {})
          }}>
            <UserCircleIcon size={30} color='white' />
          </TouchableOpacity>
        </View>
      }
    </View>
  )
}

export default Header