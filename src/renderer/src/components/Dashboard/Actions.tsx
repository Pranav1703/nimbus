import { Box, For, HStack, Icon } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import Icons from '../../assets/Icons'
import { useNavigate } from 'react-router-dom'

function Actions(): JSX.Element {
  const Navigate = useNavigate();
  const handleButtonPress = (name): void => {
    console.log(name)
    Navigate(name)
  }
  return (
    <>
      <HStack mt={5} mr={10} gap={3}>
        <For
          each={[
            { name: 'Backup Files', icon: <Icons.Backup1 /> ,link: '/backup' },
            { name: 'Restore Files', icon: <Icons.Download/>, link: '/Files' },
            { name: 'Settings', icon: <Icons.Settings /> , link: '/Settings'},
            { name: 'Schedule', icon: <Icons.Schedule /> , link: '/Backup' },
          ]}
        >
          {(item, index) => (
            <Button
              key={index}
              w={'1/4'}
              variant={item.name == 'Backup Files' ? 'solid' : 'surface'}
              p={6}
              borderRadius={'lg'}
              onClick={() => handleButtonPress(item.link)}
            >
              {item.name}
              <Icon>{item.icon}</Icon>
            </Button>
          )}
        </For>
      </HStack>
    </>
  )
}

export default Actions
