import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'



const config = defineConfig({
  globalCss: {
    html: {
      colorPalette: 'orange' // Change this to any color palette you prefer
    }
  },
  theme: {
    keyframes: {
      rotate: {
        '0%': { transform: 'rotate(0deg)' },
        '25%': { transform: 'rotate(25deg)' },
        '50%': { transform: 'rotate(-25deg)' },
        '100%': { transform: 'rotate(0deg)' },
      },
    },
    tokens: {
      animations: {
        rotate: { value: "rotate 0.5s ease-in-out infinite" },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)