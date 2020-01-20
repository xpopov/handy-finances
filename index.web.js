/**
 * @format
 */

// import {AppRegistry} from 'react-native';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/app';
import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
// AppRegistry.runApplication(appName, { rootTag: document.getElementById('react-root') });

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <App/>,
    document.querySelector('#react-root')
  )
});
