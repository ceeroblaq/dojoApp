import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Divider } from '@rneui/themed'


const FacebookButton = () => {
    return (
        <View className='hidden'>

            <Text className='px-2 text-gray-500 font-light text-xs text-center'>or connect with</Text>
            <View className='my-8 flex flex-row items-center justify-center'>
                <TouchableOpacity
                    className=' bg-blue-600 py-4 px-2 rounded'
                    onPress={() => {
                        facebookSignIn()

                    }}>
                    <Text className='text-white text-center font-medium'>
                        Continue with Facebook
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default FacebookButton