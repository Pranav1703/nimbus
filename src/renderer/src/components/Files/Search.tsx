import { Button, HStack, Icon, Input, Kbd } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import { InputGroup } from '../ui/input-group'
import Mousetrap from 'mousetrap'
import Icons from '../../assets/Icons'

const Search = ({ SearchVal }: { SearchVal: (value: string) => void }): JSX.Element => {
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        // Define the shortcut action
        const focusSearchInput = (): void => {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }

        // Bind the shortcut using Mousetrap
        Mousetrap.bind(['command+k', 'ctrl+k'], (e) => {
            e.preventDefault() // Prevent browser's default behavior
            focusSearchInput()
        })

        // Cleanup binding on unmount
        return (): void => {
            Mousetrap.unbind(['command+k', 'ctrl+k'])
        }
    }, [])
    const handleSearchChange = (e): void => {
        SearchVal(e.target.value)
    }
    return (
        <div>
            <HStack>
                <InputGroup flex="1" startElement={<Icons.Search />} endElement={<Kbd>⌘K</Kbd>}>
                    <Input
                        placeholder="Search Files..."
                        ref={inputRef}
                        onChange={(e) => handleSearchChange(e)}
                    />
                </InputGroup>
                <Button>
                    <Icon>
                        <Icons.Download />
                    </Icon>
                    Download Files
                </Button>
            </HStack>
        </div>
    )
}

export default Search
