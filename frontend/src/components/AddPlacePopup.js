import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlace({
      name,
      link
    });

    setName('');
    setLink('');
  }

  function handleChangeCardName(e) {
    setName(e.target.value)
  }

  function handleChangeLink(e) {
    setLink(e.target.value)
  }


  return (
    <PopupWithForm
      name="add-card"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      buttonText={'Создать'}
    >
      <input
        id="title-input"
        className="popup__input popup__input-text popup__input-text_type_title"
        type="text"
        placeholder="Название"
        name="name"
        required
        minLength="2"
        maxLength="30"
        value={name || ''} 
        onChange={handleChangeCardName}
      />
      <span className="popup__input-error title-input-error"></span>
      <input
        id="url-input"
        className="popup__input popup__input-text popup__input-text_type_link"
        type="url"
        placeholder="Ссылка на картинку"
        name="link"
        required
        value={link || ''} 
        onChange={handleChangeLink}
      />
      <span className="popup__input-error url-input-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
