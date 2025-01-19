import { Box, Center, Text } from '@chakra-ui/react'
import Main from '../components/Dashboard/Main'
import Actions from '../components/Dashboard/Actions'

export default function Dashboard(): JSX.Element {
    const Main_data={
        curr_storage: 45.8, //should send in bytes
        storage_percent: 65,
        num_backups: 12,
        last_backup: 2,
        Num_versions: 60,
    }
  return (
    <Box m={5}>
        <Main Main_data={Main_data}/>
        <Text mt={5} textStyle={"xl"} fontWeight={"semibold"}>Quick Actions</Text>
        <Actions/>
        <Text mt={5} textStyle={"xl"} fontWeight={"semibold"}>Recent Activities</Text>
    </Box>
  )
}
