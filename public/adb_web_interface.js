var console_element = document.getElementById('console');
var spinner_container = document.getElementById('spinner-container');
var list_of_actions = {};
var configuration = {};


/**
 * Function to populate the list of actions on the page based on the objects in the JSON.
 * An anchor element is created, inserted into a list item, that is inserted in the the list with id "action".
 */

function populateListOfActions() {
    for (item in list_of_actions) {
        if (list_of_actions[item].type_of_request === "action") {
            var anchor_element = document.createElement('a');

            anchor_element.id = item;
            anchor_element.textContent = list_of_actions[item].description;
            anchor_element.href = "";

            var list_item_element = document.createElement('li');

            list_item_element.appendChild(anchor_element);
            document.getElementById('actions').appendChild(list_item_element);
        }
    }
}


/**
 * Function to load the JSON file. The information is inserted into the variables "configuration" and "list_of_actions".
 * Once the information is retrieved, the list of actions is populated and the event listeners are created.
 * todo: create the input forms dynamically too. Support creating multiple.
 */

function loadJSON() {
    var XHR = new XMLHttpRequest();
    XHR.overrideMimeType('application/json');
    XHR.open('GET', 'http://127.0.0.1:4567/settings.json');

    XHR.onreadystatechange = function() {
        if (XHR.readyState === 4 && XHR.status === 200) {
            var full_JSON = JSON.parse(XHR.response);
            configuration = full_JSON[0];
            list_of_actions = full_JSON[1];
            populateListOfActions();

            // Add event listeners
            document.getElementById('actions').addEventListener('click', loadPage, false);
            document.getElementById('forms').addEventListener('submit', loadPage, false);
        }
    };

    XHR.send();
}

loadJSON();


/**
 * Define function to start the spinner.
 */
function startSpinner() {
    spinner_container.style.display = "";
}

/**
 * Define function to stop the spinner
 */
function stopSpinner() {
    spinner_container.style.display = "none";
}

// todo: For some reason, I can't start with the spinner hidden. I have to have it display, then run the function to stop. Figure out why.
stopSpinner();


/**
 * Return a timestamp with the format "m/d/yy h:MM:ss TT"
 * @type {Date}
 */

function timeStamp() {
// Create a date object with the current time
    var now = new Date();

// Create an array with the current month, day and time
    var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

// Create an array with the current hour, minute and second
    var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

// Determine AM or PM suffix based on the hour
    var suffix = ( time[0] < 12 ) ? "AM" : "PM";

// Convert hour from military time
    time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

// If hour is 0, set it to 12
    time[0] = time[0] || 12;

// If seconds and minutes are less than 10, add a zero
    for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
            time[i] = "0" + time[i];
        }
    }

// Return the formatted string
    return date.join("/") + " " + time.join(":") + " " + suffix;
}


/**
 * Print the beginning of an action to the console.
 * @param description
 */

function printStartOfAction(description) {
    description = description || "";

    var begin_action = document.createElement('pre');
    begin_action.className = 'console-text';
    begin_action.insertAdjacentHTML('beforeend', timeStamp() + "    " + description);

    console_element.insertAdjacentHTML('beforeend', '<br>');
    console_element.appendChild(begin_action);
    console_element.scrollTop = console_element.scrollHeight;
}


/**
 * Print the results of an action to the console.
 * @param action
 */

function printResultOfAction(action) {
    var new_line = document.createElement('pre');
    new_line.className = 'console-text';

    new_line.insertAdjacentHTML('beforeend', action);

    console_element.appendChild(new_line);
    console_element.scrollTop = console_element.scrollHeight;
}


/**
 * Create the form for submission, then submit it.
 */

function loadPage(event) {
    event.preventDefault();

    var target = event.target.id;
    var type_of_request = list_of_actions[target].type_of_request;
    var progress_text = list_of_actions[target].progress_text;
    var page = "http://127.0.0.1:4567/run_command";

    var XHR = new XMLHttpRequest();


    XHR.onreadystatechange = function() {
        if (XHR.status === 200 && XHR.readyState === 4) {
            stopSpinner();
            printResultOfAction(XHR.responseText);
        }
    };


    XHR.addEventListener('error', function() {
        console.log('error');
    });


    // Get the command to run.
    var command = list_of_actions[target].command;

    // If the request is for installing an apk, add the path to the apk and the apk name.
    // todo: Support for filenames with spaces.
    if (type_of_request === "install_form") {
        var path_to_apks = configuration.path_to_apks;
        var apk_name = document.getElementById(list_of_actions[target].input_id);

        command = command + path_to_apks + apk_name.value;
    }

    // Construct the form which contains the command to run.
    var form_data = new FormData();
    form_data.append("path_to_ADB", configuration["path_to_ADB"]);
    form_data.append("command", command);

    // Send the data.
    XHR.open("POST", page);
    XHR.send(form_data);

    printStartOfAction(progress_text);
    startSpinner();
}