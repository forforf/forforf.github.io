'use strict';

angular.module('myApp').controller('DashboardControlsCtrl',
  function($scope, repoService, configService){

    $scope.do = configService.do;

    $scope.doActions = function(action){
      if(repoService.actionReady.length){
        repoService[action](repoService.actionReady);
      }
    };
  }
);
