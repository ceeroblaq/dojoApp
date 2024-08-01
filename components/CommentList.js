import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import CommentCard from './CommentCard'

const CommentList = ({data}) => {
 
    return (
        <ScrollView className='px-1'>
            {/* Comment Card */}
            {
                data.map((item,idx) => {
                    return (
                        <CommentCard key={idx} data={item}/>
                    )
                })
            }
        </ScrollView>
    )
}

export default CommentList