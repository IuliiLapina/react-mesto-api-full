import React from "react";
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import ImagePopup from "./ImagePopup";

import InfoTooltip from './InfoTooltip';
import okImg from '../images/infoTooltip/infoTooltipOk.svg'
import errorImg from '../images/infoTooltip/infoTooltipError.svg'

import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

import api from "../utils/api.js";
import * as auth from '../utils/auth.js'
import CurrentUserContext from "../contexts/CurrentUserContext.js";

function App() {
  const history = useHistory(); 

  const [loggedIn, setLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({}); //стейт контекста пользователя
  const [email, setEmail] = React.useState('');

  //стейт для попапов
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = React.useState(false);
  const [titleInfoTooltipPopup, setTitleInfoTooltipPopup] = React.useState('');
  const [imageInfoTooltipPopup, setImageInfoTooltipPopup] = React.useState('');
  const [cards, setCards] = React.useState([]);

  const [selectedCard, setSelectedCard] = React.useState({});
  
  React.useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    // если у пользователя есть токен в localStorage, 
    // эта функция проверит, действующий он или нет
    if (jwt){
      auth.getContent(jwt)
        .then((res) => {
          setLoggedIn(true);
          setEmail(res.data.email);
          history.push('/');
        })
      .catch((err) => console.log(err));
    }
  }, [history]);
  
  React.useEffect(() => {
    if (loggedIn) {
      history.push('/');
      api
      .getUserData()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => console.log(err));
    }    
  }, [loggedIn]);

  //Обработчики открытия попапов
  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleInfoTooltipPopupOpen() {
    setInfoTooltipPopupOpen(true)
  }

  //Обработчик закрытия попапов
  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);

    setInfoTooltipPopupOpen(false);

    setSelectedCard({}); //пустой объект для очистки данных карточки
  }

  function handleInfoTooltipContent(title, img) {
    setTitleInfoTooltipPopup(title);
    setImageInfoTooltipPopup(img);
  }

  //обновить данные пользователя
  function handleUpdateUser(data) {
    api
      .setUserData(data)
      .then((userData) => {
        setCurrentUser(userData);

        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  //обновить аватар
  function handleUpdateAvatar(avatar) {
    api
      .setUserAvatar(avatar)
      .then((currentUser) => {
        setCurrentUser(currentUser);

        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  //стейт карточек
  React.useEffect(() => {
    api
      .getInitialCards()
      .then((cardData) => {
        setCards(cardData);
      })
      .catch((err) => console.log(err));
  }, []);


 //добавление карточки
 function handleAddPlaceSubmit({name, link}) {
  api
  .addNewCard({name, link})
  .then((newCard) => {
    setCards([newCard, ...cards]);

    closeAllPopups();
  })
  .catch((err) => console.log(err));
}
  
  //добавление / удаление лайков на карточках
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(like => like === (currentUser.data && currentUser.data._id));
    // Отправляем запрос в API и получаем обновлённые данные карточки
    const likeToChange = isLiked
      ? api.deleteCardLike(card._id)
      : api.addCardLike(card._id);
    likeToChange
      .then((newCard) => {
        //state- текущее значение cards до изменения, с - элемент в массиве cards на каждой итерации
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  //удаление карточки
  function handleCardDelete(card) {
    api
    .deleteCard(card._id)
    .then(() => {
      const newCardList = cards.filter((c) => (c._id !== card._id));
      setCards(newCardList);
    })
    .catch((err) => console.log(err));
  }
  
  //регистрация пользователя
  function authRegister(email, password) {
    auth
    .register(email, password)
      .then(() => {
        handleInfoTooltipContent('Вы успешно зарегистрировались!', okImg);
        handleInfoTooltipPopupOpen();
        history.push('/sign-in');
      })
      .catch((err) => {
        handleInfoTooltipContent('Что-то пошло не так! Попробуйте ещё раз.', errorImg);
        handleInfoTooltipPopupOpen();
        console.log(err);
      })
  }
/*
    //авторизация пользователя
    function authAuthorize(password, email) {
      auth.authorize(password, email)
        .then((res) => {
          auth.getContent(data)
            .then((data) => {
              if (res) {
                localStorage.setItem('token', res.token)
                setEmail(res.email);
                setCurrentUser(res.data);
                console.log(res.data)           
                setLoggedIn(true);
                history.push('/');
                handleInfoTooltipContent('Вы успешно авторизовались!', okImg);
                handleInfoTooltipPopupOpen();
              }
            })
        })
      .catch((err) => {
        handleInfoTooltipContent('Что-то пошло не так! Попробуйте ещё раз.', errorImg);
        handleInfoTooltipPopupOpen();
        console.log(err);
      })
    }
*/
  
  //авторизация пользователя
  function authAuthorize(password, email) {
    auth.authorize(password, email)
      .then((res) => {
        auth.getContent(res)
            .then((res) => {
              setCurrentUser(res.data); 
            })
        if (res) {
          localStorage.setItem('token', res.token)
          setEmail(res.email);
          setLoggedIn(true);
          history.push('/');
          handleInfoTooltipContent('Вы успешно авторизовались!', okImg);
          handleInfoTooltipPopupOpen();
        }      
      })  
    .catch((err) => {
      handleInfoTooltipContent('Что-то пошло не так! Попробуйте ещё раз.', errorImg);
      handleInfoTooltipPopupOpen();
      console.log(err);
    })
  }

  function checkToken() {
    const token = localStorage.getItem('token')

    if (token) {
      auth.getContent(token)
        .then(res => {
          setEmail(res.data.email);
          setLoggedIn(true)
        })
        .catch(e => { console.log(e) }) 
    }
  }

//выход из профиля
  function handleExit () {
    setLoggedIn(false);
    setEmail('');
    localStorage.removeItem('token');
    history.push('/signin');
  }

  React.useEffect(() => { 
    checkToken();  
  }) 

return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header 
          loggedIn={loggedIn}
          email={email}
          handleExit={handleExit}
        />
            
          <Switch>
            <ProtectedRoute
              exact path="/"
              loggedIn={loggedIn}
              component={Main}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />

            <Route path="/sign-up">
              <Register 
                title={"Регистрация"}
                buttonText={"Зарегистрироваться"}
                authRegister={authRegister}
              />
            </Route> 

            <Route path="/sign-in">
              <Login 
                title={"Вход"}
                buttonText={"Войти"}
                authAuthorize={authAuthorize}
              />
            </Route>

            <Route path='*'>
              {loggedIn ? <Redirect to='/' /> : <Redirect to='/sign-in' />}
            </Route>
          </Switch>
        
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <AddPlacePopup 
            isOpen={isAddPlacePopupOpen} 
            onClose={closeAllPopups} 
            onAddPlace={handleAddPlaceSubmit}
          />

          <ImagePopup 
            card={selectedCard} 
            onClose={closeAllPopups} 
          />

          <InfoTooltip
            title={titleInfoTooltipPopup}
            img={imageInfoTooltipPopup}
            isOpen={isInfoTooltipPopupOpen}
            onClose={closeAllPopups}
          />
          
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
