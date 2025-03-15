import { Avatar } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { Checkbox } from '../components/ui/checkbox'
import { CloseButton } from '../components/ui/close-button'
import { ColorModeButton } from '../components/ui/color-mode'
import { Slider } from '../components/ui/slider'
import { FileUploadRoot, FileUploadTrigger, FileUploadList } from '../components/ui/file-upload'
import { HiUpload } from 'react-icons/hi'
function Test2(): JSX.Element {
    return (
        <>
            <Avatar />
            <Button>Hello</Button>
            <Checkbox />
            <ColorModeButton />
            <CloseButton />
            <Slider />
            <FileUploadRoot>
                <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm">
                        <HiUpload /> Upload file
                    </Button>
                </FileUploadTrigger>
                <FileUploadList />
            </FileUploadRoot>
        </>
    )
}
export default Test2
