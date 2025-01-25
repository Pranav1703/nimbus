import { Box, For, HStack, Icon } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import Icons from '../../assets/Icons'

function Actions(): JSX.Element {
  const handleButtonPress = (name): void => {
    console.log(name)
  }
  return (
    <>
      <HStack mt={5} mr={10} gap={3}>
        <For
          each={[
            { name: 'Backup Files', icon: <Icons.Backup1 /> },
            { name: 'Restore Files', icon: <Icons.Download /> },
            { name: 'Settings', icon: <Icons.Settings /> },
            { name: 'Schedule', icon: <Icons.Schedule /> }
          ]}
        >
          {(item, index) => (
            <Button
              key={index}
              w={'1/4'}
              variant={item.name == 'Backup Files' ? 'solid' : 'surface'}
              p={6}
              borderRadius={'lg'}
              onClick={() => handleButtonPress(item.name)}
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
