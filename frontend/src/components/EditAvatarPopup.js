import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatarRef = React.useRef('');

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
    
    avatarRef.current.value = '';
  }

  return (
    <PopupWithForm
      name="edit-avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      buttonText={'Сохранить'}
    >
      <input
        ref={avatarRef}
        id="avatar-input"
        className="popup__input popup__input-text popup__input-text_type_link-avatar"
        type="url"
        placeholder="Ссылка на аватар"
        name="avatar"
        required
      />
      <span className="popup__input-error avatar-input-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
