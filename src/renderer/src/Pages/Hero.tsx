import {
  Button,
  Center,
  Container,
  Icon,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import Logo from '../assets/logo1.2.png';
import { FaArrowRight } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Hero(): JSX.Element {
  const [boxShadow, setBoxShadow] = useState('');
  const [rotateClass, setRotateClass] = useState(false);

  const navigate = useNavigate();
  const handleClick = (): void => {
    navigate('/login');
  };

  // Mouse move handler for button glow
  const handleMouseMove = (e): void => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { offsetWidth, offsetHeight } = target;

    const distances = {
      topLeft: Math.sqrt(offsetX ** 2 + offsetY ** 2),
      topRight: Math.sqrt((offsetWidth - offsetX) ** 2 + offsetY ** 2),
      bottomLeft: Math.sqrt(offsetX ** 2 + (offsetHeight - offsetY) ** 2),
      bottomRight: Math.sqrt(
        (offsetWidth - offsetX) ** 2 + (offsetHeight - offsetY) ** 2
      ),
      left: offsetX,
      right: offsetWidth - offsetX,
    };

    const closestCorner = Object.keys(distances).reduce((a, b) =>
      distances[a] < distances[b] ? a : b
    );

    const glowStyles: { [key: string]: string } = {
      topLeft: '0 -10px 20px teal, -6px -6px 20px teal',
      topRight: '0 -10px 20px teal, 6px -6px 20px teal',
      bottomLeft: '0 10px 20px teal, -6px 6px 20px teal',
      bottomRight: '0 10px 20px teal, 6px 6px 20px teal',
      left: '-10px 0 20px teal, -8px 0 20px teal',
      right: '10px 0 20px teal, 8px 0 20px teal',
    };

    setBoxShadow(glowStyles[closestCorner]);
  };

  const handleMouseLeave = (): void => {
    setBoxShadow(''); // Remove box-shadow
    setRotateClass(false); // Remove rotation
  };

  const handleMouseEnter = (): void => {
    setTimeout(() => {
      setRotateClass(true); // Apply rotation after 0.4s
      setTimeout(() => setRotateClass(false), 500); // Remove rotation after 0.5s
    }, 200); // Delay rotation start by 0.4s
  };

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
          _hover={{ bg: 'orange.600', color: 'teal.100', textStyle: 'lg' }}
          boxShadow={boxShadow}
          transition="box-shadow 0.4s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          onClick={handleClick}
        >
          <Text mb={1} textStyle="lg">
            Continue
          </Text>
          <Icon
            h={5}
            w={5}
            as={FaArrowRight}
            animation={rotateClass ? 'rotate' : undefined}
          />
        </Button>
      </VStack>
    </Container>
  );
}

export default Hero;
