import { Fieldset, FileUploadFileAcceptDetails, Group, Input } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import {
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTrigger
} from '../../ui/popover'
import { Button } from '../../ui/button'
import { Field } from '../../ui/field'
import { drive_v3 } from 'googleapis'
import { FileUploadRoot, FileUploadTrigger } from '../../ui/file-upload'
import { HiUpload } from 'react-icons/hi'
import { useAlert } from '../../Alert'

interface EditProfileProps {
    refreshName: () => void
    name: string
}

function Edit_Profile({ refreshName,name}: EditProfileProps): JSX.Element {
    const {addAlert} = useAlert();
    const [ChangePhoto, setChangePhoto] = React.useState(false)
    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        const form = event.currentTarget
        const nameInput = form.elements.namedItem('name') as HTMLInputElement
        await window.api.storeSet('Name', nameInput.value);
        console.log(await window.api.storeGet('Name'))
        refreshName();
        addAlert('success', 'Name updated successfully',2000)
    }
    const handlefileSubmit = async(details: FileUploadFileAcceptDetails): Promise<void> => {
        console.log(await window.api.storeGet('FileData'))
        console.log(details.files[0].path)
        const base64Image = await window.api.ImageToBase64(details.files[0].path);

        if (base64Image) {
            await window.api.storeSet('Image', base64Image);
            refreshName();
            console.log('Image saved successfully!');
            addAlert('success', 'Photo uploaded successfully',2000)
        }
        setChangePhoto(true)
    }
    return (
        <>
            <Group pt={2}>
                <PopoverRoot>
                    <PopoverTrigger asChild>
                        <Button size="sm" variant="solid">
                            Edit Profile
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody>
                            <form
                                onSubmit={(e) => {
                                    handleSubmit(e)
                                }}
                            >
                                <Fieldset.Root size="md" maxW="md" pt={2}>
                                    <Fieldset.Content>
                                        <Field label="Default Name" textStyle={'2xl'}>
                                            <Input
                                                name="name"
                                                defaultValue={name || ''}
                                                size={'sm'}
                                                id="name"
                                            />
                                        </Field>
                                    </Fieldset.Content>
                                    <Button type="submit" alignSelf="flex-start">
                                        Submit
                                    </Button>
                                </Fieldset.Root>
                            </form>
                        </PopoverBody>
                    </PopoverContent>
                </PopoverRoot>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setChangePhoto(true)}
                    hidden={ChangePhoto}
                >
                    Change Photo
                </Button>
                <FileUploadRoot
                    maxFiles={1}
                    accept="image/*"
                    hidden={!ChangePhoto}
                    onFileAccept={handlefileSubmit}
                >
                    <FileUploadTrigger asChild>
                        <Button variant="outline" size="sm">
                            <HiUpload /> Upload file
                        </Button>
                    </FileUploadTrigger>
                </FileUploadRoot>
            </Group>
        </>
    )
}

export default Edit_Profile
