import { Box, For, Group, HStack, Icon, IconButton, Table, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
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
import { useAlert } from '../Alert'
interface FileProps {
    id: number
    name: string
    size: number
    modifiedByMeTime: string
}

const ResentFiles = ({
    Files,
    HeadingName,
    getFiles
}: {
    Files: FileProps[]
    HeadingName: string
    getFiles: () => void
}): JSX.Element => {
    const [page, setPage] = useState(1)
    const count = Files.length
    const pageSize = 5
    const startRange = (page - 1) * pageSize
    const endRange = startRange + pageSize

    const visibleItems:FileProps[] = Files.slice(startRange, endRange)

    const [selection, setSelection] = useState<string[]>([])

    const hasSelection = selection.length > 0
    const [showseletcion, setShowSelection] = useState(false)
    const { addAlert,removeAlert } = useAlert()
    const handleActionTrigger = (): void => {
        setShowSelection(!showseletcion)
        setSelection([])
    }

    const formatBytesBase2 = (bytes: number): string | null => {
        if(typeof bytes !== 'number' || isNaN(bytes)) {
            return null // Handle invalid input gracefully
        }

        if (bytes === 0) {
            return '0 Bytes'
        }

        const k = 1024
        const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        let i = 0
        while (bytes >= k && i < sizes.length - 1) {
            bytes /= k
            i++
        }
        // `${bytes.toFixed(2)} ${sizes[i]}`
        return isNaN(bytes) ? null : `${bytes.toFixed(2)} ${sizes[i]}`
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

    const handleDownload = async (fileId, fileName): Promise<void> => {
        try {
            const { filePath, canceled } = await window.api.showSaveDialog({
                title: 'Select Download Location',
                defaultPath: fileName,
                buttonLabel: 'Save',
                filters: [{ name: 'All Files', extensions: ['*'] }]
            })

            if (canceled || !filePath) {
                addAlert('error', 'Download Cancelled', 2000)
                return
            }

            // Set sticky alert
            const alertId = addAlert('info', 'Downloading...', null, true)

            try {
                await window.api.downloadFile(fileId, filePath)
                removeAlert(alertId) // Remove sticky alert after success
                addAlert('success', 'Download Completed', 2000)
            } catch (downloadError) {
                console.error('Error during download:', downloadError)
                removeAlert(alertId) // Remove sticky alert on failure
                addAlert('error', 'Download Failed', 2000)
            }
        } catch (error) {
            console.error('Unexpected error:', error)
            addAlert('error', 'Something went wrong', 2000)
        }
    }

    const handleDelete = async (fileId, fieldname): Promise<void> => {
        try {
            await window.api.deleteFile(fileId)
            addAlert('success', `${fieldname} Deleted Successfully`, 2000)
            getFiles()
        } catch (error) {
            console.log(error)
            addAlert('error', 'Error in Deleting File', 2000)
        }
    }
    const handleDownloadAndOpen = async (fileId, fielName): Promise<void> => {
        try {
            addAlert('info', 'Opening...', 2000, true)
            const filePath = await window.api.CreateTempFile(fielName)
            if (filePath) {
                await window.api.downloadFile(fileId, filePath)
                await window.api.OpenFileLocation(filePath)
            } else {
                addAlert('error', 'Failed to create temp file.', 2000)
            }
            addAlert('success', 'File opened successfully!', 2000)
        } catch (error) {
            console.error('Error:', error)
            addAlert('error', 'Failed to open file.', 2000)
        }
    }

    const formatDate = (modifiedByMeTime): string => {
        const dateObj = new Date(modifiedByMeTime)
        const formattedDate = new Intl.DateTimeFormat('en-GB').format(dateObj)
        return formattedDate
    }

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
                                        
                                        cursor="pointer"
                                    >
                                        <Table.Cell style={isLastRow ? { border: 'none' } : {}} onClick={() => toggleSelection(item.name)}>
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
                                                    
                                                        {formatBytesBase2(Number(item.size))} · Modified{' '}
                                                        {formatDate(item.modifiedByMeTime)}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        </Table.Cell>
                                        <Table.Cell
                                            textAlign={'end'}
                                            style={isLastRow ? { border: 'none' } : {}}
                                        >
                                            <Group>
                                                <IconButton
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleDownload(item.id, item.name)
                                                    }
                                                >
                                                    <Icons.Download />
                                                </IconButton>
                                                <MenuRoot>
                                                    <MenuTrigger asChild>
                                                        <IconButton variant="ghost">
                                                            <Icons.More />
                                                        </IconButton>
                                                    </MenuTrigger>
                                                    <MenuContent>
                                                        <MenuItem
                                                            value="open-file"
                                                            onClick={() =>
                                                                handleDownloadAndOpen(
                                                                    item.id,
                                                                    item.name
                                                                )
                                                            }
                                                        >
                                                            Open File...
                                                        </MenuItem>
                                                        <MenuItem
                                                            value="delete"
                                                            color="fg.error"
                                                            _hover={{
                                                                bg: 'bg.error',
                                                                color: 'fg.error'
                                                            }}
                                                            onClick={() =>
                                                                handleDelete(item.id, item.name)
                                                            }
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            selection.forEach((name) => {
                                const itemToDownload = visibleItems.find(
                                    (item) => item.name === name
                                )
                                if (itemToDownload) {
                                    handleDownload(itemToDownload.id, itemToDownload.name)
                                }
                            })
                            setSelection([]) // Clear selection after deletion
                        }}
                    >
                        Download <Icons.Download />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        colorPalette={'red'}
                        onClick={() => {
                            selection.forEach((name) => {
                                const itemToDelete = visibleItems.find((item) => item.name === name)
                                if (itemToDelete) {
                                    handleDelete(itemToDelete.id, itemToDelete.name)
                                }
                            })
                            setSelection([]) // Clear selection after deletion
                        }}
                    >
                        Delete <Icons.warning />
                    </Button>
                </ActionBarContent>
            </ActionBarRoot>
        </>
    )
}

export default ResentFiles
