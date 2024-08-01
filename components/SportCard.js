import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { useNavigation } from '@react-navigation/native'
import { getLeagues } from '../firebase'

const SportCard = ({ sport }) => {
    const nav = useNavigation()
    const [leagues, setLeagues] = useState([])
    useEffect(() => {
      getLeagues(sport.id).then((res) => {
        setLeagues(res)
      })
    }, [])
    return (
        <View key={sport.id} className="w-1/2 p-4">
            <TouchableOpacity
            onPress={()=>{
                nav.navigate('Sport', {sportId: sport.id, sport: sport.name, leagues: leagues})
            }}>
                <View className="w-max h-36 rounded-3xl flex flex-col justify-center items-center space-y-4 bg-white">
                    <Image className='w-16 h-16 object-contain' source={logo}/>
                    <Text>{sport.name}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default SportCard