import { Box } from '@chakra-ui/react'
import Search from '../components/Files/Search'
import Hero from '../components/Files/Hero'
import ResentFiles from '../components/Files/ResentFiles'
import { useState } from 'react'
import getFileCategory from '../components/Files/FileCategory'

function Files(): JSX.Element {
    const [SearchVal, SetSearchVal] = useState('')
    const [ButtonVal, SetButtonVal] = useState('')

    const handleSerach = (data): void => {
        SetSearchVal(data)
    }

    const handleButton = (data): void => {
        SetButtonVal(data)
        console.log(data)
    }

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

    const countFileCategories = (items) => {
      const categoryCount = {};
      
      items.forEach(item => {
          const category = getFileCategory(item.name).category;
          categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
      
      return categoryCount;
  }
    console.log(countFileCategories(Items))

    const SearchedContent = Items.filter((item) =>
        item.name.toLowerCase().includes(SearchVal.toLowerCase())
    )

    const FilteredContent = Items.filter((item) =>
        getFileCategory(item.name).category.toLowerCase().includes(ButtonVal.toLowerCase())
    )

    const CombinedFilterContent = FilteredContent.filter((item) =>
        item.name.toLowerCase().includes(SearchVal.toLowerCase())
    )

    return (
        <Box>
            <Search SearchVal={handleSerach} />
            <Hero ButtonVal={handleButton} />
            <ResentFiles
                Files={
                    SearchVal
                        ? ButtonVal
                            ? CombinedFilterContent
                            : SearchedContent
                        : ButtonVal
                          ? FilteredContent
                          : Items
                }
                HeadingName={SearchVal ? 'Searched Files' : 'Recent Files'}
            />
        </Box>
    )
}

export default Files
