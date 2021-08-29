import React from "react";
import Card from "./Card";
import CurrentUserContext from "../contexts/CurrentUserContext.js";

function Main({ onEditAvatar, onEditProfile, onAddPlace, onCardClick, cards, onCardLike, onCardDelete}) {
  //стейт для данных пользователя
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div
          onClick={onEditAvatar}
          className="profile__avatar"
          name="avatar"
          alt="Аватар профиля"
          style={{ backgroundImage: `url(${ currentUser.data.avatar})` }}
        ></div>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser.name}</h1>
          <button
            onClick={onEditProfile}
            className="profile__edit-button"
            type="button"
            aria-label="Зедактировать профиль"
          ></button>
          <p className="profile__subtitle">{currentUser.about}</p>
        </div>
        <button
          onClick={onAddPlace}
          className="profile__add-button"
          type="button"
        ></button>
      </section>

      <section className="content-cards">
        <ul className="cards">
          {cards.map((card) => (
            <Card
              card={card}
              onCardClick={onCardClick}
              key={card._id}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
