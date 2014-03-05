'use strict';

angular.module('myApp').controller('DashboardCtrl',
  function($scope, repoService, configService){
    $scope.repos = {};

    //Initialize
    $scope.repos.selected = repoService.getSelected();

    $scope.progressClass = configService.progressClass;

    $scope.panelDescriptionLength = configService.panelDescriptionLength;

    $scope.do = configService.do;

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
      console.log('db final', repoService.getFinal() );
      $scope.repos.selected = repoService.getFinal();
    });

  }
);
