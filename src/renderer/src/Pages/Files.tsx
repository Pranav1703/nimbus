import { Box } from '@chakra-ui/react'
import Search from '../components/Files/Search'
import Hero from '../components/Files/Hero'
import ResentFiles from '../components/Files/ResentFiles'
import { useState } from 'react'

function Files(): JSX.Element {
    const [SearchVal, SetSearchVal] = useState('')
    const handleSerach = (data):void => {
      SetSearchVal(data)
    }
    console.log(SearchVal)

    const Items = [
      {
        id: 1,
        name: 'Project_Report.pdf',
        modified: '2.4 MB · Modified 2 hours ago'
      },
      {
        id: 2,
        name: 'Screenshot_2023.png',
        modified: '856 KB · Modified 5 hours ago'
      },
      {
        id: 3,
        name: 'IMG20221103163317.mp4',
        modified: '856 KB · Modified 5 hours ago'
      },
      {
        id: 4,
        name: 'mp320221103163317.mp3',
        modified: '856 KB · Modified 5 hours ago'
      },
      {
        id: 5,
        name: 'IMG20221103163317.mp4',
        modified: '856 KB · Modified 5 hours ago'
      }
    ]

    const SearchedContent = Items.filter((item) => item.name.toLowerCase().includes(SearchVal.toLowerCase()));
    return (
        <Box>
            <Search SearchVal={handleSerach}/>
            <Hero />
            <ResentFiles Files={SearchVal ? SearchedContent : Items} HeadingName={SearchVal ? "Searched Files" : "Recent Files"} />
        </Box>
    )
}

export default Files
