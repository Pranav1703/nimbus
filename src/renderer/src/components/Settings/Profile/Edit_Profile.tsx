import { Fieldset, FileUploadFileAcceptDetails, Group, Input } from '@chakra-ui/react'
import React from 'react'
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
    userinfo: drive_v3.Schema$About
}

function Edit_Profile({ userinfo }: EditProfileProps): JSX.Element {
    const addAlert = useAlert();
    const [ChangePhoto, setChangePhoto] = React.useState(false)
    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        const form = event.currentTarget
        const nameInput = form.elements.namedItem('name') as HTMLInputElement
        await window.api.storeSet('Name', nameInput.value);
        console.log(await window.api.storeGet('Name'))
        addAlert('success', 'Name updated successfully')
    }
    const handlefileSubmit = (details: FileUploadFileAcceptDetails): void => {
        console.log(details)
        setChangePhoto(true)
        addAlert('success', 'Photo uploaded successfully')
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
                                                defaultValue={userinfo?.user?.displayName || ''}
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
