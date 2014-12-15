// todo app
var app = angular.module('todo', ['ng-polymer-elements', 'ngRoute'])

app.config(function($routeProvider, $locationProvider){

    $routeProvider.when('/', {
        controller: 'ListCtrl',
        templateUrl: 'list.html'
    })

    $routeProvider.when('/add', {
        controller: 'AddCtrl',
        templateUrl: 'add.html'
    })

})

app.factory('Todos', function() {
    var me = {}
    me.key = 'todos'

    if (localStorage[me.key] === undefined) {
        localStorage[me.key] = JSON.stringify([])
        console.log('Initialized DB')
    }

    me.add = function(text) {
        var items = JSON.parse(localStorage[me.key])
        items.push({completed: false, text: text})
        localStorage[me.key] = JSON.stringify(items)
        console.log("Added new item: " + text)
    }

    me.all = function() {
        return JSON.parse(localStorage[me.key])
    }

    me.clearCompleted = function() {
        var items = JSON.parse(localStorage[me.key])
        var cleared = items.filter(function(el) { return el.completed == false; })
        localStorage[me.key] = JSON.stringify(cleared)

        console.log("Cleared a total of "+ cleared.length +" completed items.")
    }

    me.toggle = function(index) {
        var items = JSON.parse(localStorage[me.key])
        items[index].completed = !items[index].completed
        localStorage[me.key] = JSON.stringify(items)
        console.log("Toggled: index: "+ index + " text: " + items[index.text])
    }

    return me
})

app.controller('AddCtrl', ['$scope', '$location', 'Todos', function($scope, $location, Todos){

    $scope.add = function() {
        Todos.add($scope.item)
        $scope.back()
    }

    $scope.back = function() {
        $location.path('/')
    }

}])

app.controller('ListCtrl', ['$scope', 'Todos', function($scope, Todos){

    $scope.clearCompleted = function($event){
        $event.preventDefault()

        Todos.clearCompleted()

        $scope.list()

    }

    $scope.list = function() {
        $scope.items = Todos.all()
    }

    $scope.toggle = function($index) {
        Todos.toggle($index)
    }

    // Render first list
    $scope.list()
}])
