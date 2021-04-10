import 'core-js/stable';
import "regenerator-runtime/runtime";
import 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import App from './containers/App';

// Polyfills
import '@src/utils/polyfill.js';
import 'url-search-params-polyfill';

// Initialize logger outside of app
import { initializeConsoleLogger } from '@src/utils/logger';
initializeConsoleLogger();

render(
   <Provider store={store}>
        <App />
    </Provider>,
  document.getElementById('app')
);
