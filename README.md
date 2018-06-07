# node-graceful-exit
Add/Run additional process before the node intentionally/unintentionally close the app.

# Setup
This library was setup with `ES2015`.

# Installation
`npm install --save node-graceful-exit`

# Usage
```
const server = require('http').createServer(app);
const gracefulExit = require('node-graceful-exit')({log: true});

gracefulExit.init();

gracefulExit.include(function(exit) {
    exit.wait = true;
    console.log('closing server in', process.pid);
    server.close(function() {
        // successfully close
        exit.done();
    });
    // run once
}, {once: false});

server.listen(3000, function() {
    console.log(`Node development server started on port 3000`);
});
```

`gracefulExit.include` will add all your additional process before exiting the application. The first parameter is requesting for a callback and the second parameter is asking for object.

```
gracefulExit.include(callback, object)
```

The callback parameter gave a first parameter which has a property of `wait` and `done`.
- `wait` - default `false`. It is useful to inform the process to wait for your asynchronous function before proceeding to terminate the app.
- `done` - this is useful when you are using the `wait` property. It is the one that signal that your asynchronous function is finish.

The second parameter object has a property.
- `once` - default: `true`. it informs that your process should be run only once. This is for instance that the terminated signal emit 2 events which will run your process by the number of events receive.

`gracefulExit.addEvent` - add additional close events to be listen.

```
// if the events being listen is not in the current configuration you can still that event
gracefulExit.addEvent({
    "code": "exit",
    "desc": "Application will now exit.",
    "comment": "on app close"
});
```


`gracefulExit.removeEvent` - remove events that is now being listen.

```
// remove event and adding event should be declare before initiazing the init
gracefulExit.removeEvent('code', 'exit')
```

# References & Inspiration
- [Cleanup Before Node Exit](http://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits)
- [Graceful shutdown](http://joseoncode.com/2014/07/21/graceful-shutdown-in-node-dot-js/)
