import React from 'react'
import { View } from 'react-native'
import ModalBox from 'react-native-modalbox'

const Modal = ({ children, height = 300, position = 'bottom', ...rest }) => {
    return (
        <ModalBox
            backButtonClose
            position={position}
            style={{
                height,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                ...rest.style
            }}
            {...rest}
        >
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
                {
                    !rest.noHandle && <View style={{
                        padding: 8,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            backgroundColor: '#bdc3c7',
                            height: 3,
                            width: 80,
                            borderRadius: 4,
                            marginVertical: 8
                        }} />
                    </View>
                }
                {children}

            </View>
        </ModalBox>
    )
}

export default Modal