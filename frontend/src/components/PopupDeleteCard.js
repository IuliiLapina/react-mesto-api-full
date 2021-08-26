import React from "react";
import PopupWithForm from "./PopupWithForm";

function PopupDeleteCard({ onClose }) {
  return (
    <PopupWithForm
      name="delete-card"
      title="Вы уверены?"
      onClose={onClose}
      buttonText={Да}
    ></PopupWithForm>
  );
}

export default PopupDeleteCard;
