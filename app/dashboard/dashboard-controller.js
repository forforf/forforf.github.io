'use strict';

angular.module('myApp').controller('DashboardCtrl', function($scope, RepoService){

  $scope.repos = {};

  //Initialize
  $scope.repos.selected = RepoService.getSelected();

  //Update on changes
  $scope.$on('REPOS_UPDATE_SELECTED', function(val){
    $scope.repos.selected = RepoService.getSelected();
  });

});