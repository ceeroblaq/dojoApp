import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getPlayerInfo } from '../firebase'

const PlayersList = ({ player, handleSelection, setIsVisible }) => {
    const nav = useNavigation()
    const id = player.id

  
    return (
        player && <TouchableOpacity
            onPress={() => {
                handleSelection(player)
                setIsVisible(false)
            }}
        >

            <View className='flex flex-row items-center space-x-2 py-2 justify-between'>
                <View className='flex flex-row items-center space-x-2'>
                    <Image className='w-6 h-6 rounded-full object-contain bg-slate-200'
                        source={{uri: player.photo}}
                    />
                    <Text className='text-xs'>{player.name}</Text>
                </View>
                {/* <Text className='text-xs'>{player.career}</Text> */}
                {/* <Text className='text-xs'>{player.matches}</Text> */}
                {/* <Text className='text-xs'>{player.rank}</Text> */}
            </View>
        </TouchableOpacity>
    )
}

export default PlayersList