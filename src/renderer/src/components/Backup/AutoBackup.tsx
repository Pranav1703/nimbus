import { Box, createListCollection, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { Switch } from '../ui/switch'
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from '../ui/select'
import { Button } from '../ui/button'
import { HiUpload } from 'react-icons/hi'
import { useAlert } from '../Alert'

function AutoBackup({ rootId }: { rootId }): JSX.Element {
    const [IsChecked, setIsChecked] = useState(false)
    const [selectedTime, setSelectedTime] = useState('')
    const [backupFileId, setBackupFileId] = useState<string>('')
    const [backupPath, setBackupPath] = useState<string>('')
    const { addAlert } = useAlert() // Now supports manual removal
    const frameworks = createListCollection({
        items: [
            { label: 'Every 6 Hours', value: '6_Hours' },
            { label: 'Daily', value: 'Daily' },
            { label: 'Weekly', value: 'Weekly' }
        ]
    })
    console.log(selectedTime)

    window.api.onFileChange(async (_event, path) => {
        console.log(path)
        if (!path) return
        await window.api.updateFile(backupPath, backupFileId)
    })
    const backup = async ():Promise<void> => {
        const userInfo = await window.api.getInfo()

        if (rootId && userInfo?.user?.emailAddress) {
            await window.api.saveUser(userInfo.user.emailAddress, rootId)
            const { id } = await window.api.fileUpload(backupPath, rootId)
            setBackupFileId(id!)
            window.api.initWatcher([backupPath])
            await window.api.savePath(userInfo.user.emailAddress, backupPath)
            const hash = await window.api.getFileHash(backupPath)
            await window.api.saveState(userInfo.user.emailAddress, backupPath, hash) //before app quits
        }
    }

    const handleFolderUpload = () => async (): Promise<void> => {
        try {
            console.log('Folder Upload function called')
            const multiOptions = {
                title: 'Select a File to Upload',
                buttonLabel: 'Upload',
                properties: ['openDirectory' as const] // Allows selecting a folder
            }

            const result = await window.api.showOpenDialog(multiOptions)

            if (result.canceled || !result.filePaths) {
                addAlert('error', 'Upload Cancelled', 2000)
                return
            }

            if (result.filePaths.length > 0) {
                // Set sticky alert
                addAlert('info', 'Uploading...', 2000, true)
                console.log('Selected Folder:', result.filePaths)
                setBackupPath(result.filePaths[0])
                await backup()
            }
        } catch (error) {
            console.error('Unexpected error:', error)
            addAlert('error', 'Something went wrong', 2000)
        }
    }
    return (
        <>
            <Box
                p={4}
                borderRadius={'lg'}
                borderColor={'gray.800'}
                borderWidth={1}
                w={'5/6'}
                bg={'gray.900/50'}
            >
                <VStack alignItems={'flex-start'} gap={2}>
                    <Text textStyle={'xl'} fontWeight={'medium'} pb={2}>
                        Automatic Backup
                    </Text>
                    <HStack
                        justifyContent={'space-between'}
                        w={'-webkit-fill-available'}
                        onClick={() => setIsChecked(!IsChecked)}
                    >
                        <VStack alignItems={'flex-start'} gap={1}>
                            <Text textStyle={'lg'}>Enable Automatic Backup</Text>
                            <Text color="gray.500" textStyle={'1sm'}>
                                Automatically backup your files at scheduled intervals
                            </Text>
                        </VStack>
                        <Switch checked={IsChecked} />
                    </HStack>
                    <SelectRoot
                        collection={frameworks}
                        size="md"
                        width="full"
                        disabled={!IsChecked}
                        onValueChange={(details: { value: string[] }) =>
                            setSelectedTime(details.value[0])
                        }
                    >
                        <SelectLabel pt={2} textStyle={'lg'} fontWeight={'normal'}>
                            Backup Frequency
                        </SelectLabel>
                        <SelectTrigger>
                            <SelectValueText placeholder="Backup Frequency..." />
                        </SelectTrigger>
                        <SelectContent>
                            {frameworks.items.map((movie) => (
                                <SelectItem item={movie} key={movie.value}>
                                    {movie.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </SelectRoot>
                    <VStack alignItems={'flex-start'} w={'-webkit-fill-available'}>
                        <Text
                            textStyle={'lg'}
                            pb={1}
                            color={!IsChecked || selectedTime == '6_Hours' ? 'gray' : ''}
                        >
                            Backup Time ( for daily/weekly backups )
                        </Text>
                        <Input
                            type="time"
                            disabled={
                                !IsChecked ||
                                (selectedTime !== 'Daily' && selectedTime !== 'Weekly')
                            }
                        />
                    </VStack>
                    <VStack alignItems={'flex-start'} w={'-webkit-fill-available'}>
                        <Text textStyle={'lg'} pb={1} color={!IsChecked ? 'gray' : ''}>
                            Track Folder
                        </Text>
                        <Button variant="outline" size="sm" onClick={() => handleFolderUpload()()} 
                        disabled={!IsChecked}>
                            <HiUpload /> Folder Location
                        </Button>
                    </VStack>
                </VStack>
            </Box>
        </>
    )
}

export default AutoBackup
