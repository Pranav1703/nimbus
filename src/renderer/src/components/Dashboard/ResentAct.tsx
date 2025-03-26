import { Box, HStack, Icon, Table, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { IconType } from 'react-icons'
import Icons from '../../assets/Icons'

const ResentAct = (): JSX.Element => {
    const items = [
        { status: 'Backup Completed', name: 'Documents folder - 256MB', time: '2 hours ago' },
        { status: 'New Backup Started', name: 'Pictures folder - 1.2GB', time: '5 hours ago' },
        { status: 'Backup Failed', name: 'Approaching storage limit', time: '1 day ago' }
    ]

    // Function to get the correct icon
    const getIcon = (status: string): {
        icon: IconType;
        color: string;
    } => {
        const lastWord = status.split(' ').pop()?.toLowerCase() // Extract the last word
        switch (lastWord) {
            case 'completed':
                return { icon: Icons.success, color: 'green' } // Checkmark for success
            case 'warning':
            case 'failed':
                return { icon: Icons.warning, color: 'red' } // Warning icon
            case 'started':
                return { icon: Icons.Backup1, color: 'blue' } // Upload/Backup icon
            default:
                return { icon: Icons.More, color: 'red' } // Default icon
        }
    }

    return (
        <>
            <Text mt={5} textStyle={'xl'} fontWeight={'semibold'}>
                Recent Activities
            </Text>
            <Box
                p={2}
                borderRadius={'lg'}
                borderColor={'gray.800'}
                borderWidth={1}
                bg={'gray.900/50'}
                mt={4}
            >
                <Table.Root size="md">
                    <Table.Body>
                        {items.map((item, index) => {
                            // Get the icon and color for each item
                            const { icon, color } = getIcon(item.status)
                            const isLastRow = index === items.length - 1
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell
                                        bg={'gray.900/50'}
                                        py={4}
                                        style={isLastRow ? { border: 'none' } : {}}
                                    >
                                        <HStack>
                                            <Icon
                                                as={icon}
                                                boxSize={5}
                                                color={`${color}.500`}
                                                mr={2}
                                            />
                                            <VStack alignItems={'flex-start'} gap={1}>
                                                <Text fontSize={'md'}>{item.status}</Text>
                                                <Text color={'gray.400'}>{item.name}</Text>
                                            </VStack>
                                        </HStack>
                                    </Table.Cell>
                                    <Table.Cell
                                        textAlign="end"
                                        bg={'gray.900/50'}
                                        style={isLastRow ? { border: 'none' } : {}}
                                    >
                                        {item.time}
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table.Root>
            </Box>
        </>
    )
}

export default ResentAct
