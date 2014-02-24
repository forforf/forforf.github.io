'use strict';

angular.module('RepoFetcherRatings', [])

  .factory('ratingChart', function () {
    function makeRatingChart(ratingData, element, config){
      function transStr(x, y){
        return "translate("+x+"," +y+ ")";
      }



      console.log('ratingData', ratingData);

      if(!ratingData){
        return element.html(config.noDataTemplate);
      } else {
        element.html('');
      }

      // ratingData = {a:1, ab:2, abc:3, abcd:4, abcde:5, abcdef:6, abcdefg:7, abcdefgh: 8, abcdefghi: 9, abcdefghij:8, abcdefghijk:7, abcdefghijkl:6, abcdefghijklm:5};

      console.log('repoGraph', ratingData);

      //data is the rating value
      var data = Object.keys(ratingData).map(function(k){
        return ratingData[k];
      });

      //labels are the rating key
      var labels = Object.keys(ratingData);

      //find the longest label
      //note: this doens't take into account font differences,
      //just raw number of characters
      var longestLabelLength = d3.max(labels, function(t){ return t.length; });
      //compute size in px for a box to hold the label
      var maxLabelSize = (longestLabelLength * config.textPxFactor);
      var maxIndent = config.indentBarsPx;
      var maxLabelSize = maxLabelSize < maxIndent ? maxLabelSize : maxIndent;


      var width = config.widthPx,
        barHeight = config.heightPx;

      var x = d3.scale.linear()
        .domain([config.minRatingValue, config.maxRatingValue])
        .range([config.leftIndentPx, width-config.rightIndentPx]);

      var chart = d3.select(element[0])
        .append("svg")
        .attr("width", width)
        .attr("height", barHeight * data.length);

      var rating = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) {
          return transStr(maxLabelSize, i * barHeight);
        });



      var bar = rating.append("rect")
        .attr("width", x)
        .attr("height", barHeight - 1);

      var ratingLabel = rating.append("text")
        .attr("x", config.leftMarginLabel - maxLabelSize)
        .attr("y", barHeight/2)
        .attr("dy", config.ratingLabelTextSize)
        .text(function(d,i){ return labels[i] });

      var ratingValue = rating.append("text")
        .attr("x", function(d) { return x(d) - 10; })
        .attr("y", barHeight / 2)
        .attr("dy", config.ratingLabelTextSize)
        .text(function(d, i) { return data[i]; });

    }
    return makeRatingChart;
  })

  .directive('repoRatings', function(){

    return {
      restrict: 'E',
      scope: {
        url: '=',
        name: '=',
        ratings: '='
      },
      template:  [
        '<ul class="repo-ratings"><a class="repo-ratings" href="{{rurl}}">{{ name }}</a>',
        '<li class="repo-ratings" ng-repeat="(k,v) in ratings">',
        '{{k}}: {{v}}',
        '</li>',
        '</ul>'
      ].join("\n"),
      link: function (scope, elem, attrs) {
        //not used
      }
    };
  })

  .directive('repoGraph', function(ratingChart){


    function link(scope, element, attrs){
      var defaultConfig = {
        indentBarsPx: 50,
        textPxFactor: 6,
        leftMarginLabel: 4,
        noDataTemplate: '<div>-- No Ratings --</div>',
        maxRatingValue: 10,
        minRatingValue: 0,
        widthPx: 150,
        heightPx: 10,
        leftIndentPx: 0,
        rightIndentPx: 50,
        ratingLabelTextSize: '0.35em'
      };

      scope.$watch('ratings', function(newVal, oldVal){
        console.log('watched', newVal, oldVal);
        var config = _.extend({}, scope.graphConfig||{}, defaultConfig);

        ratingChart(newVal, element, config);

      });
    }

    return {
      restrict: 'E',
      scope: {
        ratings: '='
      },
      replace: true,
      template: '<div></div>',
      link: link
    };
  });
;
