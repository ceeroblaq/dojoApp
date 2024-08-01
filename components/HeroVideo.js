import { View, Text, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Video, ResizeMode } from 'expo-av';

const HeroVideo = ({article}) => {
  const navigation = useNavigation()
  const video = useRef(null)
  const [status, setStatus] = useState({})
  const title = article.title
  const date = article.date
  const thumb = article.thumb
  const body = article.body
  const uri = article.video

  return (
    <TouchableOpacity className='bg-slate-600'
    onPress={()=>{navigation.navigate('Article',{
      title, date, thumb, body, uri
    })}}>

    {video && <Video
      ref = {video}
      className='h-48'
      source={{
        uri: uri
      }}
      useNativeControls = {false}
      resizeMode={ResizeMode.COVER}
      isLooping
      shouldPlay
      isMuted
      onPlaybackStatusUpdate={status => setStatus(() => status)}
    />
    }
        
    </TouchableOpacity>
  )
}

export default HeroVideo