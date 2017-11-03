A simple app to share pictures with people from a shared event.

## How to use

You can run this as a web app by running 
```
ionic serve 
``` 

or in a simulator as a mobile app. 
```
ionic serve -l
```

You can also compile to native code and side-load it onto your device
```
ionic cordova build ios
```

### database dependancy

This application uses Firebase ( https://firebase.google.com/ ) as a backend.

1. Create a file in /src/environments/ named db-config.ts

2. Follow the instructions at https://firebase.google.com/docs/web/setup to set up your instance

3. Place the initialization config in the file created above