import { Avatar } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { Checkbox } from '../components/ui/checkbox'
import { CloseButton } from '../components/ui/close-button'
import { ColorModeButton } from '../components/ui/color-mode'
import { Slider } from '../components/ui/slider'

function Test2(): JSX.Element {
  return (
    <>
      <Avatar />
      <Button>Hello</Button>
      <Checkbox />
      <ColorModeButton />
      <CloseButton />
      <Slider />
    </>
  )
}
export default Test2
