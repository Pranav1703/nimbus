// CustomChakraProvider.tsx
import React, { useMemo } from 'react';
import { ChakraProvider, createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

interface CustomChakraProviderProps {
  colorPalette: string;
  children: React.ReactNode;
}

const CustomChakraProvider = ({ colorPalette, children }: CustomChakraProviderProps) => {
  const theme = useMemo(() => {
    const config = defineConfig({
      globalCss: {
        html: {
          colorPalette: colorPalette, // Dynamically set the color palette
        },
      },
    });
    return createSystem(defaultConfig, config);
  }, [colorPalette]);

  return <ChakraProvider value={theme}>{children}</ChakraProvider>;
};

export default CustomChakraProvider;
