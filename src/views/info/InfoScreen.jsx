import React from 'react'
import { View, ScrollView, Linking, Alert, Platform } from 'react-native'
import { Text } from 'react-native-paper'
import { convertCurrency2 } from '../../utils/commonUtils'
import ItemInfo from '../../components/ItemInfo'

const TODAY = new Date()
const getDay = TODAY.getDay()
const InfoScreen = ({ item, toggleModal }) => {
    const hours = item?.hours?.[0]

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView style={{ flex: 1 }}
            >
                <ItemInfo
                    title={'Hours'}
                    subTitle={<>
                        <Text style={{ color: hours?.is_open_now ? 'rgb(0, 128, 85)' : 'rgb(224, 7, 7)', marginRight: 8 }}>{hours?.is_open_now ? 'open' : 'closed'} </Text>
                        <Text style={{ color: 'rgba(110,112,114,1)' }}>{convertCurrency2(hours?.open?.[getDay]?.start, ':')} - {convertCurrency2(hours?.open?.[getDay]?.end, ':')}</Text></>}
                    icon={'arrowright'}
                    onPress={() => toggleModal()}
                />
                <ItemInfo
                    title={'Website'}
                    subTitle={item?.url}
                    icon={'link'}
                    onPress={() => {
                        Linking.canOpenURL(item.url).then(supported => {
                            if (supported) {
                                Linking.openURL(item.url);
                            } else {
                                console.log("Don't know how to open URI: " + item.url);
                            }
                        });
                    }}
                />
                <ItemInfo
                    title={'Call'}
                    subTitle={item?.phone}
                    icon={'phone'}
                    onPress={() => {
                        Linking.canOpenURL(item?.phone)
                            .then(supported => {
                                if (!supported) {
                                    Alert.alert('Phone not support call');
                                } else {
                                    return Linking.openURL(item?.phone);
                                }
                            })
                    }}
                />
                <ItemInfo
                    title={'Get Direction'}
                    subTitle={item?.location?.display_address?.join(', ')}
                    icon={'enviromento'}
                    onPress={() => {
                        // const daddr = `${item?.coordinates?.latitude},${item?.coordinates?.longitude}`;
                        // const saddr = `${item?.coordinates?.latitude},${item?.coordinates?.longitude}`;
                        // const company = Platform.OS === 'ios' ? 'apple' : 'google';
                        // Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}&saddr=${saddr}`)


                        const scheme = Platform.select({ ios: `maps:0,0?q=`, android: `geo:0,0?q=` })
                        const latLng = `${item?.coordinates?.latitude},${item?.coordinates?.longitude}`
                        const label = item?.name
                        const url = Platform.select({
                            ios: `${scheme}${label}@${latLng}`,
                            android: `${scheme}${latLng}(${label})`
                        })
                        Linking.canOpenURL(url)
                            .then(supported => {
                                if (!supported) {
                                    Alert.alert('maps not installed');
                                } else {
                                    return Linking.openURL(url);
                                }
                            })
                    }}
                />
            </ScrollView>
        </View>
    )
}

export default InfoScreen