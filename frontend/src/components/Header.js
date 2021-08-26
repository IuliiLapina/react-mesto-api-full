import React from "react";
import { Link, useLocation } from 'react-router-dom'; //для управления параметрами поиска или текущим путем
import logo from '../images/logo/logo.svg';

function Header({loggedIn, email, handleExit}) {
  const location = useLocation();
  const linkTo = `${location.pathname === `/sign-in` ? `/sign-up` : `/sign-in`}`;
  const linkText = `${location.pathname === `/sign-in` ? `Регистрация` : `Войти`}`;

  return (
    <header className="header">
        <img className="header__logo" src={logo} alt="Логотип 'Mesto'" />
        <div className="header__menu">
          {loggedIn ? (
              <>
                <p className="header__menu-email">{email}</p>
                <Link to="/sign-in" className="header__menu-exit-link" onClick={handleExit}>Выйти</Link>
              </>
            ) : (<Link to={linkTo} className="header__menu-exit-link">{linkText}</Link>)}
        </div>
    </header>
  );
}

export default Header;
