import { Avatar, Box, Fieldset, Group, HStack, Input, Stack, Text, VStack } from '@chakra-ui/react'
import { drive_v3 } from 'googleapis'
import React, { useEffect, useState } from 'react'
import Edit_Profile from './Edit_Profile'
import { Skeleton, SkeletonCircle } from '../../ui/skeleton'

function Profile({
    userinfo,
    loading,
    refreshName,
    name,
    Image
}: {
    userinfo: drive_v3.Schema$About
    loading: boolean
    refreshName: () => void
    name: string
    Image: string
}): JSX.Element {
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
                {loading ? (
                    <HStack gap="8" p={3}>
                        <SkeletonCircle size={20} />
                        <Stack flex="1">
                            <Skeleton height="28px" />
                            <Skeleton height="28px" />
                            <HStack>
                                <Skeleton height="28px" w={24} />
                                <Skeleton height="28px" w={24} />
                            </HStack>
                        </Stack>
                    </HStack>
                ) : (
                    <HStack gap={8} p={3}>
                        
                        <Avatar.Root shape="full" size="2xl">
                            <Avatar.Fallback name="Random User" />
                            <Avatar.Image src={Image} w={'24'} />
                        </Avatar.Root>
                        <VStack gap={1} alignItems={'flex-start'}>
                            <Text fontSize="xl" fontWeight={'medium'}>
                                {name}
                            </Text>
                            <Text fontSize="md" color={'gray.400'}>
                                {userinfo?.user?.emailAddress}
                            </Text>
                            <Edit_Profile refreshName={refreshName} name={name}/>
                        </VStack>
                    </HStack>
                )}
            </Box>
        </>
    )
}

export default Profile
