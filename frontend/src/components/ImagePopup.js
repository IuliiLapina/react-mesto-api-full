import React from "react";

function ImagePopup({card, onClose}) {
  return (
    <div className={`popup popup-zoom-img ${card.name ? 'popup_opened' : ''}`}>
      <div className="popup__zoom-content">
        <img
          className="popup__zoom-img"
          src={card.link}
          alt={card.name}
        />
        <p className="popup__zoom-caption">{card.name}</p>
        <button
          className="popup__close-btn popup__close-btn-zoom-img"
          type="button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default ImagePopup;
