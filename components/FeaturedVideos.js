import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import VideoCard from './VideoCard'
import SegmentHeader from './SegmentHeader'

const FeaturedVideos = ({data}) => {
    
    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 5,
                    paddingTop: 10
                }}>
                {/* Video Card */}

                {
                    data.map((item, idx) => {
                        return (
                            <VideoCard key={idx} video= {item} />
                        )
                    })
                }
            </ScrollView>

        </View>
    )
}

export default FeaturedVideos