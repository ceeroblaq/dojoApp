import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const VideoCard = ({video}) => {
    const navigation = useNavigation()

    const title=video.title
    const date = video.date
    const thumb = video.thumb

    return (
        <TouchableOpacity className="relative mx-1"
        // onPress={()=>{navigation.navigate('Video',{})}}
        >
            <Image source = {{
                uri: thumb
            }}
            className='h-28 w-28 rounded'
            />
            <Text className='absolute bottom-1 left-1 text-white font-bold'  numberOfLines={1}>{title}</Text>
        </TouchableOpacity>
    )
}

export default VideoCard