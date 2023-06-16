import React from 'react'
import { View } from 'react-native'
import { Divider, Text, TouchableRipple } from 'react-native-paper'
import Icon from 'react-native-vector-icons/AntDesign'

const ItemInfo = ({ onPress, icon, title, subTitle, noDivider }) => {
    return (
        <View style={{ backgroundColor: '#fff' }}>
            <TouchableRipple
                onPress={onPress}
                style={{
                    padding: 16
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold' }}>{title}</Text>
                        {!!subTitle && <Text numberOfLines={1}>{subTitle}</Text>}
                    </View>
                    <Icon name={icon} size={25} style={{ color: '#000' }} />
                </View>
            </TouchableRipple>
            {!noDivider && <Divider />}
        </View>
    )
}

export default ItemInfo