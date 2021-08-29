import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete}) {
  const currentUser = React.useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = (card.owner === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = (
  `${isOwn ? 'card__delete-btn' : 'card__delete-btn_hidden'}`); 

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = (card.likes).some(i => i === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = (`card__like-btn ${isLiked ? 'card__like-btn_active' : ''}`); 

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card)
  }

  function handleDeleteClick() {
    onCardDelete(card)
  }
  console.log(`в кард ${card}`);

  return (
    <li className="card">
      <img
        className="card__image"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      <div className="card__description">
        <button className={cardDeleteButtonClassName} type="button" onClick={handleDeleteClick}></button>
        <h2 className="card__title">{card.name}</h2>
        <div className="card__like-container">
          <button className={cardLikeButtonClassName} type="button" onClick={handleLikeClick}></button>
          <p className="card__like-quantity">{[card.likes].length}</p>
        </div>
      </div>
    </li>
  );
}

export default Card;
