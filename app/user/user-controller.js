'use strict';

angular.module('myApp').controller('UserCtrl', function($scope, credsService){

  //Initialize
  $scope.creds = credsService;

});