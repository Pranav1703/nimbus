import { Box, For, Group, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Button } from '../ui/button'
import Icons from '../../assets/Icons'

const Hero = (): JSX.Element => {
  const values = [
    {
      heading: 'Documents',
      content: 128,
      icon: <Icons.Documents />,
      color: 'blue'
    },
    {
      heading: 'Images',
      content: 364,
      icon: <Icons.Image />,
      color: 'pink'
    },
    {
      heading: 'Videos',
      content: 48,
      icon: <Icons.Video />,
      color: 'green'
    },
    {
      heading: 'Upload Now',
      content: 85,
      icon: <Icons.Add />,
      color: 'orange'
    }
  ]

  return (
    <div>
      <Group grow pt={7}>
        <For each={values}>
          {(item, index) => (
            <Button
              variant="outline"
              w={'1/4'}
              p={3}
              justifyContent={'flex-start'}
              borderRadius={'lg'}
              key={index}
              borderColor={'gray.800'}
              h={'max-content'}
            >
              <HStack>
                <Box p={3} bg={`${item.color}.900/80`} borderRadius={'lg'}>
                  <Icon fontSize="2xl" color={`${item.color}.200`}>
                    {item.icon}
                  </Icon>
                </Box>
                <Box pl={4}>
                  <VStack alignItems={'flex-start'} gap={1}>
                    {item.heading === 'Upload Now' ? (
                      <>
                        <Text fontSize="xl" fontWeight={'medium'} color={'white'}>
                          {item.heading}
                        </Text>
                        <Text color={'gray.400'}></Text>
                      </>
                    ) : (
                      <>
                        <Text fontSize="xl" fontWeight={'medium'} color={'white'}>
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
