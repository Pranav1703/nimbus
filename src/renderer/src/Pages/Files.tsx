import { Box } from '@chakra-ui/react'
import Search from '../components/Files/Search'
import Hero from '../components/Files/Hero'
import ResentFiles from '../components/Files/ResentFiles'

function Files(): JSX.Element {
  return (
    <Box>
      <Search />
      <Hero/>
      <ResentFiles/>
    </Box>
  )
}

export default Files
