import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getPlayerInfo } from '../firebase'
import { TouchableOpacity } from 'react-native'

const HeroProfile = ({player, userid, handleFollow}) => {
//   const player = {
//     id: doc.id,
//     name: doc.data().name,
//     about: player.data().about,
//     college: player.data().college,
//     dob: player.data().dob,
//     email: player.data().email,
//     experience: player.data().experience,
//     fname: player.data().fname,
//     highschool: player.data().highschool,
//     hometown: player.data().hometown,
//     lname: player.data().lname,
//     phone: player.data().phone,
//     pid: player.data().pid,
//     pob: player.data().pob,
//     position: player.data().position
// }

const [isFollowing, setIsFollowing] = useState(player?.followers.some(e => e.key === userid))
  return (
    <View className='h-44 relative bg-red-500 '>
      {/* image */}
      <Image className='h-44 top-0 z-0 bg-black backdrop-opacity-80' source={{uri: player?.hero}}/>
      <View className='h-full w-full px-2 pt-4 flex flex-col absolute top-0 z-10 bg-black opacity-50'></View>
      <View className='absolute z-20 right-0 h-full w-44 flex items-center justify-center'>
        <Image className=' h-36 w-36 rounded-full bg-slate-300'  source={{uri: player?.photo}}/>
      </View>
      {/* bio data */}
      {player && <View className='h-full px-2 pt-4 flex flex-col absolute top-0 z-20 justify-start'>
        <Text className='text-white font-semibold mb-4'>{`${player?.fname} ${player?.lname}`}</Text>
        <Text className='text-white text-xs'>{player?.country}{' | '}{player?.experience}</Text>
        <Text className='text-white text-xs'>{`Career: ${player?.career} - Present`}</Text>
        <Text className='text-white text-xs'>{`Player rating:`}</Text>
        <Text className='text-white text-xs'>{`Prev game rating:`}</Text>
        <Text className='text-white text-xs'>{`Average rating:`}</Text>
        <TouchableOpacity
            className={`my-2 rounded py-2 ${(isFollowing)? 'bg-green-400' : 'bg-blue-400'}`}
            onPress={() => { 
              setIsFollowing(!isFollowing)
              handleFollow() 
            }}
            disabled={!userid}
            >
            <Text className='text-center text-white'>{`${isFollowing? 'Following' : 'Follow'}`}</Text>
          </TouchableOpacity>
      </View>}
    </View>
  )
}

export default HeroProfile