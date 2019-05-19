import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Calendar from './Calendar'
  
  let now = new Date();
  ReactDOM.render(
    <Calendar year={now.getFullYear()} month={now.getMonth()+1} day={now.getDate()} />, 
    document.getElementById('root')
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
