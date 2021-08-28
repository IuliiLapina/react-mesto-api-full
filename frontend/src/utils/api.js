class Api {
  constructor({ address, token }) {
    this._address = address;
    this._token = token;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
  }

  //получить инфо пользователя с сервера
  getUserData() {
    return fetch(`${this._address}/v1/cohort-22/users/me`, {
      headers: {
        authorization: this._token,
      },
    }).then(this._checkResponse);
  }

  //получить карточки с сервера
  getInitialCards() {
    return fetch(`${this._address}/v1/cohort-22/cards`, {
      headers: {
        authorization: this._token,
      },
    }).then(this._checkResponse);
  }

  setUserData(data) {
    return fetch(`${this._address}/v1/cohort-22/users/me`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(this._checkResponse);
  }

  setUserAvatar(link) {
    return fetch(`${this._address}/v1/cohort-22/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        avatar: link,
      }),
    }).then(this._checkResponse);
  }

  addNewCard(data) {
    return fetch(`${this._address}/v1/cohort-22/cards`, {
      method: "POST",
      headers: {
        authorization: this._token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then(this._checkResponse);
  }

  addCardLike(cardId) {
    return fetch(`${this._address}/v1/cohort-22/cards/likes/${cardId}`, {
      method: "PUT",
      headers: {
        authorization: this._token,
      },
    }).then(this._checkResponse);
  }

  deleteCardLike(id) {
    return fetch(`${this._address}/v1/cohort-22/cards/likes/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
      },
    }).then(this._checkResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._address}/v1/cohort-22/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
      },
    }).then(this._checkResponse);
  }
}

const api = new Api({
  address: "backend.mesto.iapina.nomoredomains.club",
//  token: "7a45c432-7073-4f3b-9cf1-c12940fb64b9",
});

export default api;
