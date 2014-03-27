'use strict';

angular.module('myApp').controller('DashboardControlsCtrl',
  function($scope, repoService, configService, repoStatService){

    $scope.repoStats = repoStatService.stats.repos.total;

    $scope.do = configService.do;

    $scope.select = configService.select;

    $scope.selectAllChecked = false; //default

    //Apply

    //Sort


    //Config
    $scope.viewPort = configService.viewPort;
    $scope.fetchLimit = configService.fetchLimit;



    $scope.doActions = function(action){
      if(repoService.actionReady.length){
        repoService[action](repoService.actionReady);
      }
    };


    $scope.selectAllRepos = function(){
      if($scope.selectAllChecked){
        repoService.actionReady = repoService.repos.downloaded;
      } else {
        repoService.actionReady = [];
      }

    }
  }
);
