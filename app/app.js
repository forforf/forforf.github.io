'use strict';

var myApp = angular.module('myApp',[
  'ngRoute',
  'GithubRepoFetcher',
  'RepoFetcherMeta',
  'RepoFetcherRatings'
]);


//angular.module('app.controllers');

//myApp.config(function($routeProvider, $locationProvider) {
//  $routeProvider.when('/dashboard', {
//    templateUrl: 'app/dashboard/dashboard.html',
//    controller: 'DashboardCtrl'
//    //resolve: {/* dependencies go here */ }
//  });
//  // configure html5 to get links working on jsfiddle
//  $locationProvider.html5Mode(true);
//});

//myApp.directive('myDirective', function() {});
//myApp.factory('myService', function() {});


function RepoCtrl($scope, repoService, configService, credsService) {

  $scope.mainView = {};
  $scope.mainView.url = 'app/dashboard/dashboard.html';
  $scope.mainView.name = 'Dashboard';
  $scope.mainView.controls = {};
  $scope.mainView.controls.url = 'app/dashboard/dashboard-controls.html'

  $scope.apiRateLimit = {};
  $scope.apiRateLimit.url = 'app/repo-stats/api-rate-limit.html';

  $scope.totalDownload = {};
  $scope.totalDownload.url = 'app/repo-stats/total-repos.html';

  $scope.user = {};
  $scope.user.name = credsService.username;
  $scope.user.url = 'app/user/user.html';



  function addRepoMeta(repos){
    return repoService.addRepoMeta(repos)
      .then(function(repos){
        console.log('addREpoMeta', repos);
        return repos;
      });
  }

  $scope.graphConfig = {
  };

  $scope.fetch = repoService.fetch;
}