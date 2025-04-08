import { Box, HStack, Icon, Table, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import Icons from "../../assets/Icons";

const RecentAct = (): JSX.Element => {
    const [items, setItems] = useState<Array<any>>([]);

    const BackupInfo = async (): Promise<void> => {
        try {
            const res = await window.api.getBackupInfo();
            console.log(res);
            setItems(res || []); // Ensure items is always an array
        } catch (error) {
            console.error("Error fetching backup info:", error);
            setItems([]); // Fallback to empty array
        }
    };

    useEffect(() => {
        BackupInfo();
    }, []);

    const getIcon = (status: string): { icon: IconType; color: string } => {
        const lastWord = status.split(" ").pop()?.toLowerCase();
        switch (lastWord) {
            case "completed":
                return { icon: Icons.success, color: "green" };
            case "warning":
            case "failed":
                return { icon: Icons.warning, color: "red" };
            case "started":
                return { icon: Icons.Backup1, color: "blue" };
            default:
                return { icon: Icons.More, color: "red" };
        }
    };

    return (
        <>
            <Text mt={5} textStyle={"xl"} fontWeight={"semibold"}>
                Recent Activities
            </Text>
            <Box
                p={2}
                borderRadius={"lg"}
                borderColor={"gray.800"}
                borderWidth={1}
                bg={"gray.900/50"}
                mt={4}
            >
                <Table.Root size="md">
                    <Table.Body>
                        {Array.isArray(items) && items.length > 0 ? (
                            items.map((item, index) => {
                                const { icon, color } = getIcon("Backup Completed"); // Use correct item status
                                const isLastRow = index === items.length - 1;
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell
                                            bg={"gray.900/50"}
                                            py={4}
                                            style={isLastRow ? { border: "none" } : {}}
                                        >
                                            <HStack>
                                                <Icon
                                                    as={icon}
                                                    boxSize={5}
                                                    color={`${color}.500`}
                                                    mr={2}
                                                />
                                                <VStack alignItems={"flex-start"} gap={1}>
                                                    <Text fontSize={"md"}>{item.status}</Text>
                                                    <Text color={"gray.400"}>{item.name}</Text>
                                                </VStack>
                                            </HStack>
                                        </Table.Cell>
                                        <Table.Cell
                                            textAlign="end"
                                            bg={"gray.900/50"}
                                            style={isLastRow ? { border: "none" } : {}}
                                        >
                                            {item.time}
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })
                        ) : (
                            <Table.Row bg={"transparent"}>
                                <Table.Cell color="gray.500" textAlign="center" py={4} 
                                            style={ {border: 'none' }}>
                                No recent activities</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table.Root>
            </Box>
        </>
    );
};

export default RecentAct;
