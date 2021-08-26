import React from 'react';
import { Link } from 'react-router-dom';

function Register({title, buttonText, authRegister}) {
  const [emailInputValue, setEmailInputValue] = React.useState('');
  const [passwordInputValue, setPasswordInputValue] = React.useState('');
 
  function handleChangeEmail(e) {
    setEmailInputValue(e.target.value)
  }

  function handleChangePassword(e) {
    setPasswordInputValue(e.target.value)
  }

  function handleSubmit(e) { //обработка формы регистрации
    e.preventDefault();

    const email = emailInputValue;
    const password = passwordInputValue;
    
    authRegister(email, password);
    setPasswordInputValue('');
  }

  return (
    <div className="form-auth">
      <div className="popup__container popup__container_black">
        <h2 className="popup__title popup__title_white">{title}</h2>
        <form
          className="popup__form popup__form_auth"
          name='form-register'
          //noValidate
          onSubmit={handleSubmit}
          >
          <input
            value={emailInputValue}
            onChange={handleChangeEmail}
            id="email-input"
            className="popup__input popup__input-text popup__input-text_black popup__input-text_type_link-email"
            type="email"
            placeholder="Email"
            name="email"
            required
          />
          <span className="popup__input-error email-input-error"></span>
        
          <input
            value={passwordInputValue}
            onChange={handleChangePassword}
            id="password-input"
            className="popup__input popup__input-text popup__input-text_black popup__input-text_type_link-password"
            type="password"
            placeholder="Пароль"
            name="avatar"
            required
          />
          <span className="popup__input-error password-input-error"></span>
        
          <input
            type="submit"
            className="popup__button popup__button_white"
            value={buttonText}
          />
        </form>
        <Link className="form-auth__link" to="/sign-in">Уже зарегистрированы? Войти</Link>
      </div>
    </div>
  );
}

export default Register;