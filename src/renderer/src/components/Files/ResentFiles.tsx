import { Box, For, Group, HStack, Icon, IconButton, Table, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Icons from '../../assets/Icons'
import getFileCategory from './FileCategory'
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../ui/menu'
import {
    PaginationNextTrigger,
    PaginationPageText,
    PaginationPrevTrigger,
    PaginationRoot
} from '../ui/pagination'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import {
    ActionBarContent,
    ActionBarRoot,
    ActionBarSelectionTrigger,
    ActionBarSeparator
} from '../ui/action-bar'

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

    const [selection, setSelection] = useState<string[]>([])

    const hasSelection = selection.length > 0
    const [showseletcion, setShowSelection] = useState(false)

    const handleActionTrigger = (): void => {
        setShowSelection(!showseletcion)
        setSelection([])
    }

    const toggleSelection = (itemName: string): void => {
        setSelection((prev) =>
            prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName]
        )
        setShowSelection(true)
    }
    useEffect(() => {
        if (showseletcion && selection.length === 0) {
            setShowSelection(false)
        }
    }, [selection])
    return (
        <>
            <Box
                p={2}
                borderRadius={'lg'}
                borderColor={'gray.800'}
                borderWidth={1}
                bg={'gray.900/50'}
                w={'full'}
            >
                <Table.Root size="lg">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader textStyle={'xl'} bg={'gray.900/50'}>
                                {HeadingName}
                            </Table.ColumnHeader>
                            <Table.ColumnHeader bg={'gray.900/50'} textAlign={'end'}>
                                <IconButton variant="ghost" onClick={handleActionTrigger}>
                                    <Icons.Download />
                                </IconButton>
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <For each={visibleItems}>
                            {(item, index) => {
                                const { category, color } = getFileCategory(item.name)
                                const CategoryIcon = Icons[category] || Icons['Add']

                                const isLastRow = index === visibleItems.length - 1
                                return (
                                    <Table.Row
                                        key={index}
                                        _hover={{ bg: `${color}.800/10` }}
                                        bg={'transparent'}
                                        onClick={() => toggleSelection(item.name)}
                                        cursor="pointer"
                                    >
                                        <Table.Cell style={isLastRow ? { border: 'none' } : {}}>
                                            <HStack gap={4}>
                                                <Checkbox
                                                    top="1"
                                                    aria-label="Select row"
                                                    checked={selection.includes(item.name)}
                                                    onCheckedChange={(changes) => {
                                                        setSelection((prev) =>
                                                            changes.checked
                                                                ? [...prev, item.name]
                                                                : selection.filter(
                                                                      (name) => name !== item.name
                                                                  )
                                                        )
                                                    }}
                                                    hidden={!showseletcion}
                                                />
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
                                        <Table.Cell
                                            textAlign={'end'}
                                            style={isLastRow ? { border: 'none' } : {}}
                                        >
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
            <ActionBarRoot open={hasSelection}>
                <ActionBarContent>
                    <ActionBarSelectionTrigger>
                        {selection.length} selected
                    </ActionBarSelectionTrigger>
                    <ActionBarSeparator />
                    <Button variant="outline" size="sm">
                        Download <Icons.Download />
                    </Button>
                    <Button variant="outline" size="sm" colorPalette={"red"}>
                        Delete <Icons.warning />
                    </Button>
                </ActionBarContent>
            </ActionBarRoot>
        </>
    )
}

export default ResentFiles
