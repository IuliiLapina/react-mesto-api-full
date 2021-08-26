import React from "react";

function InfoTooltip({title, img, isOpen, onClose}) {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""} }`}>
      <div className="popup__container">
        <button
          className="popup__close-btn"
          type="button"
          onClick={onClose}
        ></button>
        <img className="popup__info-image" src={img} alt={title} />
        <h2 className="popup__title-info">{title}</h2>
      </div>
    </div>
  );
}

export default InfoTooltip;