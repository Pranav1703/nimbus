import { Center, HStack } from '@chakra-ui/react'
import AutoBackup from '../components/Backup/AutoBackup'
import AdvancedOpt from '../components/Backup/AdvancedOpt'

function Backup({rootId}:{rootId}): JSX.Element {
  return (
    <div>
      <HStack flexDirection={'column'} gap={4}>
        <AutoBackup rootId={rootId}/>
        <AdvancedOpt/>
      </HStack>
    </div>
  )
}

export default Backup
