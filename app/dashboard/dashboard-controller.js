'use strict';

angular.module('myApp').controller('DashboardCtrl',
  function($scope, repoService, configService){

    var repoIndex = 0;

    //Initialize scope variables

    $scope.repos = {};

    $scope.viewPort = configService.viewPort || {};

    $scope.cfgSort = configService.sort || {};


    $scope.clickTest = function(a, b, c){
      console.log('clickTest', b.target.className, a, b );
    };

    function reposInView(fullSetRepos){

      console.log('fullsetRepos - should be array', fullSetRepos);
      if(!fullSetRepos || fullSetRepos.status === 403 ){
        return [];
      }

      var len = fullSetRepos.length;

      if(repoIndex>=len){ repoIndex = len-1 }
      if(repoIndex<0){ repoIndex = 0 }

      var limit = $scope.viewPort.limit || len;

      return fullSetRepos.slice(repoIndex, repoIndex+limit);
    }

    function updateView(){
      var finalRepos = repoService.getFinal();
      $scope.repos.render = reposInView(finalRepos);
    }

    function reRender(next){
      var limit = $scope.viewPort.limit;
      var increment = next ? limit : -limit;
      repoIndex += increment;
      updateView()
    }

    $scope.renderNext = function(){
      var next = true;
      reRender(next);
    };

    $scope.renderPrev = function(){
      var prev = false;
      reRender(prev);
    };


    //fetches initial repo data
    $scope.repos.selected = repoService.getSelected();

    console.log('repos.selected', $scope.repos.selected);

    $scope.repos.render = reposInView($scope.reposSelected);

    $scope.progressClass = configService.progressClass;

    $scope.panelDescriptionLength = configService.panelDescriptionLength;

    $scope.do = configService.do;

    //one way binding?
    $scope.select = configService.select;

    //test
    $scope.do.somethingElse = true;




    //Update on changes
//  $scope.$on('REPOS_UPDATE_SELECTED', function(val){
//    $scope.repos.selected = repoService.getSelected();
//  });

    var doAction = $scope.doAction = function(repos){
      //refactor to use qchain
      console.log('meta checked?', $scope, $scope.do.fetchMeta);
      if($scope.do.fetchMeta){
        repoService.addRepoMeta(repos);
      }
    };

    $scope.actionizeRepo = function(repo){
      repoService.actionReady.push(repo);
      doAction([repo]);
    };

    $scope.$on('REPOS_UPDATE_DONE', function(val){
      //check to see if we should pull repo-meta data

      // should we reset index on update or no?
      repoIndex = 0;
      updateView();

      //update repo data after subsequent lookups have finished
      //$scope.repos.render = reposInView(finalRepos);
    });

  }
);
