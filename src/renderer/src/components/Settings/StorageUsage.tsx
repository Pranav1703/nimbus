import {
    Box,
    For,
    HStack,
    ProgressRange,
    ProgressTrack,
    Spacer,
    Text,
    VStack
} from '@chakra-ui/react'
import React from 'react'
import { ProgressRoot } from '../ui/progress'
import { drive_v3 } from 'googleapis'
import StorageConv from '../Dashboard/StorageConv'

const StorageUsage = ({
    userinfo,
    loading
}: {
    userinfo: drive_v3.Schema$About
    loading: boolean
}): JSX.Element => {
    const data = [
        { name: 'Documents', storage: '25GB' },
        { name: 'Images', storage: '30GB' },
        { name: 'Other Files', storage: '15GB' }
    ]
    const storageQuota = Number(
        ((Number(userinfo?.storageQuota?.usage) / 16105637376) * 100).toFixed(2)
    )

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

    const currentStorage = formatBytesBase2(Number(userinfo?.storageQuota?.usageInDrive))
    const TotalStorage = formatBytesBase2(Number(userinfo?.storageQuota?.limit))
    return (
        <>
            <Box
                p={4}
                borderRadius={'lg'}
                borderColor={'gray.800'}
                borderWidth={1}
                w={'3/4'}
                bg={'gray.900/50'}
            >
                <VStack alignItems={'flex-start'} w={'full'}>
                    <Text fontSize={'xl'} fontWeight={'semibold'}>
                        Storage Usage
                    </Text>
                    <Box w={'100%'} mt={2}>
                        <HStack justifyContent={'space-between'} pb={2}>
                            <Text color={'gray.400'}>{currentStorage} of {TotalStorage} used</Text>
                            <Text color={'gray.400'}>{storageQuota}%</Text>
                        </HStack>
                        <ProgressRoot size={'md'} w={'100%'} value={loading ? null : storageQuota}>
                            <ProgressTrack>
                                <ProgressRange />
                            </ProgressTrack>
                        </ProgressRoot>
                    </Box>
                    <HStack w={'full'} mt={1}>
                        <For each={data}>
                            {(item, index) => (
                                <Box
                                    justifyContent={'space-between'}
                                    w={'1/3'}
                                    p={3}
                                    mt={3}
                                    borderRadius={'lg'}
                                    borderColor={'gray.800'}
                                    borderWidth={0.5}
                                    bg={'gray.900/70'}
                                    key={index}
                                >
                                    <VStack alignItems={'flex-start'} w={'full'} gap={1}>
                                        <Text fontSize="md" color={'gray.400'}>
                                            {item.name}
                                        </Text>
                                        <Text fontSize={'xl'} fontWeight={'medium'}>
                                            {item.storage}
                                        </Text>
                                    </VStack>
                                </Box>
                            )}
                        </For>
                    </HStack>
                </VStack>
            </Box>
        </>
    )
}

export default StorageUsage
