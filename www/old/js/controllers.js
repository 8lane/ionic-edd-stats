angular.module('starter.controllers', ['starter.services'])

.controller('TestCtrl', function($scope, Session) {
    $scope.sessions = Session.query();

    console.log('TEST');
})