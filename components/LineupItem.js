import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getPlayerInfo } from '../firebase'

const LineupItem = ({ id, setMatch }) => {
    const nav = useNavigation()
    const [player, setPlayer] = useState(null)

    const loadPlayer = () => {
        
        getPlayerInfo(id).then((res) => {
        // console.log("plyr",res)
            setPlayer(res)
        })
    }

    useEffect(() => {
        loadPlayer()
    }, [])

    return (
        player && <TouchableOpacity
            onPress={() => {
                setMatch(null)
                nav.navigate('Player', { id: player.id, name: player.name })
            }}
        >

            <View className='flex flex-row items-center space-x-2 py-2 justify-between'>
                <View className='flex flex-row items-center space-x-2'>
                    <Image className='w-6 h-6 rounded-full object-contain bg-slate-200'
                        source={{ uri: player?.photo??''}}
                    />
                    <Text className='text-xs'>{player.name}</Text>
                </View>
                <Text className='text-xs'>{player.career}</Text>
                {/* <Text className='text-xs'>{player.matches}</Text> */}
                {/* <Text className='text-xs'>{player.rank}</Text> */}
            </View>
        </TouchableOpacity>
    )
}

export default LineupItem