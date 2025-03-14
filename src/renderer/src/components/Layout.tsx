import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import { Box, HStack, IconButton } from '@chakra-ui/react'
import { Avatar } from './ui/avatar'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from './ui/breadcrumb'
import { drive_v3 } from 'googleapis'
import { SkeletonCircle } from './ui/skeleton'
import Icons from '../assets/Icons'

function Layout(): JSX.Element {
    const location = useLocation()
    const [page, setPage] = useState('Dashboard')
    const [userinfo, setuserinfo] = useState<drive_v3.Schema$About>({})
    const [loading, setloading] = useState(true)

    useEffect(() => {
        // Extract and format the current route path
        const pathname = location.pathname
        const formattedPage =
            pathname
                .split('/')
                .filter(Boolean) // Remove empty strings
                .pop() || 'Dashboard' // Default to 'Dashboard' if pathname is root
        setPage(formattedPage.charAt(0).toUpperCase() + formattedPage.slice(1))
    }, [location.pathname]) // Trigger effect when location changes

    useEffect(() => {
        const logger = async (): Promise<void> => {
            try {
                const info = await window.api.getInfo() //user, storageQuota in Bytes, maxUploadSize
                if (info) {
                    setloading(false)
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

    const data = {
        userinfo,
        loading
    }

    return (
        <>
            <HStack gap={0} align="start">
                <Sidebar data={data} />
                <Box mx={5} pt={5} w={"-webkit-fill-available"}>
                    <HStack justifyContent={'flex-end'} mx={15}>
                        {data.loading ? (
                            <>
                                <SkeletonCircle size={12} />
                                <SkeletonCircle size={12} />
                            </>
                        ) : (
                            <>
                                <IconButton
                                    variant={'ghost'}
                                    aria-label={'Notifications'}
                                    borderRadius={'full'}
                                >
                                    <Icons.Notification />
                                </IconButton>
                                <Avatar
                                    name="userinfo['user']['displayName']"
                                    src={data.userinfo?.user?.photoLink || ''}
                                />
                            </>
                        )}
                    </HStack>
                    <BreadcrumbRoot m={3} size={'lg'} mb={5}>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        <BreadcrumbCurrentLink>{page}</BreadcrumbCurrentLink>
                    </BreadcrumbRoot>
                    <Outlet />
                </Box>
            </HStack>
        </>
    )
}

export default Layout
