import React, { createContext, useContext, useState } from "react";
import { Alert, Stack, Box, HStack, VStack } from "@chakra-ui/react";

const AlertContext = createContext<any>(null);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<{ id: number; type: string; message: string }[]>([]);

  const addAlert = (type: "error" | "info" | "warning" | "success", message: string, time: number | null = 2000) => {
    const id = Date.now();
    setAlerts((prev) => {
      const newAlerts = [...prev, { id, type, message }];
      return newAlerts.slice(-3); // Keep only the last 3 alerts
    });

    // Auto-remove only if time is provided
    if (time !== null) {
      setTimeout(() => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      }, time);
    }

    return id; // Return alert ID for manual removal
  };

  // ✅ **New: Remove Alert Manually**
  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ addAlert, removeAlert }}>
      {children}
      <AlertStack alerts={alerts} />
    </AlertContext.Provider>
  );
};

// AlertStack Component (displays alerts)
const AlertStack = ({ alerts }: { alerts: { id: number; type: string; message: string }[] }) => {
  return (
    <Box position="fixed" top="20px" left="50%" transform="translateX(-50%)" zIndex="1000">
      <VStack gap={3} width="400px">
        {alerts.map((alert) => (
          <Alert.Root key={alert.id} status={alert.type}>
            <Alert.Indicator />
            <Alert.Title>{alert.message}</Alert.Title>
          </Alert.Root>
        ))}
      </VStack>
    </Box>
  );
};

// Custom hook to use alert
export const useAlert = () => {
  return useContext(AlertContext);
};
