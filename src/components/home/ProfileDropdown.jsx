import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import { Menu, MenuButton, MenuList, MenuItem, Button, Avatar } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await doSignOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg="gray.900" color="gray.300">
        <Avatar name={currentUser?.email} size="sm" mr={2} />
        {currentUser?.email}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileDropdown;
