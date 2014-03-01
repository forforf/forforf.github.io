'use strict';

angular.module('myApp').controller('DashboardCtrl', function($scope, repoService, configService){

  $scope.repos = {};

  //Initialize
  $scope.repos.selected = repoService.getSelected();

  $scope.progressClass = configService.progressClass;

  $scope.panelDescriptionLength = configService.panelDescriptionLength;

  //Update on changes
//  $scope.$on('REPOS_UPDATE_SELECTED', function(val){
//    $scope.repos.selected = repoService.getSelected();
//  });

  $scope.$on('REPOS_UPDATE_DONE', function(val){
    console.log('db final', repoService.getFinal() );
    $scope.repos.selected = repoService.getFinal();
  });

});