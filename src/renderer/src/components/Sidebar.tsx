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
import { useNavigate } from 'react-router-dom'
import { drive_v3 } from 'googleapis'
import { SkeletonCircle, SkeletonText } from './ui/skeleton'

function Sidebar({
  data
}: {
  data: { userinfo: drive_v3.Schema$About; loading: boolean }
}): JSX.Element {
  const navigate = useNavigate()
  const [currentPage, setcurrentPage] = useState('Dashboard')
  const handleSetPage = (page: SetStateAction<string>): void => {
    setcurrentPage(page)
    navigate('/' + page)
  }



  return (
    <div>
      <DrawerRoot placement="start" size={'xs'}>
        <DrawerBackdrop />

        {/* Drawer Trigger */}
        <DrawerTrigger asChild w={'fit-content'} float={'inline-start'} mt={5} ml={2}>
          <Button variant="outline" size="sm">
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
            {data.loading ? (
              <>
                <SkeletonCircle size={12} />
                <VStack w={'full'}>
                  <SkeletonText noOfLines={1} />
                  <SkeletonText noOfLines={1} />
                </VStack>
              </>
            ) : (
              <>
                <Avatar
                  name="userinfo['user']['displayName']"
                  src={data.userinfo?.user?.photoLink || ''}
                />
                <VStack w={'full'}>
                  <Text>{data.userinfo ? data.userinfo?.user?.displayName : ''}</Text>
                  <Text>{data.userinfo ? data.userinfo?.user?.emailAddress : ''}</Text>
                </VStack>
              </>
            )}
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </div>
  )
}

export default Sidebar
