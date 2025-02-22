import { Box, For, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { MdHistoryToggleOff, MdSettingsBackupRestore, MdStorage } from 'react-icons/md'
import { ProgressBar, ProgressRoot } from '../ui/progress'
import StorageConv from './StorageConv'
import { Skeleton } from '../ui/skeleton'
import { useTheme } from 'next-themes'
import { system } from '../theme'

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
  const [loading, setLoading] = useState(true)

  // Check if any of the values are NaN
  useEffect(() => {
    if (
      isNaN(Main_data.curr_storage) ||
      isNaN(Main_data.storage_percent) ||
      isNaN(Main_data.num_backups) ||
      isNaN(Main_data.last_backup) ||
      isNaN(Main_data.Num_versions)
    ) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [Main_data])

  const values = [
    {
      name: 'Total Storage Used',
      data: Main_data.curr_storage,
      icon: <MdStorage />,
      value: Math.floor(Main_data.storage_percent),
      description: Main_data.storage_percent + ' % of 100 GB used'
    },
    {
      name: 'Active Backups',
      data: Main_data.num_backups,
      icon: <MdSettingsBackupRestore />,
      description: 'Last backup: ' + Main_data.last_backup + ' hours ago'
    },
    {
      name: 'Version History',
      data: Main_data.Num_versions,
      icon: <MdHistoryToggleOff />,
      description: 'Versions across all files'
    }
  ]

  // const { theme, setTheme } = useTheme()
  // if (system._config.globalCss) {
  //   if (system._config.globalCss.html.colorPalette) {
  //     setTheme(system._config.globalCss.html.colorPalette as string)
  //   }
  // }
  console.log(system)

  return (
    <div>
      <HStack >
        <For each={values}>
          {(item, index) => (
            <Box
              w={'1/3'}
              p={2}
              px={5}
              borderRadius={'lg'}
              padding={'3'}
              key={index}
              h={'40'}
              borderWidth={1}
              
            >
              <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                <VStack alignItems={'flex-start'}>
                  <Text color={'gray.400'}>{item.name}</Text>
                  <Text textStyle={'2xl'} fontWeight={'semibold'} as={'span'}>
                    {item.name === 'Total Storage Used' ? (
                      <StorageConv bytes={item.data} />
                    ) : loading ? (
                      <Skeleton w={'100px'} h={'7'} mt={1} variant="shine" />
                    ) : (
                      <>{item.data}</>
                    )}
                  </Text>
                </VStack>
                <Icon size={'lg'} color={"teal"}>
                  {item.icon}
                </Icon>
              </HStack>
              {item.name === 'Total Storage Used' ? (
                loading ? (
                  <Skeleton w={'full'} h={'7'} mt={3} variant="shine" />
                ) : (
                  <ProgressRoot defaultValue={item.value} shape={'full'} size={'md'} pt={5}>
                    <ProgressBar />
                  </ProgressRoot>
                )
              ) : (
                <></>
              )}

              {loading ? (
                <Skeleton w={'full'} h={'7'} mt={1} variant="shine" />
              ) : (
                <Text pt={'3'} color={'gray.400'}>
                  {item.description}
                </Text>
              )}
            </Box>
          )}
        </For>{' '}
      </HStack>
    </div>
  )
}

export default Main
