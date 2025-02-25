import { Box, For, Group, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { Button } from '../ui/button'
import Icons from '../../assets/Icons'
import { useAlert } from '../Alert'

const Hero = ({
    ButtonVal,
    Count,
    rootId,
    getFiles
}: {
    ButtonVal: (value: string) => void
    Count: { Documents: number; Images: number; Videos: number; Folder: number }
    rootId: string,
    getFiles: () => void
}): JSX.Element => {
    const values = [
        {
            heading: 'Documents',
            content: Count.Documents,
            icon: <Icons.Documents />,
            color: 'blue'
        },
        {
            heading: 'Images',
            content: Count.Images,
            icon: <Icons.Images />,
            color: 'pink'
        },
        {
            heading: 'Videos',
            content: Count.Videos,
            icon: <Icons.Videos />,
            color: 'green'
        },
        {
            heading: 'Folder',
            content: Count.Folder,
            icon: <Icons.Folder />,
            color: 'purple'
        },
        {
            heading: 'Upload Now',
            content: 85,
            icon: <Icons.Add />,
            color: 'orange'
        }
    ]
    const [activeButton, setActiveButton] = useState(null)
    const { addAlert, removeAlert } = useAlert()
    const offlineAlertId = useRef<number | null>(null) // Track the alert ID
    const uploadFile = async (filePath) => {
        if (filePath.length === 0) {
            console.log('no filePath provided.')
            return
        }
        try {
            console.log(filePath)
            const { id } = await window.api.fileUpload(filePath, rootId)
        } catch (error) {
            console.log('error uploading file: ', error)
        }
    }

    const uploadFolder = async (folderPath) => {
        try {
            await window.api.folderUpload(folderPath, rootId)
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpload = async () => {
        try {
            const multiOptions = {
                title: 'Select a File to Upload',
                buttonLabel: 'Upload',
                properties: ['openFile' as const] // Allows selecting a single file
            };
    
            const result = await window.api.showOpenDialog(multiOptions);
    
            if (result.canceled || !result.filePaths) {
                addAlert('error', 'Upload Cancelled', 2000);
                return;
            }
    
            if (result.filePaths.length > 0) {
                // Set sticky alert
                offlineAlertId.current = addAlert('info', 'Uploading...', null, true);
                console.log('Selected paths:', result.filePaths);
    
                try {
                    await uploadFile(result.filePaths[0]); // Ensure upload completes before removing alert
                    removeAlert(offlineAlertId.current);
                    offlineAlertId.current = null;
                    addAlert('success', 'Upload Completed', 2000);
                    getFiles()
                } catch (uploadError) {
                    console.error('Error during upload:', uploadError);
                    removeAlert(offlineAlertId.current);
                    offlineAlertId.current = null;
                    addAlert('error', 'Upload Failed', 2000);
                }
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            addAlert('error', 'Something went wrong', 2000);
        }
    };
    

    const handleButtonClick = (index, val): void => {
        if (val === 'Upload Now') {
            handleUpload()
            return
        }
        if (activeButton === index) {
            // If the same button is clicked again, deactivate it and send an empty value
            setActiveButton(null)
            ButtonVal('')
        } else {
            // Otherwise, activate the button and send its value
            setActiveButton(index)
            ButtonVal(val)
        }
    }

    return (
        <>
            <Group grow w={'full'}>
                <For each={values}>
                    {(item, index) => (
                        <Button
                            variant={activeButton === index ? 'subtle' : 'plain'} // Active button styling
                            w={'1/4'}
                            p={3}
                            justifyContent={'flex-start'}
                            borderRadius={'lg'}
                            key={index}
                            h={'max-content'}
                            onClick={() => {
                                handleButtonClick(index, item.heading)
                            }}
                            _hover={{ borderColor: `${item.color}.400` }}
                            // _active={{ borderColor: `${item.color}.400` }}
                            // _focus={{ borderColor: activeButton === index ? `${item.color}.400`: '' }}
                            borderColor={
                                activeButton === index ? `${item.color}.400/60` : 'gray.800'
                            }
                            bgColor={activeButton === index ? `${item.color}.800/10` : ''}
                        >
                            <HStack>
                                <Box p={3} bg={`${item.color}.800/10`} borderRadius={'lg'}>
                                    <Icon fontSize="2xl" color={`${item.color}.400`}>
                                        {item.icon}
                                    </Icon>
                                </Box>
                                <Box pl={4}>
                                    <VStack alignItems={'flex-start'} gap={1}>
                                        {item.heading === 'Upload Now' ? (
                                            <>
                                                <Text
                                                    fontSize="xl"
                                                    fontWeight={'medium'}
                                                    color={'white'}
                                                >
                                                    {item.heading}
                                                </Text>
                                                <Text color={'gray.400'}></Text>
                                            </>
                                        ) : (
                                            <>
                                                <Text
                                                    fontSize="xl"
                                                    fontWeight={'medium'}
                                                    color={'white'}
                                                >
                                                    {item.heading}
                                                </Text>
                                                <Text color={'gray.400'}>{item.content} Files</Text>
                                            </>
                                        )}
                                    </VStack>
                                </Box>
                            </HStack>
                        </Button>
                    )}
                </For>
            </Group>
        </>
    )
}

export default Hero
