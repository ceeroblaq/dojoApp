import { View, Text, SafeAreaView, Image, ScrollView } from 'react-native'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Header from '../components/Header'
import { Video, ResizeMode } from 'expo-av';

const ArticleScreen = () => {
  const navigation = useNavigation()
  const video = useRef(null)
  const [status, setStatus] = useState({})
  
  const { params: {
    title, date, thumb, body, uri
  } } = useRoute()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title
    })
  }, [])

  return (

    <SafeAreaView className='bg-grey-100'>
      <View className='bg-slate-600 h-48'>

        {video && uri.length > 1 ? <Video
          ref={video}
          className='h-48 fixed top-0 z-10'
          source={{
            uri: uri
          }}
          useNativeControls={false}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay
          isMuted
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      :

      <Image source={{
        uri: thumb
      }} className='h-48 fixed top-0 z-0' />
      }
      </View>
      <ScrollView className='px-4 py-8'>
        {/* <Header title={title} back={true} /> */}
        <Text>{body}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ArticleScreen