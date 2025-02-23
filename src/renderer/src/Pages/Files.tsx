import { Box, VStack } from '@chakra-ui/react'
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
            id: 5,
            name: 'School',
            modified: '856 KB · Modified 5 hours ago'
        },
        {
            id: 6,
            name: 'Screenshot_2025.png',
            modified: '856 KB · Modified 5 hours ago'
        },
        {
            id: 7,
            name: 'IMG20221103163319.mp4',
            modified: '856 KB · Modified 5 hours ago'
        },
        {
            id: 8,
            name: 'Schoow',
            modified: '856 KB · Modified 5 hours ago'
        }
    ]

    const countFileCategories = (
        items
    ): { Documents: number; Images: number; Videos: number; Folder: number } => {
        const categoryCount = {
            Documents: 0,
            Images: 0,
            Videos: 0,
            Folder: 0
        }

        items.forEach((item) => {
            const category = getFileCategory(item.name).category
            if (Object.prototype.hasOwnProperty.call(categoryCount, category)) {
                categoryCount[category] += 1
            }
        })

        return categoryCount
    }

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
            <VStack alignItems={'flex-start'} w={"full"} gap={6}>
                <Search SearchVal={handleSerach} />
                <Hero ButtonVal={handleButton} Count={countFileCategories(Items)} />
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
            </VStack>
    )
}

export default Files
