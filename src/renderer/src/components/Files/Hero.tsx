import { Box, For, Group, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import Icons from '../../assets/Icons'

const Hero = ({
    ButtonVal,
    Count
}: {
    ButtonVal: (value: string) => void
    Count: { Documents: number; Images: number; Videos: number; Folder: number }
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
    const handleButtonClick = (index, val): void => {
        if (val === 'Upload Now') {
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
        <div>
            <Group grow pt={7}>
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
                            borderColor={activeButton === index ? `${item.color}.400/60` : 'gray.800'}
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
        </div>
    )
}

export default Hero
