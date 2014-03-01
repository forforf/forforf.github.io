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


function RepoCtrl($scope, $timeout, RepoService, ConfigService) {

  $scope.cfg = ConfigService;

  $scope.mainView = {};
  $scope.mainView.url = 'app/dashboard/dashboard.html';

  $scope.apiRateLimit = {};
  $scope.apiRateLimit.url = 'app/api-rate-limit/api-rate-limit.html';

//  function setRateLimits(returnedRateLimit){
//    $timeout(function(){
//      console.log('Set RateLimit', returnedRateLimit);
//      //$scope.rateLimit = returnedRateLimit;
//      console.log('scope', $scope);
//    })
//
//  }

//  function setDownlaodedRepos(repos){
//    repoData.downloadedRepos = repos;
//    console.log(repos);
//    return repos;
//  }

  function setSelectedRepos(repos){
    $scope.selectedRepos = repos;
    //ToDo: this will move to a download specific function
    RepoService.setSelected(repos);
    console.log('setSelectedRepos wrapping up', repos);
    return repos;
  }

  function addRepoMeta(repos){
    return RepoService.addRepoMeta(repos);
    //RepoMeta.insertRepoMeta(repos).then(function(repos){
    //  $scope.selectedRepos = repos;
    //  return repos;
    //});
  }

  $scope.graphConfig = {
  };

  function slicerFn(start, stop){
    return function(repos){
      return(repos.slice(start, stop+1));
    };
  }

  $scope.name = 'forforf';



  $scope.fetch = function(apiFetchLimit){
    apiFetchLimit = apiFetchLimit || 100;

    var initFilters = [
      {sort: 'updated', per_page: apiFetchLimit}
    ];
    //var initFilters = [];

    var baseFilters = [
      slicerFn(0,8)
    ];

    var allFilters = initFilters.concat(baseFilters);

    //debug
    //var allFilters = initFilters;
    // -- debug
    var creds = {username: $scope.name, password: $scope.pw};
    //var initFromRepo = GithubRepo.fetcher(creds, allFilters);

    var initFromRepo = RepoService.downloadRepo(creds, allFilters)

    initFromRepo
      //.then(getRateLimits)
      //.then(setDownloadedRepos)
      .then(setSelectedRepos)
      .then(addRepoMeta)
    ;
  }
}