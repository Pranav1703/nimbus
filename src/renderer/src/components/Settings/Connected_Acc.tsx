import { Box, HStack, Icon, Input, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Avatar } from '../ui/avatar'
import Icons from '../../assets/Icons'
import { drive_v3 } from 'googleapis'
import { Skeleton } from '../ui/skeleton'
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from '../ui/dialog'
import { useAlert } from '../Alert'

const Connected_Acc = ({
    userinfo,
    loading
}: {
    userinfo: drive_v3.Schema$About
    loading: boolean
}): JSX.Element => {
        const {addAlert} = useAlert();
        const [inputValue, setInputValue] = useState("");
        const requiredText = "disconnect";
        const [open, setOpen] = useState(false)
        const isMatch = inputValue.trim() === requiredText;
    
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
                <VStack alignItems={'flex-start'}>
                    <Text fontSize={'xl'} fontWeight={'semibold'}>
                        Connected Accounts
                    </Text>
                    <HStack
                        justifyContent={'space-between'}
                        w={'full'}
                        p={4}
                        mt={3}
                        borderRadius={'lg'}
                        borderColor={'gray.800'}
                        borderWidth={0.5}
                        bg={'gray.900/70'}
                    >
                        <>
                            <HStack gap={4}>
                                <Icon size={'2xl'}>
                                    <Icons.Google />
                                </Icon>
                                <VStack alignItems={'flex-start'} gap={1}>
                                    <Text>Google Account</Text>
                                    {loading ? (
                                        <Skeleton fontSize={'md'} />
                                    ) : (
                                        <Text fontSize="md" color={'gray.400'}>
                                            Connected as {userinfo?.user?.emailAddress}
                                        </Text>
                                    )}
                                </VStack>
                            </HStack>
                        </>
                    </HStack>
                </VStack>
            </Box>
        </>
    )
}

export default Connected_Acc
