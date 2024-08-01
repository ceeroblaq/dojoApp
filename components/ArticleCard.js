import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const ArticleCard = ({ article }) => {
  const title = article.title
  const date = article.date
  const thumb = article.thumb
  const body = article.body
  const uri = article.video
  const navigation = useNavigation()
  return (
    <TouchableOpacity className="flex flex-row bg-white rounded m-1"
    onPress={()=>{
      navigation.navigate('Article',{
        title, date, thumb, body, uri
      })
    }}>
      <Image source={{
        uri: thumb
      }} className='m-1 h-20 w-20 rounded'/>
      <View className=' flex flex-col p-2 flex-1'>
        <Text className='font-bold'>{title}</Text>
        <Text className='font-light text-xs' numberOfLines={2}>{body}</Text>
      </View>

    </TouchableOpacity>
  )
}

export default ArticleCard