"use strict";

/**
 * @author Rej Mediodia
 * reference http://stackoverflow.com/questions/18692536/node-js-server-close-event-doesnt-appear-to-fire
 * , http://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
 * http://joseoncode.com/2014/07/21/graceful-shutdown-in-node-dot-js/
 *
 */

var config = require('./config');

var callbacks = [];
var closeEvents = config.closeEvents;

function NodeGracefulExit(options) {
    if (!(this instanceof NodeGracefulExit))
        return new NodeGracefulExit(options);

    options = options || {};
    config.log = options.log;
}

NodeGracefulExit.prototype = {
    init: init,
    include: include,
    addEvent: addCloseEvent,
    removeEvent: removeCloseEvent
};

function addCloseEvent(eventData) {
    log('adding event with data:');
    closeEvents.push(eventData);
}

/**
 * If you want to remove an event to your graceful exit
 * object key and value
 */
function removeCloseEvent(key, value) {
    log('removing event with', key, ':', value);
    closeEvents = closeEvents.filter(function(eventData) {
        return eventData[key] != value;
    });
}

function include(callback, option) {
    option = option || {};
    // push first the callback and wait for end process
    callbacks.push({run: callback, option});
}

function runCallbacks(data) {
    log(data.code, ' process event was triggered.');
    log(data.desc);
    callbacks.forEach(function(callback) {
        // if option is to run once do not run again the callback if it is already ran.
        if (callback.option.once && callback.ran) return;

        callback.run(data);
        callback.ran = true;
    });
}

function listenProcesses(callback) {
    // listen for close processes
    closeEvents.forEach(function(eventData) {
        process.on(eventData.code, callback.bind(eventData));
    });
}

function init() {
    // prevent the app to close instantly
    process.stdin.resume();

    log('Initialize end process of node');
    listenProcesses(_onEnd);
}

/**
 * if uncaught exception error has a value
 */
function _onEnd(err) {
    let data = this;
    data.message = err;

    // run process before closing
    // log('Before process end, running all registered callbacks');
    runCallbacks(data);
    // log('All registered callbacks have been run, process will now end ...');
    // inform to continue to exit
    process.exit(0);
}

function log() {
    if (!config.log) return;

    let message = [].slice.call(arguments);
    console.log(message);
}

module.exports = NodeGracefulExit;
