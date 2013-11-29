// ### Authors
// Jamie Dyer <http://kernowsoul.com>
// ### Last changed
// 2012-06-23

// ## Overview
// Setup the applications namespace. Also includes the pluralize helper function that is
// available to the entire application.

window.App = {

  // The perPage setting tells the applications how many articles to display per page
  perPage: 100,

  dispatcher: _.clone(Backbone.Events),

  // ### pluralize
  // Accepts a singular word and a count
  // Helper function that wraps the inflection library's `pluralize` function for ease of use.
  // Usage `App.pluralize('article', 1)` will return 'article', `App.pluralize('article', 5)`
  // will return 'articles'
  pluralize: function(singular, count) {
    if (count == 1) {
      return singular;
    } else {
      return singular.pluralize();
    }
  },

  // ### pauseProcessing
  // Accepts the `interval` parameter, if passed it will call `App.resumeProcessing()` after the specified amount
  // of time.
  // This function pauses the processing of the news feeds by setting the `App.canBackgroundProcess` variable to
  // `false`. Other classes look at this variable to know if they should run their code.
  pauseProcessing: function(interval){
    var self = this;
    this.canBackgroundProcess = false;
    clearInterval(this.pauseProcessingIntervalId);
    if(interval){
      this.pauseProcessingIntervalId = setTimeout(function(){
        self.resumeProcessing();
      }, interval);
    }
  },

  // ### App.resumeProcessing
  // Simply sets `App.canBackgroundProcess` to `true` so that other classes will know they are allowed to run their code
  resumeProcessing: function(){
    this.canBackgroundProcess = true;
  }

};


/*global App: false, Filer: false */

// ## Overview
// This file sets up the backbone application and initializes all classes required for the application
// to run, this includes loading initial data where required.

// Call `App.resumeProcessing()` immediately so processes know they can run
App.resumeProcessing();

// Create a setup object for all the setup code
App.setup = {};

// ### App.setup.initializeAndLoadSettings
// Initializes the settings model and loads the settings data either from Google sync
// storage or from settings files
App.setup.initializeAndLoadSettings = function(){
  console.log('initializeAndLoadSettings');
  // Create a new settings model
  App.settings = new App.Settings();
  console.log('settings');
  // Fetch the settings from the sync storage
  App.settings.fetch({
    success: function(){

      $.getJSON('javascripts/settings.json', function(data) {
        console.log(data);
        // Store the default list of categories so it can be used throughout the application
        App.defaultCategories   = data.defaultCategories;

        // Store the languages supported by the application
        App.supportedLanguages  = data.languages;

        // If no categories have been previously stored set the default categories
        if(!App.settings.get('categories')){
          // Save the categories in the settings model
          App.settings.save({ "categories" : App.defaultCategories });
        }

        // If not feed language has been set create one
        if(!App.settings.get('feedLanguage')){
          App.settings.save({
            "feedLanguage" : {
              "code": 'en_th', //chrome.i18n.getMessage("languageCode"),
              "name": 'Thailand', //chrome.i18n.getMessage("nation")
          }});
        }

        App.dispatcher.trigger('settingsLoaded');
      });

      $.getJSON('_locales/en/messages.json', function(messages) {
        console.log(messages);
        window.chrome.i18n.messages = messages;
      });
    }
  });
};

// ### App.setup.initializeArticles
// Handles all initialization to do with the articles collections and model
App.setup.initializeArticles = function(){

  // Filer is now initialized, the articles collection can be initialized
  App.articles = new App.Articles();

  // Trigger the `articlesInitialized` event
  App.dispatcher.trigger('articlesInitialized');

  // Load articles from storage
  App.articles.fetch({
    success: function(){

      // Tell the articles model to start pulling data from the Google news feeds
      App.articles.startProcessing();

      // Trigger the `articlesLoaded` event
      App.dispatcher.trigger('articlesLoaded');
    }
  });
};

// Trigger the `appLoaded` event when everything is loaded
 
// Register event handlers
App.dispatcher.on('appLoaded',      App.setup.initializeAndLoadSettings );
App.dispatcher.on('settingsLoaded', App.setup.initializeArticles        );



var chrome = {
  i18n : {
    getMessage : function(key){
      return  this.messages && this.messages[key] != undefined ? this.messages[key].message : key;
    }
  },
  messages : null
}

window.App.proxy_url = 'http://news-reader-proxy.herokuapp.com?url=';
window.App.proxy_img_url = 'http://news-reader-proxy.herokuapp.com/img.php?url=';
window.chrome = chrome;
