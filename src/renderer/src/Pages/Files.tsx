import { Badge, Box, Center, HStack, Skeleton, Text, VStack } from '@chakra-ui/react'
import { SkeletonCircle, SkeletonText } from '../components/ui/skeleton'
import StorageConv from '../components/Dashboard/StorageConv'

function Files(): JSX.Element {
  return (
    <Box display={'flex'} flexDir={'row'}>
      <Box w={'1/3'} p={2} px={5} borderRadius={'lg'} padding={'3'} h={'40'}>
        <Skeleton loading={true} bg={"red"}>
          <Badge>Select</Badge>
        </Skeleton>
      </Box>
    </Box>
  )
}

export default Files
