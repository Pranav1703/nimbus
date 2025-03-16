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
import { Flex, Icon, Separator, Stack, Text, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { drive_v3 } from 'googleapis'
import { SkeletonCircle, SkeletonText } from './ui/skeleton'
import Icons from '../assets/Icons'
import { Tooltip } from './ui/tooltip'

function Sidebar({
    data,name,Image
}: {
    data: { userinfo: drive_v3.Schema$About; loading: boolean }
    name:string
    Image:string
}): JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()
    const [currentPage, setcurrentPage] = useState('Dashboard')
    const [isSemiMode, setIsSemiMode] = useState(true) // Semi-mode state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false) // Drawer open state

    useEffect(() => {
        setcurrentPage(location.pathname.slice(1)) // Update current page on location change
    }, [location.pathname])

    const handleSetPage = (page: string): void => {
        setcurrentPage(page)
        navigate('/' + page)
    }

    // When semi-mode is turned OFF, open the drawer
    useEffect(() => {
        if (!isSemiMode) {
            setIsDrawerOpen(true)
        }
    }, [isSemiMode])

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Semi-mode Sidebar */}
            <Stack
                w={'60px'}
                h="100vh"
                color="white"
                align="center"
                bg={'gray.900/50'}
                borderRadius={'lg'}
                borderRightWidth={1}
                py={4}
                gap={5}
                left={0}
                top={0}
                transition="width 0.3s"
            >
                {/* Burger Menu Icon */}
                <Tooltip
                    content="Open Sidebar"
                    positioning={{ placement: 'right-end' }}
                    contentProps={{ css: { "--tooltip-bg": '#18181b',"color":"white" } }}
                >
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setIsSemiMode(!isSemiMode)
                            setIsDrawerOpen(!isSemiMode)
                        }}
                    >
                        <Icons.MenuOpen />
                    </Button>
                </Tooltip>

                {/* Navigation Icons */}
                {[
                    { icon: <Icons.Dashboard />, page: 'Dashboard' },
                    { icon: <Icons.Folder />, page: 'Files' },
                    { icon: <Icons.Backup1 />, page: 'Backup' },
                    { icon: <Icons.Versions1 />, page: 'Versions' },
                    { icon: <Icons.Settings />, page: 'Settings' },
                    { icon: <Icons.Settings />, page: 'Test' },
                    { icon: <Icons.Settings />, page: 'Test2' }
                ].map((item, index) => (
                    <Tooltip
                        content={item.page}
                        positioning={{ placement: 'right-end' }}
                        key={index}
                        contentProps={{ css: { "--tooltip-bg": '#3f3f46',"color":"white","marginLeft":"3" } }}
                    >
                        <Button
                            key={index}
                            onClick={() => handleSetPage(item.page)}
                            variant="ghost"
                            colorScheme={currentPage === item.page ? 'blue' : 'whiteAlpha'}
                            p={3}
                        >
                            <Icon>{item.icon}</Icon>
                        </Button>
                    </Tooltip>
                ))}
            </Stack>

            {/* Full Sidebar Drawer */}
            <DrawerRoot
                open={isDrawerOpen}
                onOpenChange={({ open }) => setIsDrawerOpen(open)}
                placement="start"
                size={'xs'}
            >
                <DrawerBackdrop />
                {/* <DrawerTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        position="absolute"
                        left={isSemiMode ? '70px' : '210px'}
                        top={5}
                    >
                        <Icons.MenuOpen />
                    </Button>
                </DrawerTrigger> */}

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
                            {[
                                { logo: <Icons.Dashboard/>, data: 'Dashboard' },
                                { logo: <Icons.Folder />, data: 'Files' },
                                { logo: <Icons.Backup1 />, data: 'Backup' },
                                { logo: <Icons.Versions1 />, data: 'Versions' },
                                { logo: <Icons.Settings />, data: 'Settings' },
                                { logo: <Icons.Settings />, data: 'Test' },
                                { logo: <Icons.Settings />, data: 'Test2' }
                            ].map((item, index) => (
                                <Button
                                    variant={currentPage === item.data ? 'subtle' : 'ghost'}
                                    key={index}
                                    onClick={() => handleSetPage(item.data)}
                                    justifyContent={'flex-start'}
                                    pl={30}
                                >
                                    <Icon  mr={3} >{item.logo}</Icon>
                                    <Text>{item.data}</Text>
                                </Button>
                            ))}
                        </Stack>
                    </DrawerBody>

                    <Separator />

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
                                    name={name}
                                    src={Image}
                                />
                                <VStack w={'full'}>
                                    <Text>
                                        {name}
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
