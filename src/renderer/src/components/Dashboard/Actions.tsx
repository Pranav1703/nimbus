import { Box, For, HStack, Icon } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import {
  MdOutlineBackup,
  MdOutlineRestorePage,
  MdOutlineScheduleSend,
  MdOutlineSettings
} from 'react-icons/md'

function Actions(): JSX.Element {
  const handleButtonPress = (name): void => {
    console.log(name)
  }
  return (
    <>
      <HStack mt={5} mr={10} gap={3}>
        <For
          each={[
            { name: 'Backup Files', icon: <MdOutlineBackup /> },
            { name: 'Restore Files', icon: <MdOutlineRestorePage /> },
            { name: 'Settings', icon: <MdOutlineSettings /> },
            { name: 'Schedule', icon: <MdOutlineScheduleSend /> }
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
