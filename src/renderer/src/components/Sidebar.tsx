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
import { SetStateAction, useEffect, useState } from 'react'
import {
  MdHistory,
  MdMenuOpen,
  MdOutlineBackup,
  MdOutlineFolder,
  MdOutlineSettings,
  MdOutlineSpaceDashboard
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { drive_v3 } from 'googleapis'

function Sidebar(): JSX.Element {

  const navigate = useNavigate()
  const [currentPage, setcurrentPage] = useState('Dashboard')
  const [userinfo, setuserinfo] = useState<drive_v3.Schema$About >({})
  const handleSetPage = (page: SetStateAction<string>): void => {
    setcurrentPage(page)
    navigate('/' + page)
    console.log(page)
  }

  useEffect(() => {
    const logger = async (): Promise<void> => {
      try {
        const info = await window.api.getInfo() //user, storageQuota in Bytes, maxUploadSize
        if (info) {
          setuserinfo(info)
        } else {
          setuserinfo({})
        }
      } catch (error) {
        console.log(error)
      }
    }
    logger()
  }, [])

  return (
    <div>
      <DrawerRoot placement="start" size={'xs'}>
        <DrawerBackdrop />

        {/* Drawer Trigger */}
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" mt={5}>
            <MdMenuOpen />
          </Button>
        </DrawerTrigger>

        {/* Content */}
        <DrawerContent>
          {/* Heading */}
          <DrawerHeader>
            <DrawerTitle>
              <Flex align={'center'}>
                <Avatar src={logo} name="Logo" mr={3} /> Nimbus
              </Flex>
            </DrawerTitle>
          </DrawerHeader>
          <Separator />

          {/* Body */}
          <DrawerBody>
            <Stack mt={3}>
              <For
                each={[
                  { logo: <MdOutlineSpaceDashboard />, data: 'Dashboard' },
                  { logo: <MdOutlineFolder />, data: 'Files' },
                  { logo: <MdOutlineBackup />, data: 'Backup' },
                  { logo: <MdHistory />, data: 'Versions' },
                  { logo: <MdOutlineSettings />, data: 'Settings' },
                  { logo: <MdOutlineSettings />, data: 'Test' },
                  { logo: <MdOutlineSettings />, data: 'Test2' }
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

          {/* Footer */}
          <DrawerFooter justifyContent={'center'}>
            <Avatar
            name="userinfo['user']['displayName']"
            src={userinfo?.user?.photoLink || ""} 
            />
            <VStack w={'full'}>
              <Text>{userinfo ? userinfo?.user?.displayName : ''}</Text>
              <Text>{userinfo ? userinfo?.user?.emailAddress : ''}</Text>
            </VStack>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </div>
  )
}

export default Sidebar
