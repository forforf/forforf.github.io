var myApp = angular.module('myApp',[ 'RepoFetcherRatings']);

//myApp.directive('myDirective', function() {});
//myApp.factory('myService', function() {});

function RepoCtrl($scope, Repo) {

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
    {sort: 'updated', per_page: 100}
  ];
  //var initFilters = [];

  var baseFilters = [
    slicerFn(0,100)
  ];

  var allFilters = initFilters.concat(baseFilters);

  initFromRepo = Repo.getBaseModel('forforf', allFilters, {init: true});

  function setSelectedRepos(repos){
    $scope.selectedRepos = repos;
    console.log(repos);
    return repos;
  }

  initFromRepo
    .then(setSelectedRepos);
}
