/**
 * Created by Jer Villanueva on 6/28/14.
 */

var adbWebInterface = angular.module('adbWebInterface', []);

var controllers = {};

controllers.SettingsController = function ($scope, ServerCalls) {

    // Variable to control whether the loading indicator shows or not.
    $scope.loading = false;

    // Load the json list of commands.
    ServerCalls.loadJSON('/commands.json').success(function (data) {
        $scope.commands = data;
        console.log("Commands loaded.");

        // Iterate through all the commands in the json and make each into a property of $scope so we can call it later.
        for (var iterator = 0; iterator < $scope.commands.length; iterator++) {
            $scope[$scope.commands[iterator].name] = ServerCalls.unpackJSON($scope.commands, iterator);
        };

    });

    // Load the configuration.
    ServerCalls.loadJSON('/configuration.json').success(function (data) {
        $scope.configuration = data;
        console.log("Configuration loaded.");
    });

    // When a list item is clicked, do something. Clicked list item is determined by the id.
    $scope.submitCommand = function($event) {
        $scope.loading = true;

        $scope.printHistory($scope[$event.target.id].progress_text);

        ServerCalls.runCommand($scope, $event).
            success(function (data) {
                $scope.printHistory(data);
                $scope.loading = false;
            });
    };


    // Store the history of commands here.
    $scope.history = {};

    // Print the history to the "terminal"
    $scope.printHistory = function(message) {
        $scope.history[Date.now()] = message;
    };

    // Initialize package name variable. This is tied to the input box.
    $scope.packageName = "";

    // When the button is clicked, find and install the package.
    $scope.installPackage = function() {
        $scope.loading = true;

        $scope.printHistory("Starting install...");

        ServerCalls.installPackage($scope).
            success(function (data) {
                $scope.printHistory(data);
                $scope.loading = false;
            });
    };
};

adbWebInterface.controller(controllers);

adbWebInterface.factory('ServerCalls', function($http) {

// Retrieve json
    var factory = {};
    factory.loadJSON = function(URL) {
        return $http.get(URL);
    };

// Create object for each command in commands.json
    factory.unpackJSON = function(listOfCommands, index) {
        return {
            "description": listOfCommands[index].description,
            "progress_text": listOfCommands[index].progress_text,
            "command": listOfCommands[index].command
        };
    };


// Submit command
    factory.runCommand = function(scope, event) {

        // Construct the JSON to send to the server.
        var responseBody = {};

        responseBody["path_to_ADB"] = scope.configuration.path_to_ADB;
        responseBody["command"] = scope[event.target.id].command;

        var httpPost = $http.post('/run_command', responseBody);
        return httpPost;
    };


// Install app
    factory.installPackage = function(scope) {
        var responseBody = {};

        responseBody["path_to_ADB"] = scope.configuration.path_to_ADB;
        responseBody["command"] = "adb install " + scope.configuration.path_to_apks + scope.packageName;

        var httpPost = $http.post('/run_command', responseBody);
        return httpPost;
    };


    return factory;
});

