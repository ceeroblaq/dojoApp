import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import * as Linking from 'expo-linking';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import HeroProfile from '../components/HeroProfile'
import PlayerProfileData from '../components/PlayerProfileData'
import { useNavigation, useRoute } from '@react-navigation/native'
import { auth, dataPayment, followUnfollow, getArticles, getComments, getPlayerInfo, getUserInfo, checkPlayerPaidFor, requestData } from '../firebase'
import CommentInput from '../components/CommentInput'
import CommentList from '../components/CommentList'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

const PlayerScreen = ({ toggled }) => {

  const { params } = useRoute()
  const navigation = useNavigation()
  const [comments, setComments] = useState(null)
  const [player, setPlayer] = useState(null)
  const [paid, setPaid] = useState(false)
  const [req, setDataReq] = useState(0)
  const [message, setRequestMessage] = useState('')

  const [user, setUser] = useState(null)
  const loadUser = async () => {
    console.log('loading user', 'playerscreen')
    const u = await getUserInfo()
    setUser(u)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: params?.name
    })
  }, [])

  const handleComments = () => {
    const id = params ? params?.id : user.id
    getComments(id).then((res) => setComments(res))
  }

  const loadPlayer = () => {
    const id = params?.id 
    getPlayerInfo(id).then((res) => {
      const data = res.datareqs
      // console.log(data)
      const foundItem = data.find(obj => obj.pid === id && obj.uid === auth.currentUser.uid);

      if (foundItem) {
        const key = foundItem.status;
        setDataReq(key)
      } else {
        console.log("user was not found in the requests.")
      }
      setPlayer(res)
    })
  }

  const onRequest = () => {
    loadPlayer()
  }
  const onFollow = (move) => {
    Toast.show({
      type: 'success',
      text1: move,
      // text2: move
    })
    loadPlayer()
  }

  const handleDataRequest = () => {
    const data = {
      pid: params?.id,
      message: message,
      player: `${player?.fname} ${player?.lname}`,
      uname: user?.name,
      pemail: player?.email,
      uemail: user?.email
    }
    requestData(data, onRequest)
  }
  const handleFollow = () => {
    const data = {
      pid: params.id,
      uid: user.id
    }
    followUnfollow(data, onFollow)
  }

  const loadPageData = async () => {
    await loadPlayer()
    await handleComments()
    await loadUser()
    const paid = await checkPlayerPaidFor(params?.id)
    setPaid(paid)
  }

  const handlePayment = async () => {
    const pid = params?.id 
    if(pid){
      const data = await dataPayment(pid)
      console.log("stripe", data)
      Linking.openURL(data);
      const paid = await checkPlayerPaidFor(params?.id)
      setPaid(paid)
    }else{

    }
}

  useEffect(() => {
    loadPageData()
  }, [])

  return (
    <View className={` ${toggled ? '' : 'h-full'} flex flex-col`}>
      <HeroProfile player={player} userid={user?.id} handleFollow={handleFollow} />
      {paid?<View className=''>
        {/* // stats request  */}
          {req === 0 && <TextInput className="mx-2 mt-2 p-4 cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
            placeholder="Request message"
            multiline
            maxLength={140}
            onChangeText={text => setRequestMessage(text)}
          />}
          <TouchableOpacity
            className={`mx-4 my-2 rounded px-4 py-2 ${(req===0 && message.trim() ==='')? 'bg-gray-400' :req === 0 ? 'bg-red-500' : req === 1 ? 'bg-amber-400' : req === 2 ? 'bg-green-400': 'bg-red-400'}`}
            onPress={() => { handleDataRequest() }}
            disabled={req !== 0 || (req===0 && message ==='')}>
            <Text className='text-center text-white'>{`${req === 0 ? 'Request Data' : req === 1 ? 'Request Submitted' : req === 2 ? 'Data Provided':'Request Denied'}`}</Text>
          </TouchableOpacity>
      </View>:
          <TouchableOpacity
            className={`mx-4 my-2 rounded px-4 py-2 bg-green-500`}
            onPress={() => { handlePayment() }}>
            <Text className='text-center text-white font-semibold'>{`Get Player Data`}</Text>
          </TouchableOpacity>
      }

      {/* Comments */}
      <View className='flex-1'>
        {comments && <CommentList data={comments} />}
      </View>

      {/* commenting */}
      <View className=''>
        <CommentInput
        user={user} id={params ? params?.id : user.id}
        handleComments={handleComments} />
        </View>
        <Toast />
    </View>
  )
}

export default PlayerScreen