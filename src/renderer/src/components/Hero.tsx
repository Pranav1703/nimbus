import { Button, Center, Container, Icon, Image, Text, VStack } from '@chakra-ui/react'
import Logo from '../assets/logo1.2.png'
import { FaArrowRight } from 'react-icons/fa'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Hero(): JSX.Element {
  const [boxShadow, setBoxShadow] = useState('')

  const navigate = useNavigate()
  const handleClick = (): void => {
    navigate('/login')
  }

  // Calculate the side of the button closest to the cursor
  const handleMouseMove = (e): void => {
    const { offsetX, offsetY, target } = e.nativeEvent
    const { offsetWidth, offsetHeight } = target

    // Find the distances from the cursor to each side
    const distances = {
      top: offsetY,
      bottom: offsetHeight - offsetY,
      left: offsetX,
      right: offsetWidth - offsetX
    }

    // Determine the side closest to the cursor
    const closestSide = Object.keys(distances).reduce((a, b) =>
      distances[a] < distances[b] ? a : b
    )

    // Define box-shadow for each side
    const glowStyles = {
      top: '0 -4px 14px teal',
      bottom: '0 8px 14px teal',
      left: '-10px 0 14px teal',
      right: '10px 0 14px teal'
    }

    // Set the glow effect based on the closest side
    setBoxShadow(glowStyles[closestSide])
  }

  // Clear the glow when the cursor leaves
  const handleMouseLeave = (): void => {
    setBoxShadow('') // Remove box-shadow
  }
  return (
    <>
      <Container
        bgColor="teal.900"
        bgBlendMode="multiply"
        w="100vw"
        h="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <VStack gap={3}>
          <Center>
            <Image src={Logo} h="200px" w="200px" />
          </Center>
          <Text textStyle="6xl" color="gray.200">
            Welcome to Nimbus
          </Text>
          <Text textStyle="lg" color="gray.200">
            Your secure cloud backup solution with seamless Google integration
          </Text>
          <Button
            mt={8}
            size="lg"
            rounded="sm"
            bg="orange.500"
            color="black"
            _hover={{ bg: 'orange.600', color: 'teal.100', textStyle: 'lg' }} // Slightly darker orange on hover
            boxShadow={boxShadow}
            transition="box-shadow 0.4s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out" // Smooth transition
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            <Text mb={1} textStyle="lg">
              Continue
            </Text>
            <Icon>
              <FaArrowRight />
            </Icon>
          </Button>
        </VStack>
      </Container>
    </>
  )
}

export default Hero
