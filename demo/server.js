"use strict";
const gracefulExit = require('../index')();//({log: true});
const express = require('express');
const app = express();

// remove event and adding event should be declare before initiazing the init
gracefulExit.removeEvent('code', 'exit')

// if the events being listen is not in the current configuration you can still that event
gracefulExit.addEvent({
    "code": "exit",
    "desc": "Application will now exit.",
    "comment": "on app close"
});
gracefulExit.init();

gracefulExit.include(function(data) {
    console.log('- - - - - - - - - - - - - - - - - - - -');
    console.log('INCLUDE THIS', data);
    console.log('- - - - - - - - - - - - - - - - - - - -');
});


gracefulExit.include(function(data) {
    console.log('- - - - - - - - - - - - - - - - - - - -');
    console.log('INCLUDE THIS AND RUN ONCE', data);
    console.log('- - - - - - - - - - - - - - - - - - - -');
}, { once: true });

app.listen(3000, function() {
    console.log('app listen to port 3000');
});
