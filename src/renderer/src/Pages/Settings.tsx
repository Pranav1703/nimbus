import { Center, HStack } from '@chakra-ui/react'
import Profile from '../components/Settings/Profile/Profile'
import Connected_Acc from '../components/Settings/Connected_Acc'
import StorageUsage from '../components/Settings/StorageUsage'
import DeleteAcc from '../components/Settings/DeleteAcc'
import { useEffect, useState } from 'react'
import { drive_v3 } from 'googleapis'
import CollorPallet from '../components/Settings/CollorPallet'

interface CollorPalletProps {
    selectedColor: string
    onChange: (color: string) => void
    fetchName: () => void
    name: string
    Image: string
}

function Settings({ selectedColor, onChange, fetchName, name, Image }: CollorPalletProps): JSX.Element {
    const [userinfo, setuserinfo] = useState<drive_v3.Schema$About>({})
    const [loading, setloading] = useState(true)

    useEffect(() => {
        const logger = async (): Promise<void> => {
            try {
                const info = await window.api.getInfo() //user, storageQuota in Bytes, maxUploadSize
                if (info) {
                    setloading(false)
                    setuserinfo(info)
                    if (info.user && (await window.api.storeGet('Name')) === undefined) {
                        if (info.user.displayName) {
                            await window.api.storeSet('Name', info.user.displayName)
                        }
                    }
                    if (info.user && (await window.api.storeGet('Image')) === undefined) {
                        if (info.user.photoLink) {
                            await window.api.storeSet('Image', info.user.photoLink)
                        }
                    }
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
                <Profile userinfo={userinfo} loading={loading} refreshName={fetchName} name={name} Image={Image}/>
                <CollorPallet selectedColor={selectedColor} onChange={onChange} />
                <Connected_Acc userinfo={userinfo} loading={loading} />
                <StorageUsage userinfo={userinfo} loading={loading} />
                <DeleteAcc />
            </HStack>
        </>
    )
}

export default Settings
