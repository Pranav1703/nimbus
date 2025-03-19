import { Box, Heading, Text, Button, Flex, Link, Container } from '@chakra-ui/react'
import { FcGoogle } from 'react-icons/fc'
import { AiOutlineThunderbolt } from 'react-icons/ai'
import { IoShieldCheckmarkOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../App'
function Login(): JSX.Element {
  const navigate = useNavigate()

  const {setUser} = useContext(UserContext)

  const googleAuthorise = async () => {
    try {
      const resp = await window.api.authorizeUser()
      if (resp) {
        setUser(true)
        navigate('/')
      }
      
      await window.api.saveUser()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container
      bgColor="teal.900"
      bgBlendMode="multiply"
      w="100vw"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        bg="gray.800" // Dark background
        color="white"
        borderRadius="lg"
        p={6}
        maxWidth="400px"
        mx="auto"
        textAlign="center"
        borderWidth="0.5px"
        borderColor="gray.500"
        boxShadow="lg"
      >
        <Heading as="h2" size="2xl" mb={2} fontWeight="bold">
          Sign in to Nimbus
        </Heading>
        <Text color="gray.400" mb={4}>
          Connect your Google account to get started
        </Text>
        <Button
          w="full"
          mb={4}
          variant="outline"
          borderWidth="1px"
          borderColor="gray.500"
          mt={3}
          onClick={googleAuthorise}
          colorPalette="gray"
        >
          <FcGoogle />
          Continue with Google
        </Button>

        <Text fontSize="sm" color="gray.500">
          By continuing, you agree to Nimbus
          <Link href="#" color="blue.400" pl={1} pr={1}>
            {' '}
            Terms of Service
          </Link>
          and
          <Link href="#" color="blue.400" pl={1} pr={1}>
            Privacy Policy
          </Link>
        </Text>

        <Flex direction="column" mt={4} gap={2} textAlign="left">
          <Flex alignItems="center" gap={2}>
            <IoShieldCheckmarkOutline size="20" />
            <Text fontSize="sm" color="gray.300">
              Your data is securely encrypted and stored in the cloud
            </Text>
          </Flex>
          <Flex alignItems="center" gap={2}>
            <AiOutlineThunderbolt size="20" />
            <Text fontSize="sm" color="gray.300">
              Fast and reliable automated backup system
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Container>
  )
}

export default Login
