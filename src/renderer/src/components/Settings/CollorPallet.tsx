import { Box, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Switch } from '../ui/switch'
import { MenuContent, MenuRadioItem, MenuRadioItemGroup, MenuRoot, MenuTrigger } from '../ui/menu'
import { Button } from '../ui/button'
import Icons from '../../assets/Icons'

interface CollorPalletProps {
    selectedColor: string;
    onChange: (color: string) => void;
  }


const CollorPallet = ({ selectedColor, onChange }: CollorPalletProps): JSX.Element => {
    
    const handleValueChange = (value: string):void => {
        onChange(value.toLowerCase())
    }
    return (
        <>
            <Box
                p={4}
                borderRadius={'lg'}
                borderColor={'gray.800'}
                borderWidth={1}
                w={'3/4'}
                bg={'gray.900/50'}
            >
                <VStack alignItems={'flex-start'} gap={3}>
                    <Text fontSize={'xl'} fontWeight={'semibold'}>
                        General
                    </Text>
                    <HStack justifyContent={'space-between'} w={'-webkit-fill-available'}>
                        <VStack alignItems={'flex-start'} gap={1}>
                            <Text textStyle={'lg'}>Launch on System Startup</Text>
                            <Text color="gray.500" textStyle={'1sm'}>
                                Automatically start Nimbus when your system boots up
                            </Text>
                        </VStack>
                        <Switch />
                    </HStack>
                    <VStack w={'full'} alignItems={'flex-start'}>
                        <Text>Collor Pallet</Text>
                        <MenuRoot>
                            <MenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    w={'full'}
                                    justifyContent={'space-between'}
                                >
                                    {selectedColor}
                                    <Icon>
                                        <Icons.ArrowDown />
                                    </Icon>
                                </Button>
                            </MenuTrigger>
                            <MenuContent>
                                <MenuRadioItemGroup
                                    value={selectedColor}
                                    onValueChange={(value) => {
                                        handleValueChange(value.value)
                                    }}
                                    defaultValue={selectedColor}
                                >
                                    <MenuRadioItem value="teal">Teal</MenuRadioItem>
                                    <MenuRadioItem value="orange">Orange</MenuRadioItem>
                                    <MenuRadioItem value="cyan">Cyan</MenuRadioItem>
                                    <MenuRadioItem value="blue">Blue</MenuRadioItem>
                                    <MenuRadioItem value="green">Green</MenuRadioItem>
                                    <MenuRadioItem value="yellow">Yellow</MenuRadioItem>
                                    <MenuRadioItem value="red">Red</MenuRadioItem>
                                </MenuRadioItemGroup>
                            </MenuContent>
                        </MenuRoot>
                    </VStack>
                </VStack>
            </Box>
        </>
    )
}

export default CollorPallet
