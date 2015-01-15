// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones,

requirejs.config({
  baseUrl: "js/lib",
  paths: {
    'app': '../app',
    'config': '../../config',
    'jquery': 'jquery-2.1.1.min'
  },
  shim: {
//    'jquery': []
  }
});

// Load the main app module to start the app
requirejs(["app/main"]);
