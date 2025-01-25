import { Box, For, Group, HStack, Icon, IconButton, Table, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import Icons from '../../assets/Icons'
import getFileCategory from './FileCategory'

const ResentFiles = (): JSX.Element => {
  const items = [
    {
      id: 1,
      name: 'Project_Report.pdf',
      modified: '2.4 MB · Modified 2 hours ago'
    },
    {
      id: 2,
      name: 'Screenshot_2023.png',
      modified: '856 KB · Modified 5 hours ago'
    },
    {
      id: 3,
      name: 'IMG20221103163317.mp4',
      modified: '856 KB · Modified 5 hours ago'
    }
  ]
  console.log(Icons['Documents'])
  return (
    <div>
      <Box pt={5}>
        <Table.Root size="lg">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textStyle={'xl'}>Recent Files</Table.ColumnHeader>
              <Table.ColumnHeader></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <For each={items}>
              {(item, index) => {
                const { category, color } = getFileCategory(item.name)
                console.log(category)
                const Icon = Icons[category] || Icons['Add']
                return (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <HStack gap={4}>
                        <Box p={3} bg={`${color}.900/80`} borderRadius={'lg'}>
                          <Icon fontSize="2xl" color={`${color}.100`}>
                            <Icon/>
                          </Icon>
                        </Box>
                        <VStack alignItems="flex-start" gap={1}>
                          <Text>{item.name}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {item.modified}
                          </Text>
                        </VStack>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell textAlign={'end'}>
                      <Group>
                        <IconButton variant="ghost">
                          <Icons.Download />
                        </IconButton>
                        <IconButton variant="ghost">
                          <Icons.More />
                        </IconButton>
                      </Group>
                    </Table.Cell>
                  </Table.Row>
                )
              }}
            </For>
          </Table.Body>
        </Table.Root>
      </Box>
    </div>
  )
}

export default ResentFiles
