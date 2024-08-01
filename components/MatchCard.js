import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import logo from '../assets/icon.png'
import { useNavigation } from '@react-navigation/native'

const MatchCard = ({match, enabled, setMatch}) => {
    const nav = useNavigation()
    const teamA = match.homeTeam
    const teamB = match.awayTeam
    const scoreA = match.homeScore.length
    const scoreB = match.awayScore.length
    return (
        <TouchableOpacity
        disabled={!enabled}
            onPress={() => {
                setMatch(match)
                // nav.navigate('Match',{match: match})
            }}>
            <View className="w-max rounded-3xl flex flex-row justify-between items-center bg-white px-4 py-2 my-1">
                {/* Team A */}
                <View className='flex flex-col items-center space-y-2'>
                    <Image className='w-12 h-12 object-contain'
                        source={logo}
                    />
                    <Text>{teamA}</Text>

                </View>

                {/* Scores */}
                <View className='flex flex-col justify-between items-center space-y-4'>
                    <Text className='text-xs font-semibold'>{match.date}</Text>
                    <Text>{`${scoreA} : ${scoreB}`}</Text>
                    <Text>{match.time}</Text>

                </View>

                {/* Team B */}
                <View className='flex flex-col items-center space-y-2'>
                    <Image className='w-12 h-12 object-contain'
                        source={logo}
                    />
                    <Text>{teamB}</Text>

                </View>
            </View>
        </TouchableOpacity>
    )
}

export default MatchCard