import React from 'react';
import { Dropdown, Button, Image, ToastContainer } from 'react-bootstrap';
import { FaUserCircle, FaSignOutAlt, FaEdit, FaKey } from 'react-icons/fa';

const UserMenu = ({ userName, onLogout, onEditProfile, onChangePassword }) => {
  return (
    <Dropdown align="end">
      <ToastContainer/>
      <Dropdown.Toggle
        variant="light"
        id="dropdown-user"
        className="d-flex align-items-center border-0 shadow-sm"
        style={{ backgroundColor: '#fe83n2  ', borderRadius: '2rem' }}
      >
        <FaUserCircle size={24} className="me-2 text-success" />
        <span className="fw-semibold">{userName}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="shadow-sm mt-2">
        <Dropdown.Item onClick={onEditProfile}>
          <FaEdit className="me-2 text-info" />
          Editar Informações
        </Dropdown.Item>
        <Dropdown.Item onClick={onChangePassword}>
          <FaKey className="me-2 text-warning" />
          Redefinir Senha
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={onLogout} className="text-secundary">
          <FaSignOutAlt className="me-2" />
          Sair
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserMenu;
