import { VStack } from '@chakra-ui/react'
import Search from '../components/Files/Search'
import Hero from '../components/Files/Hero'
import ResentFiles from '../components/Files/ResentFiles'
import { useEffect, useState } from 'react'
import getFileCategory from '../components/Files/FileCategory'

function Files({ rootId }: { rootId: string }): JSX.Element {
    const [SearchVal, SetSearchVal] = useState('')
    const [ButtonVal, SetButtonVal] = useState('')
    const [fileList, setFileList] = useState<Array<any>>([])
    const handleSerach = (data): void => {
        SetSearchVal(data)
    }

    const handleButton = (data): void => {
        SetButtonVal(data)
        console.log(data)
    }

    const getFiles = async (): Promise<void> => {
        try {
            const resp = await window.api.getList(rootId)
            console.log('file list array: ', resp)
            setFileList(resp)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getFiles()
    }, [])

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
        fileList
    ): { Documents: number; Images: number; Videos: number; Folder: number } => {
        const categoryCount = {
            Documents: 0,
            Images: 0,
            Videos: 0,
            Folder: 0
        }

        fileList.forEach((item) => {
            const category = getFileCategory(item.name).category
            if (Object.prototype.hasOwnProperty.call(categoryCount, category)) {
                categoryCount[category] += 1
            }
        })

        return categoryCount
    }

    const SearchedContent = fileList.filter((item) =>
        item.name.toLowerCase().includes(SearchVal.toLowerCase())
    )

    const FilteredContent = fileList.filter((item) =>
        getFileCategory(item.name).category.toLowerCase().includes(ButtonVal.toLowerCase())
    )

    const CombinedFilterContent = FilteredContent.filter((item) =>
        item.name.toLowerCase().includes(SearchVal.toLowerCase())
    )

    return (
        <VStack alignItems={'flex-start'} w={'full'} gap={6}>
            <Search SearchVal={handleSerach} />
            <Hero ButtonVal={handleButton} Count={countFileCategories(fileList)} rootid={rootId}/>
            <ResentFiles
                Files={
                    SearchVal
                        ? ButtonVal
                            ? CombinedFilterContent
                            : SearchedContent
                        : ButtonVal
                          ? FilteredContent
                          : fileList
                }
                HeadingName={SearchVal ? 'Searched Files' : 'Recent Files'}
                getFiles={getFiles}
            />
        </VStack>
    )
}

export default Files
