import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from "react-redux"
import thunk from "redux-thunk"
import reportWebVitals from './reportWebVitals';
import { compose,applyMiddleware, createStore } from 'redux';
import rootReducer from './Components/Reducers/rootReducer';
import { createMuiTheme,ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { red,grey } from '@material-ui/core/colors';

 const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
 const store = createStore(rootReducer,composeEnhancers(
    applyMiddleware(thunk)
  ));

 
const theme = createMuiTheme({
  palette: {
    primary:red,
    secondary:grey,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
    <App />
    </BrowserRouter>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
