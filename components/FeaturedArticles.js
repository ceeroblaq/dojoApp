import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import ArticleCard from './ArticleCard'
import SegmentHeader from './SegmentHeader'

const FeaturedArticles = ({data}) => {
    
    
    return (
        <View>
            {/* Artcle Card */}
            {
                data.map((item, idx) => {
                    return (
                        <ArticleCard key={idx} article={item} />
                    )
                })
            }
        </View>
    )
}

export default FeaturedArticles