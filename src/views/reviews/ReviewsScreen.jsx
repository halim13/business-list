import React, { useState } from 'react'
import { View, Image, FlatList } from 'react-native'
import { Avatar, Divider, Text } from 'react-native-paper'
import rating from '../../constants/rating'
import moment from 'moment'

const ReviewsScreen = ({ item }) => {
    const [data, setData] = useState(item || [])

    const RenderItem = ({ item }) => {
        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <Avatar.Image source={{ uri: item?.user?.image_url }} />
                    <View style={{ marginLeft: 16 }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>{item?.user?.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={rating[item?.rating]} style={{
                                marginRight: 8,
                                width: 120,
                                height: '100%',
                                resizeMode: 'contain',
                            }} />
                            <Text style={{ fontSize: 13, color: '#000' }}>{moment(item?.time_created).fromNow()}</Text>
                        </View>
                    </View>
                </View>
                <Text>{item?.text}</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
            <FlatList
                data={data}
                extraData={data}
                renderItem={RenderItem}
                keyExtractor={(_, i) => i.toString()}
                ItemSeparatorComponent={<Divider style={{ marginVertical: 16 }} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default ReviewsScreen