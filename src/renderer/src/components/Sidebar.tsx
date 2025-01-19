import { Avatar } from './ui/avatar'
import { Button } from './ui/button'
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger
} from './ui/drawer'
import logo from '../assets/logo1.2.png'
import { Flex, For, Icon, Separator, Stack, Text, VStack } from '@chakra-ui/react'
import { SetStateAction, useState } from 'react'
import {
  MdHistory,
  MdMenuOpen,
  MdOutlineBackup,
  MdOutlineFolder,
  MdOutlineSettings,
  MdOutlineSpaceDashboard
} from 'react-icons/md'
function Sidebar(): JSX.Element {
  const [currentPage, setcurrentPage] = useState('Dashboard')
  const handleSetPage = (page: SetStateAction<string>):void => {
    setcurrentPage(page)
  }
  return (
    <div>
      <DrawerRoot placement="start" size={'xs'}>
        <DrawerBackdrop />

        {/* Drawer Trigger */}
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
          <MdMenuOpen />
          </Button>
        </DrawerTrigger>

        {/* Content */}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              <Flex align={'center'}>
                <Avatar src={logo} name="Logo" mr={3} /> Nimbus
              </Flex>
            </DrawerTitle>
          </DrawerHeader>
          <Separator />

          <DrawerBody>
            <Stack mt={3}>
              <For
                each={[
                  { logo: <MdOutlineSpaceDashboard />, data: 'Dashboard' },
                  { logo: <MdOutlineFolder />, data: 'Files' },
                  { logo: <MdOutlineBackup />, data: 'Backup' },
                  { logo: <MdHistory />, data: 'Versions' },
                  { logo: <MdOutlineSettings />, data: 'Settings' }
                ]}
              >
                {(item, index) => (
                  <Button
                    variant={currentPage === item.data ? 'subtle' : 'ghost'}
                    key={index}
                    onClick={() => handleSetPage(item.data)}
                    justifyContent={'flex-start'}
                    pl={30}
                  >
                    <Icon mr={3}>{item.logo}</Icon>
                    <Text>{item.data}</Text>
                  </Button>
                )}
              </For>
            </Stack>
          </DrawerBody>
          <Separator />
          <DrawerFooter justifyContent={'center'}>
            <Avatar />
            <VStack w={'full'}>
              <Text>name</Text>
              <Text>name@gmail.com</Text>
            </VStack>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </div>
  )
}

export default Sidebar
