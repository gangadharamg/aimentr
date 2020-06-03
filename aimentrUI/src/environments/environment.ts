// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // API_URL: 'http://localhost:5001/',
  // SERVER_URL: 'http://localhost:8080/',

  // SERVER_URL: 'https://aimentr.com/socket/',
  // SERVER_URL: 'http://localhost:3001/socket/',
  // SERVER_URL: 'http://localhost:5001/',

  // API_URL:"https://aimentruiserver.herokuapp.com/",
  API_URL:"http://localhost:5001/",
  SERVER_URL: 'https://aimentr.herokuapp.com/',

  // SERVER_URL: '',
  // API_URL

  FIREBASE: {
    apiKey: "AIzaSyAnBO2g2olIW14DRkzDOwArxUQ20IRH7WI",
    authDomain: "aimentr-5707f.firebaseapp.com",
    databaseURL: "https://aimentr-5707f.firebaseio.com"
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
