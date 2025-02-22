import { Box, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Button } from '../ui/button'

const DeleteAcc = (): JSX.Element => {
    return (
        <Box
            p={4}
            borderRadius={'lg'}
            borderColor={'red.800'}
            borderWidth={1}
            w={'3/4'}
            bg={'red.800/30'}
        >
            <VStack alignItems={'flex-start'} w={'full'} gap={4}>
                <Text fontSize={'xl'} fontWeight={'semibold'} color={'red'}>
                    Danger Zone
                </Text>
                <Button
                    w={'full'}
                    variant={'subtle'}
                    colorPalette={'red'}
                    borderRadius={'lg'}
                    justifyContent={'flex-start'}
                    color={'red'}
                >
                    Delete Account
                </Button>
                <Text color={'gray.400'}>
                    Once you delete your account, there is no going back. Please be certain.
                </Text>
            </VStack>
        </Box>
    )
}

export default DeleteAcc
