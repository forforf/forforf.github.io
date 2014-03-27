'use strict';

angular.module('myApp').controller(
  'UserCtrl',

  function($scope, configService, credsService){

    //Initialize
    $scope.creds = credsService;

//    $scope.$watch('creds.password', function(newVal){
//      console.log('Password changed to', newVal);
//      configService.do.fetchMeta = !!( $scope.creds.password );
//    });

  }
);