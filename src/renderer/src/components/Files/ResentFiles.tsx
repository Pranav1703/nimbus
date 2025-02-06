import { Box, For, Group, HStack, Icon, IconButton, Table, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import Icons from '../../assets/Icons'
import getFileCategory from './FileCategory'
import { NativeSelectField, NativeSelectRoot } from '../ui/native-select'

interface FileProps {
    id: number
    name: string
    modified: string
}

const ResentFiles = ({
    Files,
    HeadingName
}: {
    Files: FileProps[]
    HeadingName: string
}): JSX.Element => {
    const options = () => {
        return (
          <NativeSelectRoot>
            <NativeSelectField>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </NativeSelectField>
          </NativeSelectRoot>
        );
      }
    return (
        <div>
            <Box pt={5}>
                <Table.Root size="lg">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader textStyle={'xl'}>{HeadingName}</Table.ColumnHeader>
                            <Table.ColumnHeader></Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <For each={Files}>
                            {(item, index) => {
                                const { category, color } = getFileCategory(item.name)
                                const CategoryIcon = Icons[category] || Icons['Add']
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>
                                            <HStack gap={4}>
                                                <Box
                                                    p={3}
                                                    bg={`${color}.900/80`}
                                                    borderRadius={'lg'}
                                                >
                                                    <Icon fontSize="2xl" color={`${color}.200`}>
                                                        <CategoryIcon />
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
                                                <IconButton variant="ghost" onClick={() => { options(); }}>
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
