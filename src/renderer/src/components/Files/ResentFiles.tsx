import {
    Box,
    Center,
    For,
    Group,
    HStack,
    Icon,
    IconButton,
    Table,
    Text,
    VStack
} from '@chakra-ui/react'
import React, { useState } from 'react'
import Icons from '../../assets/Icons'
import getFileCategory from './FileCategory'
import { NativeSelectField, NativeSelectRoot } from '../ui/native-select'
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../ui/menu'
import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPageText,
    PaginationPrevTrigger,
    PaginationRoot
} from '../ui/pagination'

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
    const [page, setPage] = useState(1)
    const count = Files.length
    const pageSize = 5
    const startRange = (page - 1) * pageSize
    const endRange = startRange + pageSize

    const visibleItems = Files.slice(startRange, endRange)
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
                        <For each={visibleItems}>
                            {(item, index) => {
                                const { category, color } = getFileCategory(item.name)
                                const CategoryIcon = Icons[category] || Icons['Add']
                                return (
                                    <Table.Row key={index} _hover={{ bg: `${color}.800/10` }}>
                                        <Table.Cell>
                                            <HStack gap={4}>
                                                <Box
                                                    p={3}
                                                    bg={`${color}.800/10`}
                                                    borderRadius={'lg'}
                                                >
                                                    <Icon fontSize="2xl" color={`${color}.400`}>
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
                                                <MenuRoot>
                                                    <MenuTrigger asChild>
                                                        <IconButton variant="ghost">
                                                            <Icons.More />
                                                        </IconButton>
                                                    </MenuTrigger>
                                                    <MenuContent>
                                                        <MenuItem value="open-file">
                                                            Open File...
                                                        </MenuItem>
                                                        <MenuItem
                                                            value="delete"
                                                            color="fg.error"
                                                            _hover={{
                                                                bg: 'bg.error',
                                                                color: 'fg.error'
                                                            }}
                                                        >
                                                            Delete...
                                                        </MenuItem>
                                                    </MenuContent>
                                                </MenuRoot>
                                            </Group>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }}
                        </For>
                    </Table.Body>
                </Table.Root>
                <HStack justifyContent="center" mt={5} hidden={count <= pageSize}>
                    <PaginationRoot
                        page={page}
                        count={count}
                        pageSize={pageSize}
                        onPageChange={(e) => setPage(e.page)}
                    >
                        <HStack>
                            <PaginationPrevTrigger />
                            <PaginationPageText />
                            <PaginationNextTrigger />
                        </HStack>
                    </PaginationRoot>
                </HStack>
            </Box>
        </div>
    )
}

export default ResentFiles
