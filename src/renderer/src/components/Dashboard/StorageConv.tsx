import {  Text } from '@chakra-ui/react'
import React from 'react'
import { Skeleton } from '../ui/skeleton'

interface Props {
  bytes: number
}

const StorageConv: React.FC<Props> = ({ bytes }) => {
  const formatBytesBase2 = (bytes: number): string | null => {
    if (bytes === 0) {
      return '0 Bytes'
    }

    const k = 1024
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    let i = 0
    while (bytes >= k && i < sizes.length - 1) {
      bytes /= k
      i++
    }
// `${bytes.toFixed(2)} ${sizes[i]}`
    return isNaN(bytes) ? null : `${bytes.toFixed(2)} ${sizes[i]}`
  }

  const formattedSize = formatBytesBase2(bytes)

  return (
    <Text textStyle="2xl" as={'span'}>
      {formattedSize ? (
        formattedSize
      ) : (
        <Skeleton w={'100px'} h={"7"} mt={1} variant="shine"/>
      )}
    </Text>
  )
}

export default StorageConv
