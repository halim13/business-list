import React, { useState } from 'react'
import { Image, View } from 'react-native'

const ImageCompany = ({ src }) => {
  const defaultImage = '../assets/img/common/404.jpg'

  const [img, setImg] = useState({ uri: src })

  const source = img.uri ? img : require(defaultImage)

  return (
    <>
      <Image
        source={source}
        style={{
          width: '100%',
          height: 150,
          resizeMode: 'cover',
          backgroundColor: '#F8F8F8',
          marginRight: 8,
        }}
        onError={() => setImg(require(defaultImage))}
      />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#00000040',
        }}
      />
    </>
  )
}

export default ImageCompany