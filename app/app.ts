import { Application } from '@nativescript/core';

// Add detailed error logging
Application.on(Application.uncaughtErrorEvent, (args) => {
    if (args.error) {
        console.log('Uncaught error:', args.error.message);
        console.log('Stack trace:', args.error.stack);
        
        // Log additional error properties
        Object.keys(args.error).forEach(key => {
            console.log(`${key}:`, args.error[key]);
        });
    } else {
        console.log('An unknown error occurred');
    }
});

// Add launch event logging
Application.on(Application.launchEvent, () => {
    console.log('Application launched');
});

Application.run({ moduleName: 'app-root' });