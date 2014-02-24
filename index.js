var myApp = angular.module('myApp',[ 'GithubRepoFetcher', 'RepoFetcherMeta', 'RepoFetcherRatings']);

//myApp.directive('myDirective', function() {});
//myApp.factory('myService', function() {});

function RepoCtrl($scope, GithubRepo, qChain, RepoMeta, $q) {

  function setSelectedRepos(repos){
    $scope.selectedRepos = repos;
    console.log(repos);
    return repos;
  }

  function addRepoMeta(repos){
    RepoMeta.insertRepoMeta(repos).then(function(repos){
      $scope.selectedRepos = repos;
      return repos;
    });
  }

  $scope.graphConfig = {
  };

  function slicerFn(start, stop){
    return function(repos){
      console.log('slicey dicey');
      return(repos.slice(start, stop+1));
    };
  }

  $scope.name = 'forforf';

  var initFilters = [
    {sort: 'updated', per_page: 5}
  ];
  //var initFilters = [];

  var baseFilters = [
    slicerFn(0,100)
  ];


  $scope.fetch = function(){
    //var allFilters = initFilters.concat(baseFilters);

    //debug
    var allFilters = initFilters;
    // -- debug
    var creds = {username: $scope.name, password: $scope.pw};
    initFromRepo = GithubRepo.fetcher(creds, allFilters, {init: true});





    initFromRepo
      .then(setSelectedRepos)
      .then(addRepoMeta)
    ;
  }
}
