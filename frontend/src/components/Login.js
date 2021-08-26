import React from 'react';

function Login({title, buttonText, authAuthorize}) {
  const [emailInputValue, setEmailInputValue] = React.useState('');
  const [passwordInputValue, setPasswordInputValue] = React.useState('');
  
  function handleChangeEmail(e) {
    setEmailInputValue(e.target.value)
  }

  function handleChangePassword(e) {
    setPasswordInputValue(e.target.value)
  }

  function handleSubmit(e) { 
    e.preventDefault();

    const email = emailInputValue;
    const password = passwordInputValue;
    
    authAuthorize(email, password);
    setPasswordInputValue('');
    setEmailInputValue('');
  }

  return (
   <div className="form-auth">
    <div className="popup__container popup__container_black">
      <h2 className="popup__title popup__title_white">{title}</h2>
      <form
        className="popup__form"
        name='form-login'
      //  noValidate
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
    </div>
  </div>
  );
}

export default Login;