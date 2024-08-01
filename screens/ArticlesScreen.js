import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import HeroVideo from '../components/HeroVideo'
import FeaturedArticles from '../components/FeaturedArticles'
import { useNavigation } from '@react-navigation/native'
import { getArticles, getVidoes } from '../firebase'

const ArticlesScreen = () => {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'News & Updates'
    })
  }, [])

  const [articles, setArticles] = useState(null)
  const [videos, setVideos] = useState(null)
  const [video, setVideo] = useState(null)

  useEffect(() => {
    getArticles().then((res) => {
      setArticles(res)
      setVideo(res.filter(vid => vid.featured && vid.video.length > 1)[0])
    })
    getVidoes().then((res) => {
      setVideos(res)
    })
  }, [])

  return (
    <SafeAreaView className='bg-grey-100'>
      {/* <Header title={'Latest'} /> */}
      {video && <HeroVideo article={video} />}
      <ScrollView>
        <View>
          {/* Segment title */}
          {/* <SegmentHeader  title={'Featured Videos'} to={'Videos'} /> */}

          {/* Featured Videos */}
          {/* {videos && <FeaturedVideos data = {videos}/>} */}

          {/* Segment title */}
          {/* <SegmentHeader title={'Featured Articles'}/> */}

          {/* Articles */}
          {articles && <FeaturedArticles data={articles} />}
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default ArticlesScreen