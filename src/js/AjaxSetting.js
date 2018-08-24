const jQuery = require('jquery');

jQuery(document).on('ajaxSend', () => {
  if (!jQuery('#ajaxSpinner').length) {
    jQuery('body').append("<div class='loading' id='ajaxSpinner'></div>");
  }
})
  .on('ajaxStop', () => {
    jQuery('#ajaxSpinner').remove();
  });