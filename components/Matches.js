import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import MatchCard from './MatchCard'
import { getGames } from '../firebase'
import Modal from "react-native-modal";
import TeamLineup from './TeamLineup';
import { SelectList } from 'react-native-dropdown-select-list'
import Toast from 'react-native-toast-message';

const Matches = ({ sportId, leagues, isplayer }) => {

  const [matches, setMatches] = useState(null)
  const [match, setMatch] = useState(null)
  const [league, setLeague] = useState(leagues[0]?.value)
  const [lid, setLeagueID] = useState(leagues[0]?.key)

  const handleGames = (lid) => {
    lid && getGames(lid).then((res) => {
      setMatches(res)
    })
  }

  useEffect(() => {
    handleGames(lid)
  }, [])

  const onJoin = (ok) => {
    if (ok) {
      setMatch(null)
      Toast.show({
        type: 'success',
        text1: 'Hi',
        text2: 'Team joined successfully'
      });

    } else {
      Toast.show({
        type: 'success',
        text1: 'Hi',
        text2: "Looks like you aren't a player"
      });
    }
  }

  return (
    <View className='w-max'>

      <SelectList
        defaultOption={leagues[0]}
        setSelected={(val) => {
          setLeagueID(val)
          handleGames(val)
        }}
        data={leagues}
        placeholder='Select Leagues'
      />

      <ScrollView className='mt-2'>

        {matches?.map((match, idx) => <MatchCard key={idx} match={match} enabled={true} setMatch={setMatch} />)}
        {match && <Modal isVisible={true} onBackdropPress={() => setMatch(null)}>
          <View className=''>
            {
              match.teams.map((team, idx) => <TeamLineup key={idx} id={team.id} name={team.name} setMatch={setMatch} onJoin={onJoin} isplayer={isplayer} />)
            }
          </View>
        </Modal>}
      </ScrollView>
      <Toast />
    </View>
  )
}

export default Matches