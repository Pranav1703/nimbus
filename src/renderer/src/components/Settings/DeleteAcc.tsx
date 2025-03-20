import { Box, Input, Text, VStack } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { Button } from '../ui/button'
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger
} from '../ui/dialog'
import { useAlert } from '../Alert'
import { UserContext } from '../../App'

const DeleteAcc = (): JSX.Element => {
    const { addAlert } = useAlert()
    const [inputValue, setInputValue] = useState('')
    const requiredText = 'sudo delete nimbus'
    const [open, setOpen] = useState(false)
    const isMatch = inputValue.trim() === requiredText
    const { setUser } = useContext(UserContext)

    const handleDelete = async (): Promise<void> => {
        await window.api.disconnect()
        setUser(false)

        addAlert('success', 'Account Deleted')
        // console.log("Account Deleted");
        setOpen(false)
    }

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

                <DialogRoot
                    placement={'center'}
                    motionPreset="slide-in-bottom"
                    size={'lg'}
                    open={open}
                    onOpenChange={(e) => setOpen(e.open)}
                >
                    <DialogTrigger asChild>
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
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle fontSize={'2xl'}>Delete Static Site</DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <VStack alignItems={'flex-start'} gap={2} fontSize={'md'}>
                                <Text>
                                    All resources stored in Nimbus will removed immediately. This
                                    action cannot be undone.
                                </Text>
                                <Text>Are you sure you want to remove it?</Text>
                                <Text>
                                    Type{' '}
                                    <Text
                                        fontWeight={'medium'}
                                        color={'red.600/90'}
                                        as="span"
                                        fontSize={'lg'}
                                    >
                                        sudo delete nimbus
                                    </Text>{' '}
                                    below to confirm.
                                </Text>
                                <Input
                                    placeholder="sudo delete nimbus"
                                    mt={4}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                            </VStack>
                        </DialogBody>
                        <DialogFooter>
                            <DialogActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogActionTrigger>
                            <Button colorPalette="red" disabled={!isMatch} onClick={handleDelete}>
                                Delete
                            </Button>
                        </DialogFooter>
                        <DialogCloseTrigger />
                    </DialogContent>
                </DialogRoot>

                <Text color={'gray.400'}>
                    Once you delete your account, there is no going back. Please be certain.
                </Text>
            </VStack>
        </Box>
    )
}

export default DeleteAcc
