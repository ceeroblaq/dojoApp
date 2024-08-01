import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import FeaturedArticles from './FeaturedArticles'
import PlayerData from './PlayerData'

const PlayerProfileData = ({ id }) => {

    const [active, setActive] = useState(0)
    const [player, setPlayer] = useState(null)

    const titles = []//[{ title: 'Overview'}, { title: 'Stats'}]
    const statsHeader = { logo: '', name: 'Team', d: 'D', l: 'L', ga: 'Ga', gd: 'Gd', pts: 'Pts' }
    const stats = [
        { logo: '', name: 'Team Name', d: '2', l: '1', ga: '6', gd: '23', pts: '36' },
        { logo: '', name: 'Team Name', d: '2', l: '1', ga: '6', gd: '23', pts: '36' },
        { logo: '', name: 'Team Name', d: '2', l: '1', ga: '6', gd: '23', pts: '36' },
        { logo: '', name: 'Team Name', d: '2', l: '1', ga: '6', gd: '23', pts: '36' },
        { logo: '', name: 'Team Name', d: '2', l: '1', ga: '6', gd: '23', pts: '36' },
        { logo: '', name: 'Team Name', d: '2', l: '1', ga: '6', gd: '23', pts: '36' },
        { logo: '', name: 'Team Name', d: '2', l: '1', ga: '6', gd: '23', pts: '36' },
        { logo: '', name: 'Team Name', d: '2', l: '1', ga: '6', gd: '23', pts: '36' },
        { logo: '', name: 'Team Name', d: '2', l: '1', ga: '6', gd: '23', pts: '36' },
        { logo: '', name: 'Team Name', d: '2', l: '1', ga: '6', gd: '23', pts: '36' },
        { logo: '', name: 'Team Name', d: '2', l: '1', ga: '6', gd: '23', pts: '36' }
    ]


  


    return (
        <View className='px-2'>
            <View className='flex flex-row justify-around rounded-3xl mt-4 bg-white'>
                {
                    titles.map((item, i) => {
                        return (
                            <TouchableOpacity key={i}
                                onPress={() => {
                                    setActive(i)
                                }}
                                className={`${i === active ? 'bg-red-500' : 'bg-white'} flex-1 flex items-center rounded-3xl py-4`}>
                                <Text className={`${i === active ? 'color-white' : ''}`}>{item.title}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>

            <View className="w-maxrounded-3xl flex flex-column justify-between">
                <PlayerData head={true} stat={statsHeader} />
                <ScrollView className=' max-h-28 divide-y-[1px] divide-gray-400 ' >
                    {stats.map((stat, idx) => <PlayerData key={idx} head={false} stat={stat} />)}
                </ScrollView>
            </View>
            
        </View>
    )
}

export default PlayerProfileData