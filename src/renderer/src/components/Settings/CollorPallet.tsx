import { Box, HStack, Icon, Menu, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Switch } from '../ui/switch'
import {
    MenuContent,
    MenuItem,
    MenuRadioItem,
    MenuRadioItemGroup,
    MenuRoot,
    MenuTrigger
} from '../ui/menu'
import { Button } from '../ui/button'
import Icons from '../../assets/Icons'

const CollorPallet = (): JSX.Element => {
    const [color, setColor] = React.useState('Teal')
    
    const handleValueChange = (value: string) => {
        setColor(value)
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
                    <Text fontSize={'xl'} fontWeight={'semibold'}>General</Text>
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
                                    {color}
                                    <Icon>
                                        <Icons.ArrowDown />
                                    </Icon>
                                </Button>
                            </MenuTrigger>
                            <MenuContent>
                                <MenuRadioItemGroup
                                    value={color}
                                    onValueChange={(value) => {handleValueChange(value.value)}}
                                    defaultValue={color}
                                >
                                    <MenuRadioItem value="Teal">Teal</MenuRadioItem>
                                    <MenuRadioItem value="Orange">Orange</MenuRadioItem>
                                    <MenuRadioItem value="WhiteAlpha">WhiteAlpha</MenuRadioItem>
                                    <MenuRadioItem value="Cyan">Cyan</MenuRadioItem>
                                    <MenuRadioItem value="Blue">Blue</MenuRadioItem>
                                    <MenuRadioItem value="Green">Green</MenuRadioItem>
                                    <MenuRadioItem value="Yellow">Yellow</MenuRadioItem>
                                    <MenuRadioItem value="Red">Red</MenuRadioItem>
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
