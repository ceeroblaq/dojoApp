import { View, Text } from 'react-native'
import React from 'react'

const PlayerData = ({head, stat }) => {
    const items = [stat.d,stat.l,stat.ga,stat.gd,stat.pts]
    return (
        <View className={`w-max flex flex-row justify-between bg-white py-2 px-2 ${head? 'border-b-[1px] border-gray-200':''}`}>
            <Text className='w-[40%]'>{stat.name}</Text>
            <View className='flex-1 flex flex-row justify-between'>
                {items.map((i, idx)=><Text key={idx} className='text-stone-600'>{i}</Text>)}
            </View>
        </View>
    )
}

export default PlayerData