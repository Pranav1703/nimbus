import { Box, Text } from '@chakra-ui/react'
import Main from '../components/Dashboard/Main'
import Actions from '../components/Dashboard/Actions'
import { drive_v3 } from 'googleapis'
import { useEffect, useState } from 'react'
export default function Dashboard(): JSX.Element {
  const [userinfo, setuserinfo] = useState<drive_v3.Schema$About>({})
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
  const Main_data = {
    curr_storage: Number(userinfo?.storageQuota?.usageInDrive),
    storage_percent: Number(
      ((Number(userinfo?.storageQuota?.usage) / 16105637376) * 100).toFixed(2)
    ),
    num_backups: 12,
    last_backup: 2,
    Num_versions: 60
  }
  return (
    <Box>
      <Main Main_data={Main_data} />
      <Text mt={5} textStyle={'xl'} fontWeight={'semibold'}>
        Quick Actions
      </Text>
      <Actions />
      <Text mt={5} textStyle={'xl'} fontWeight={'semibold'}>
        Recent Activities
      </Text>
    </Box>
  )
}
