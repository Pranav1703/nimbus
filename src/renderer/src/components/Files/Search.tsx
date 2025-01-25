import { Button, HStack, Icon, Input, Kbd } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import { InputGroup } from '../ui/input-group'
import { LuDownload, LuSearch } from 'react-icons/lu'
import Mousetrap from 'mousetrap';

const Search = (): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Define the shortcut action
    const focusSearchInput = ():void => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // Bind the shortcut using Mousetrap
    Mousetrap.bind(['command+k', 'ctrl+k'], (e) => {
      e.preventDefault(); // Prevent browser's default behavior
      focusSearchInput();
    });

    // Cleanup binding on unmount
    return (): void => {
      Mousetrap.unbind(['command+k', 'ctrl+k']);
    };
  }, []);
  return (
    <div>
      <HStack>
        <InputGroup flex="1" startElement={<LuSearch />} endElement={<Kbd>⌘K</Kbd>}>
          <Input placeholder="Search Files..." ref={inputRef} />
        </InputGroup>
        <Button>
          <Icon>
            <LuDownload />
          </Icon>
          Download Files
        </Button>
      </HStack>
    </div>
  )
}

export default Search
