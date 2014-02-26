var myApp = angular.module('myApp',[ 'GithubRepoFetcher', 'RepoFetcherMeta', 'RepoFetcherRatings']);

//myApp.directive('myDirective', function() {});
//myApp.factory('myService', function() {});

function RepoCtrl($scope, GithubRepo, qChain, RepoMeta, $q) {
  var cfg = $scope.cfg = {};
  cfg.panelDescriptionLength = 40;

  cfg.progressClass = function(repo){
    console.log('progress class', repo._ff_meta_ && repo._ff_meta_.progress);
    var name = repo._ff_meta_ && repo._ff_meta_.progress;
    if (name) {
      return getChildNames(name)[0].replace(/\s/g, "-");
    }
    return name || "";
  };


  var rateLimit = $scope.rateLimit = {};

  function getChildNames(obj){
    console.log(obj);
    if (!obj) {
      return [];
    }

    if (!Object.keys(obj).length ) {
      return [];
    }
    var name = Object.keys(obj).map(function(k){ return k.toString(); })
    console.log('child name', name);
    return name;
  }

  //side affect function
  function getRateLimits(repos){
    // Stinky - see parent module for details
    var headers = GithubRepo.headers();
    rateLimit.fromCache = headers['X-Local-Cache'];

    var remaining = headers['x-ratelimit-remaining'];
    var reset = headers['x-ratelimit-reset'];
    rateLimit.remaining = remaining && parseInt(remaining);
    rateLimit.resetTime = reset && moment.unix( parseInt(reset)).fromNow();

    return repos;

  }

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
    initFromRepo = GithubRepo.fetcher(creds, allFilters, {init: true});






    initFromRepo
      .then(getRateLimits)
      .then(setSelectedRepos)
      .then(addRepoMeta)
    ;
  }
}
