import { View, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import { Video, ResizeMode } from 'expo-av';

const VideoScreen = ({route}) => {
  const { uri } = route.params

  const video = useRef(null)
  const [status, setStatus] = useState({})

  return (
    <View className='bg-slate-600'>
    {video && <Video
      ref={video}
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
    />}
    </View>
  )
}

export default VideoScreen