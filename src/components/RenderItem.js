import React, { useMemo } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { Divider, Text } from 'react-native-paper'
import ImageCompany from './ImageCompany'
import rating from '../constants/rating'
import { convertCurrency } from '../utils/commonUtils'

const RenderItem = ({ item, navigation }) => {
    return useMemo(() => (
        <>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                }}
                onPress={() => navigation.navigate('DetailScreen', { item })}
            >
                <View>
                    <ImageCompany src={item?.image_url} />
                    <Text style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 0,
                        padding: 8,
                        backgroundColor: '#00000066',
                        color: '#fff',
                    }}>{Math.round(item?.distance / 100) / 10} mi</Text>
                    <Text style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        padding: 8,
                        borderRadius: 8,
                        backgroundColor: item?.is_closed ? '#ff000066' : '#00ff0066',
                        color: '#fff',
                    }}>{item?.is_closed ? 'closed' : 'open'}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', color: '#0073bb', }}>{item?.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Image source={rating[item?.rating]} style={{
                                marginRight: 8,
                                width: 120,
                                height: '100%',
                                resizeMode: 'contain',
                            }} />
                            <Text style={{ flex: 1, fontSize: 13 }}>{convertCurrency(item?.review_count)} reviews</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'right', fontSize: 13 }}>{item?.price}</Text>
                        <Text style={{ color: '#0073bb', textAlign: 'right', fontSize: 13 }}>{item?.categories?.map(map => map.title).join(', ')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <Divider style={{ marginBottom: 8 }} />
        </>
    ), [item])
}

export default RenderItem