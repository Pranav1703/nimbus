import { Box, For, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Switch } from '../ui/switch'

function AdvancedOpt(): JSX.Element {
    return (
        <>
            <Box p={4} borderRadius={'lg'} borderColor={'gray.800'} borderWidth={1} w={'5/6'}>
                <Text textStyle={'xl'} fontWeight={'medium'} pb={2}>
                    Advanced Options
                </Text>
                <VStack alignItems={'flex-start'} gap={4}>
                    <HStack justifyContent={'space-between'} w={'-webkit-fill-available'}>
                        <VStack alignItems={'flex-start'} gap={1}>
                            <Text textStyle={'lg'}>Enable Automatic Backup</Text>
                            <Text color="gray.500" textStyle={'1sm'}>
                                Automatically backup your files at scheduled intervals
                            </Text>
                        </VStack>
                        <Switch />
                    </HStack>
                    <HStack justifyContent={'space-between'} w={'-webkit-fill-available'}>
                        <VStack alignItems={'flex-start'} gap={1}>
                            <Text textStyle={'lg'}>Encrypt Backups</Text>
                            <Text color="gray.500" textStyle={'1sm'}>
                                Add additional security to your backups
                            </Text>
                        </VStack>
                        <Switch />
                    </HStack>{' '}
                    <HStack justifyContent={'space-between'} w={'-webkit-fill-available'}>
                        <VStack alignItems={'flex-start'} gap={1}>
                            <Text textStyle={'lg'}>Backup Notifications</Text>
                            <Text color="gray.500" textStyle={'1sm'}>
                                Receive notifications about backup status
                            </Text>
                        </VStack>
                        <Switch />
                    </HStack>
                </VStack>
            </Box>
        </>
    )
}

export default AdvancedOpt
