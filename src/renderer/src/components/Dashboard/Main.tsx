import { Box, For, FormatByte, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { MdHistoryToggleOff, MdSettingsBackupRestore, MdStorage } from 'react-icons/md'
import { ProgressBar, ProgressRoot } from '../ui/progress'

function Main({
  Main_data
}: {
  Main_data: {
    curr_storage: number
    storage_percent: number
    num_backups: number
    last_backup: number
    Num_versions: number
  }
}): JSX.Element {
  const values = [
    {
      name: 'Total Storage Used',
      data: Main_data.curr_storage,
      icon: <MdStorage />,
      value: Main_data.curr_storage,
      description: Main_data.storage_percent + ' % of 100 GB used'
    },
    {
      name: 'Active Backups',
      data: Main_data.num_backups,
      icon: <MdSettingsBackupRestore />,
      description: 'Last backup: '+Main_data.last_backup+" hours ago"
    },
    {
      name: 'Version History',
      data: Main_data.Num_versions,
      icon: <MdHistoryToggleOff />,
      description: 'Versions across all files'
    }
  ]
  return (
    <div>
      <HStack>
        <For each={values}>
          {(item, index) => (
            <Box
              bg={'gray.800'}
              w={'1/3'}
              p={2}
              px={5}
              borderRadius={'lg'}
              padding={'3'}
              key={index}
              h={'40'}
            >
              <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                <VStack alignItems={'flex-start'}>
                  <Text color={'gray.400'}>{item.name}</Text>
                  <Text textStyle={'2xl'} fontWeight={'semibold'}>
                  {item.name === 'Total Storage Used' ? (
                    <FormatByte value={item.data} />):(
                      <>{item.data}</>
                    )
                  }
                  </Text>
                </VStack>
                <Icon color={'teal'} size={'lg'}>
                  {item.icon}
                </Icon>
              </HStack>
              {item.name === 'Total Storage Used' ? (
                <ProgressRoot defaultValue={item.value} shape={'full'} size={'md'} pt={5}>
                  <ProgressBar />
                </ProgressRoot>
              ) : (
                <></>
              )}

              <Text pt={'3'} color={'gray.400'}>
                {item.description}
              </Text>
            </Box>
          )}
        </For>{' '}
      </HStack>
    </div>
  )
}

export default Main
