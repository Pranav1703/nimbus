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
import logo from '../assets/Images/logo1.2.png'
import { Flex, For, Icon, Separator, Stack, Text, VStack } from '@chakra-ui/react'
import { SetStateAction, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { drive_v3 } from 'googleapis'
import { SkeletonCircle, SkeletonText } from './ui/skeleton'
import Icons from '../assets/Icons'

function Sidebar({
    data
}: {
    data: { userinfo: drive_v3.Schema$About; loading: boolean }
}): JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()
    const [currentPage, setcurrentPage] = useState('Dashboard')
    useEffect(() => {
        setcurrentPage(location.pathname.slice(1)) // Update current page on location change
    }, [location.pathname])
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
                        <Icons.MenuOpen />
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
                                    { logo: <Icons.Dashboard />, data: 'Dashboard' },
                                    { logo: <Icons.Folder />, data: 'Files' },
                                    { logo: <Icons.Backup1 />, data: 'Backup' },
                                    { logo: <Icons.Versions1 />, data: 'Versions' },
                                    { logo: <Icons.Settings />, data: 'Settings' },
                                    { logo: <Icons.Settings />, data: 'Test' },
                                    { logo: <Icons.Settings />, data: 'Test2' }
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
                                    name={data.userinfo?.user?.displayName || ''}
                                    src={data.userinfo?.user?.photoLink || ''}
                                />
                                <VStack w={'full'}>
                                    <Text>
                                        {data.userinfo ? data.userinfo?.user?.displayName : ''}
                                    </Text>
                                    <Text>
                                        {data.userinfo ? data.userinfo?.user?.emailAddress : ''}
                                    </Text>
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
