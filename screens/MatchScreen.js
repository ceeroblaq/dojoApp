import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import MatchCard from '../components/MatchCard'
import TeamLineup from '../components/TeamLineup'
import { useRoute } from '@react-navigation/native'

const MatchScreen = () => {

  const { params: {
    match
  }} = useRoute()
  const teams = match.teams
  return (
    <ScrollView>
      <View className='py-4 px-2 flex flex-col justify-between'>
        <MatchCard match={match} enabled={false} />
        {
          teams.map((team, idx) => <TeamLineup key={idx} id={team.id} name={team.name}/>)
        }

      </View>
    </ScrollView>

  )
}

export default MatchScreen