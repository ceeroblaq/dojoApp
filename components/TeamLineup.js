import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import logo from '../assets/team_logo.png'
import LineupItem from './LineupItem'
import { getTeamInfo, joinTeam } from '../firebase'
import { PlusCircleIcon } from 'react-native-heroicons/outline'
import { TouchableOpacity } from 'react-native'

const TeamLineup = ({ id, name, setMatch, onJoin, isplayer }) => {

  const [team, setTeam] = useState(null)

  useEffect(() => {
    getTeamInfo(id).then((res) => {
      setTeam(res)
    })
  }, [])

  return (
    <View className="w-max rounded-xl flex flex-col bg-white px-4 py-2 my-2">
      <View className='py-2 flex flex-row items-center justify-between space-x-2 border-b border-gray-200'>
        <Text className='font-bold text-base'>{name}</Text>
        {isplayer && <TouchableOpacity
          className='flex flex-row justify-center items-center space-x-1'
          onPress={() => {
            joinTeam(id, onJoin)
          }}>
          <Text className=' text-base'>Join</Text>
          <PlusCircleIcon />
        </TouchableOpacity>}
      </View>
      {
        team && team.players.map((player, idx) => <LineupItem key={idx} id={player.id} setMatch={setMatch} />)
      }

    </View>
  )
}

export default TeamLineup