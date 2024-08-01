import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Header from '../components/Header'
import HeroVideo from '../components/HeroVideo'
import FeaturedVideos from '../components/FeaturedVideos'
import FeaturedArticles from '../components/FeaturedArticles'
import SegmentHeader from '../components/SegmentHeader'
import { useNavigation } from '@react-navigation/native'
import { getArticles, getComments, getRelevantComments, getUserInfo, getVidoes } from '../firebase'
import CommentList from '../components/CommentList'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'

const FeedScreen = () => {
  const navigation = useNavigation()

  useLayoutEffect(() => {

    loadUser()
    navigation.setOptions({
      title: 'Latest'
    })
  }, [])

  const [comments, setComments] = useState(null)
  const [user, setUser] = useState(null)
  const loadUser = () => {
    console.log('loading user','feedscreen')
    getUserInfo().then((res) => {
      setUser(res)
      // console.log(res.following)
      handleComments(res.following)
    })
  }

  const handleComments = (following) => {
    getRelevantComments(following).then((res) => setComments(res))
  }



  return (
    <SafeAreaView className='bg-grey-100 h-full'>
      {/* <Header title={'Latest'} /> */}
      <View className='bg-white rounded-lg m-3 flex flex-col items-center'>
        <BannerAd
          unitId='ca-app-pub-8477356470154435/5098954138'//{TestIds.BANNER}
          size={BannerAdSize.LARGE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false
          }}
        />
        {/* Segment title */}
        {/* <SegmentHeader title={'Sports news and Updates'} to={'Articles'} /> */}
        {/* Segment title */}
        {/* <SegmentHeader  title={'Featured Videos'} to={'Videos'} /> */}
        {/* Featured Videos */}
        {/* {videos && <FeaturedVideos data = {videos}/>} */}
      </View>

      {/* Comments */}
      <SegmentHeader title={'Latest from your following'} />
      {
        comments ? <CommentList data={comments} /> : <View className='w-full h-full pt-40 flex justify-start items-center'>
          <Text className='text-gray-400 font-semibold text-xs'>No new updates</Text>
        </View>
      }

    </SafeAreaView>
  )
}

export default FeedScreen