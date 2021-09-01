class Api {
  constructor({ address, headers }) {
    this._address = address;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
  }

  //получить инфо пользователя с сервера
  getUserData() {
    return fetch(`${this._address}/users/me`, {
      headers: this._headers,
      credentials: 'include',
    })
    .then(this._checkResponse);
  }

  //получить карточки с сервера
  getInitialCards() {
    return fetch(`${this._address}/cards`, {
      headers: this._headers,
      credentials: 'include',
      method:'GET', 
      })
      .then(this._checkResponse);
  }

  setUserData(data) {
    return fetch(`${this._address}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
    .then(this._checkResponse);
  }

  setUserAvatar(link) {
    console.log(link);
    return fetch(`${this._address}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        avatar: link.avatar
      })
    })
    .then(this._checkResponse);
  }

  addNewCard(data) {
    return fetch(`${this._address}/cards`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    })
    .then(this._checkResponse)
  }

  addCardLike(cardId) {
    return fetch(`${this._address}/cards/likes/${cardId}`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include',
      })
      .then(this._checkResponse);
  }

  deleteCardLike(cardId) {
    return fetch(`${this._address}/cards/likes/${cardId}`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include',
      })
      .then(this._checkResponse);
  }

  /*
  deleteCard(cardId) {
    return fetch(`${this._address}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
      },
    }).then(this._checkResponse);
  }
  */

  deleteCard(cardId) {
    return fetch(`${this._address}/cards/${cardId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    .then(this._checkResponse);
  }
}

const api = new Api({
  address: "https://backend.mesto.iapina.nomoredomains.club",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});

export default api;
