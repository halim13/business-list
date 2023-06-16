import React, { useState, useEffect } from 'react'
import { Image, StatusBar, TouchableOpacity, View } from 'react-native'
import { ActivityIndicator, Appbar, Button, Divider, Portal, Text } from 'react-native-paper'
import { ImageSlider } from 'react-native-image-slider-banner'
import { convertCurrency, convertCurrency2 } from '../../utils/commonUtils'
import rating from '../../constants/rating'
import Modal from '../../components/Modal'
import days from '../../constants/days'
import Icon from 'react-native-vector-icons/FontAwesome'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { InfoScreen } from '../../views/info'
import { ReviewsScreen } from '../../views/reviews'
import TabBar from '../../components/TabItem'
import { requestGet } from '../../utils/requestUtils'
import { BASE_URL } from '../../constants/config'

const TODAY = new Date()
const getDay = TODAY.getDay()
const Tab = createMaterialTopTabNavigator()

const DetailScreen = ({ route, navigation }) => {
    const [openModal, setOpenModal] = useState(false)
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('idle')
    const [data, setData] = useState(null)
    const [reviews, setReviews] = useState([])

    const toggleModal = () => setOpenModal(!openModal)

    const { item } = route?.params || {}
    // const item = businessItem
    const hours = data?.hours?.[0]

    useEffect(() => {
        fetchData()
        return () => null
    }, [])

    fetchData = async () => {
        try {
            setStatus('fetching')
            setLoading(true)
            const getData = await requestGet(`${BASE_URL}/${item?.id || 'nRO136GRieGtxz18uD61DA'}`)
            const getReviews = await requestGet(`${BASE_URL}/${item?.id || 'nRO136GRieGtxz18uD61DA'}/reviews`)
            setData(getData)
            setReviews(getReviews.reviews || [])
            setLoading(false)
            setImages(getData?.photos?.map(photo => ({ img: photo })))
            setStatus('ready')
        } catch (error) {
            setLoading(false)
            setStatus('error')
        }
    }

    if (status === 'idle' || status === 'fetching') {
        return <View style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
        }}>
            <ActivityIndicator size={'large'} color='#eb443b' />
        </View>
    }

    if (status === 'error') {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginBottom: 16 }}>Oops, something went wrong, please try again!</Text>
            <Button mode='contained' onPress={fetchData}>reload</Button>
        </View>
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar translucent backgroundColor={'#0000'} />
            <View style={{ backgroundColor: '#000000' }}>
                {
                    !!images?.length && <ImageSlider
                        data={images}
                        autoPlay
                        closeIconColor='#fff'
                        timer={3000}
                        caroselImageStyle={{ resizeMode: 'cover', height: 250, }}
                        caroselImageContainerStyle={{ opacity: 0.7 }}
                        showIndicator={false}
                    />
                }
                <View style={{ position: 'absolute', bottom: 24, left: 16 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 24, marginBottom: 24 }}>{data?.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        {
                            !!data?.rating && <Image source={rating[data?.rating]} style={{
                                marginRight: 8,
                                width: 120,
                                height: '100%',
                                resizeMode: 'contain',
                            }} />
                        }
                        <Text style={{ flex: 1, fontSize: 13, color: '#fff' }}>{convertCurrency(data?.review_count)}</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: '#0000', position: 'absolute', top: StatusBar.currentHeight, flexDirection: 'row', alignItems: 'center' }}>
                    <Appbar.BackAction color='#fff' onPress={() => navigation.goBack()} />
                </View>
            </View>
            <View style={{ padding: 16 }}>
                <Text>{data?.price}</Text>
                <Text>{data?.categories?.map(category => category.title)?.join(', ')}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: hours?.is_open_now ? 'rgb(0, 128, 85)' : 'rgb(224, 7, 7)', marginRight: 8 }}>{hours?.is_open_now ? 'open' : 'closed'}</Text>
                    <Text style={{ color: 'rgba(110,112,114,1)' }}>{convertCurrency2(hours?.open?.[getDay]?.start, ':')} - {convertCurrency2(hours?.open?.[getDay]?.end, ':')}</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => toggleModal()}
                >
                    <Text style={{ color: '#167e97' }}>See all hours <Icon name='arrow-right' size={15} /></Text>

                </TouchableOpacity>
            </View>
            <Divider />
            <View style={{
                flex: 1
            }}>
                <Tab.Navigator
                // tabBar={props => <TabBar {...props} />}
                >
                    <Tab.Screen name='Info' children={() => <InfoScreen item={data} toggleModal={() => toggleModal()} />}>

                    </Tab.Screen>
                    <Tab.Screen name='Reviews' children={() => <ReviewsScreen item={reviews} />} />
                </Tab.Navigator>
            </View>

            <Portal>
                <Modal
                    isOpen={!!openModal}
                    onClosed={() => toggleModal()}
                    height={400}
                >
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}>Hours</Text>
                        {data?.hours?.[0]?.open?.slice(0, 7)?.map((open, i) => <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Text style={{ fontWeight: getDay - 1 === i ? 'bold' : 'normal' }}>{days[i]}</Text>
                            <Text style={{ fontWeight: getDay - 1 === i ? 'bold' : 'normal' }}>{convertCurrency2(open.start, ':')} - {convertCurrency2(open.end, ':')}</Text>
                        </View>)}
                    </View>
                </Modal>
            </Portal>
        </View>
    )
}

export default DetailScreen