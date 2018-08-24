import 'popper.js';
import 'bootstrap';
// local file import
import { eventListener, checkUserLoggedIn } from './eventListener';

const jQuery = require('jquery');

require('../scss/main.scss');

jQuery(document).ready(() => {
  console.log('app initialized');
  eventListener();
  checkUserLoggedIn();
});
