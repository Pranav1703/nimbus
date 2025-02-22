import { Center, HStack } from '@chakra-ui/react'
import Profile from '../components/Settings/Profile/Profile'
import Connected_Acc from '../components/Settings/Connected_Acc'
import StorageUsage from '../components/Settings/StorageUsage'
import DeleteAcc from '../components/Settings/DeleteAcc'
import { useEffect, useState } from 'react'
import { drive_v3 } from 'googleapis'
import CollorPallet from '../components/Settings/CollorPallet'

function Settings(): JSX.Element {
    const [userinfo, setuserinfo] = useState<drive_v3.Schema$About>({})
    const [loading, setloading] = useState(true)
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
    return (
        <>
            <HStack flexDirection={'column'} gap={4} mb={15}>
                <Profile userinfo={userinfo} loading={loading}/>
                <Connected_Acc userinfo={userinfo} loading={loading}/>
                <StorageUsage userinfo={userinfo} loading={loading}/>
                <DeleteAcc />
                <CollorPallet/>
            </HStack>
        </>
    )
}

export default Settings
