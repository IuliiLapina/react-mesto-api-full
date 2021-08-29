export const BASE_URL = 'http://backend.mesto.iapina.nomoredomains.club';

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({email, password})
  })
  .then(checkResponse);
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  })
  .then(checkResponse)
 /* .then((data) => {
    if (data.token){
      localStorage.setItem('jwt', data.token);
      return data.token;
    } 
  })
  .catch(err => console.log(err))
  */
};

  //если токен действителен, вернёт ответ с информацией о пользователе
export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(checkResponse)
  //.then(data => data)
};

const checkResponse = (res) => {
  if (res.ok) {
    return res.json(); 
  }
  return Promise.reject(`Ошибка ${res.status}`);
};
