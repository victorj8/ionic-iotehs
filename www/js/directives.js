angular.module('asset_directive', ['']).directive('ehasset', function() {
  return {
    restrict: 'AE',
    scope: {
      asset: "=",
      profile: "=",
      trap_profiles: "=aprofiles",
      thresholds: "=threshes",
      parent_update: "=updateFn",
      child_count: "=childCount",
      asset_tree_service: "=treeService",
      invert_text: "@invert",
      shadow_children: "=shadowChildren",
      tooltip_class: "@tooltipClass",
      tooltip_text: "@tooltipText",
      direct: "=directToEdit",
      type_view: "=typeView",
      settings: "@settings"
    },
    templateUrl: '/asset_directive',
    controller: [
      '$scope', '$window', 'AssetService', 'MapService', function($scope, $window, AssetService, MapService) {
        var direct;
        $scope._ = _;
        $scope.direct_to_asset = function(asset, profile) {
          if (($scope.direct != null) && $scope.direct) {
            return direct(asset, "/asset/" + asset.id + "/edit", profile);
          } else {
            return direct(asset, "/asset/" + asset.id, profile);
          }
        };
        direct = function(asset, href, profile) {
          if (asset.show_children != null) {
            return $scope.parent_update(asset, profile);
          } else {
            return $window.location.href = href;
          }
        };
        $scope.show_danger = function(index, profile_key, asset) {
          var profile;
          if (_.isObject(index)) {
            return false;
          }
          profile = $scope.trap_profiles[profile_key];
          return AssetService.show_danger(index, profile, asset, $scope.thresholds);
        };
        $scope.label_for = function(display_object, profile_key) {
          return AssetService.label_for(display_object, profile_key, $scope.trap_profiles);
        };
        $scope.value_for = function(index, profile_key, asset, display_units) {
          if (_.isObject(index)) {
            return $scope.asset_tree_service.calculate_value_for(asset, index);
          } else if (_.isString(index)) {
            return AssetService.value_for(index, profile_key, $scope.trap_profiles, asset, display_units);
          }
        };
        $scope.highlight = function(asset, highlight) {
          MapService.highlight(asset.id, highlight);
          return $scope.hovered = highlight;
        };
        $scope.pull_left = function(list, even) {
          if (_.has(list[0], "image")) {
            return !even;
          } else {
            return even;
          }
        };
        $scope.hasField = function(item) {
          return _.has(item, "field");
        };
        $scope.is_small_type = function() {
          return $scope.type_view === 'small';
        };
        return true;
      }
    ]
  };
});
