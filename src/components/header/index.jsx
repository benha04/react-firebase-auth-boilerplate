import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import axios from 'axios';
import { Box, Flex, Text, Button, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';
import { ChevronDownIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import Sidebar from './Sidebar.jsx';

const celsiusToFahrenheit = (celsius) => (celsius * 9 / 5) + 32;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userLoggedIn, currentUser } = useAuth();
  const [weather, setWeather] = useState({});
  const [dateTime, setDateTime] = useState(dayjs().format('dddd, MMMM D YYYY, h:mm:ss A'));

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(dayjs().format('dddd, MMMM D YYYY, h:mm:ss A'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            lat: lat,
            lon: lon,
            appid: '6c902f24963ae65021f0434175aa952a',
            units: 'metric'
          }
        });

        setWeather({
          temp: celsiusToFahrenheit(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].main
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getLocation();
  }, []);

  const handleLogout = async () => {
    try {
      await doSignOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getGreeting = () => {
    const hour = dayjs().hour();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getWeatherIcon = (icon) => {
    switch (icon) {
      case 'Clear':
        return <WiDaySunny size={24} />;
      case 'Clouds':
        return <WiCloudy size={24} />;
      case 'Rain':
        return <WiRain size={24} />;
      case 'Snow':
        return <WiSnow size={24} />;
      default:
        return <WiDaySunny size={24} />;
    }
  };

  const isHomePage = location.pathname === '/home';

  return (
    <Flex as="nav" p={4} bg="gray.900" color="white" justify="space-between" align="center" className="fixed top-0 w-full z-20">
      <Box display="flex" alignItems="center">
        {userLoggedIn && <Sidebar />}
        {userLoggedIn && isHomePage && (
          <Text fontSize="2xl" fontWeight="bold" ml={4}>
            {getGreeting()}
          </Text>
        )}
      </Box>
      {isHomePage && userLoggedIn && (
        <Flex align="center" gap={4}>
          <Text>{dateTime}</Text>
          <Flex align="center">
            {weather.temp !== undefined && (
              <>
                <Text>{weather.temp.toFixed(1)}°F</Text>
                {getWeatherIcon(weather.icon)}
                <Text ml={2}>{weather.description}</Text>
              </>
            )}
          </Flex>
        </Flex>
      )}
      {userLoggedIn ? (
        <Menu>
          <MenuButton as={Button} bg="gray.900" color="white">
            <Flex align="center">
              <Text mr={2}>{currentUser?.email}</Text>
              <ChevronDownIcon />
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Flex>
          <Link className="text-sm text-blue-600 underline mr-4" to={'/login'}>
            Login
          </Link>
          <Link className="text-sm text-blue-600 underline" to={'/register'}>
            Register New Account
          </Link>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
