import React from 'react';
import './Header.css';
import logo from '../assets/profile.jpg';
import profileIcon from '../assets/PROFILEICON.png';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = ({
  onMenuClick,
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  username,
  pokedexCount
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTitleClick = () => {
    const path = location.pathname;
    if (path.startsWith('/general')) {
      navigate('/general');
    } else if (path.startsWith('/clasica')) {
      navigate('/clasica');
    }
  };

  return (
    <div className="header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="header-center">
        <span className="title" onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
          Pokédex 2.0
        </span>
      </div>
      <div className="header-right">
        {isLoggedIn ? (
          <>
            <img src={profileIcon} alt="Perfil" className="avatar" />
            <div className="user-info">
              <span className="user-name">{username}</span>
              <span className="pokedex-info">
                Pokédex: <span className="pokemon-count">{pokedexCount}</span>
              </span>
            </div>
            <button className="icon-button logout" title="Cerrar sesión" onClick={onLogoutClick}>
              <LogoutIcon style={{ color: 'white', fontSize: 24 }} />
            </button>
          </>
        ) : (
          <span
            className="login-link"
            onClick={onLoginClick}
            style={{
              color: 'white',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            Iniciar sesión
          </span>
        )}
      </div>
      <div className="header-menu" onClick={onMenuClick}>
        <MenuIcon className="menu-icon" />
      </div>
    </div>
  );
};

export default Header;