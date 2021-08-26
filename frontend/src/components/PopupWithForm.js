import React from "react";

function PopupWithForm({
  name,
  title,
  isOpen,
  onClose,
  children,
  handleSubmit,
  buttonText
}) {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""} }`}>
      <div className="popup__container">
        <button
          className="popup__close-btn"
          type="button"
          onClick={onClose}
        ></button>
        <h2 className="popup__title">{title}</h2>
        <form
          className="popup__form"
          name={`form-${name}`}
          //noValidate
          onSubmit={handleSubmit}
        >
          {children}
          <input
            type="submit"
            className="popup__button"
            value={buttonText}
          />
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
