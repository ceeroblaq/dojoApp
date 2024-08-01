import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { postComment } from '../firebase'
import { PaperAirplaneIcon } from 'react-native-heroicons/solid'

const CommentInput = ({user, id, handleComments}) => {
  console.log('commenting user',user)
    const [comment, onChangeComment] = useState('')
    const [disabled, setDisabled] = useState(false)

    const postPosting = () => {
      onChangeComment('')
      setDisabled(false)
    }

    const post = () => {
      setDisabled(true)
      const data = {
        body: comment,
        posterimage: '',
        level: 1,
        refid: id,
        posterid: user.id,
        poster: user.fname
      }
      // console.log(data)
      postComment(data, handleComments).then(() => postPosting())
    }

  return (
    <View className='mb-0 flex flex-row items-end'>
      <TextInput className="p-4 relative flex-1 cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
        placeholder="Say something.."
        value={comment}
        disabled={disabled}
        multiline
        maxLength={140}
        onChangeText={text => onChangeComment(text)}
      />

      <TouchableOpacity
        disabled={disabled || comment === ''}
        onPress={() => {
          post()
        }} className='m-1 py-2 px-2 bg-green-900 rounded'>
        <PaperAirplaneIcon color={'rgba(255, 255, 255, 1)'} />
      </TouchableOpacity>
    </View>
  )
}

export default CommentInput