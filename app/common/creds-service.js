'use strict';

angular.module('myApp').factory('credsService',
  function(){

    var creds = {username: 'forforf', password: null};

    return creds;
  }
);