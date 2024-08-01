import { View, Text, Image } from 'react-native'
import React from 'react'
import logo from '../assets/logo.png'

const CommentCard = ({ data }) => {
    const date = data.date
    const body = data.body
    const poster = data.poster

    return (
        <View className='flex flex-col space-y-1 bg-white p-2 rounded-md my-1'>
            <View className='flex flex-row flex-1 '>
                <View className='flex-1 flex flex-row items-center space-x-2 '>
                    {/* <Image className='w-5 h-5 ' source={logo} /> */}
                    <Text className=' font-normal text-[12px]'>{poster}</Text>
                </View>
                <Text className=' font-thin text-[8px]'>{date}</Text>
            </View>
            <Text className='font-light text-[12px] px-1 italic bg-gray-50 py-2 rounded'>{body}</Text>
        </View>
    )
}

export default CommentCard