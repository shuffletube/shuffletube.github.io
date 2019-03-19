var GoogleAuth;
  var SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
  function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    // Retrieve the discovery document for version 3 of YouTube Data API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyAQTQGAOoPucSFjT2KKZkzd2Xs9s1W-Aq8',
        'discoveryDocs': [discoveryUrl],
        'clientId': '964128075521-nm4satik39m8g82hucr9a7lbadici98e.apps.googleusercontent.com',
        'scope': SCOPE
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get();
      setSigninStatus();

      // Call handleAuthClick function when user clicks on
      //      "Sign In/Authorize" button.
      $('#execute-request-button').click(handleAuthClick);
      $('#revoke-access-button').click(revokeAccess);
    });
  }

  function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
      if(confirm("Are you sure you want to sign out of ShuffleTube?")){
        // User is authorized and has clicked 'Sign out' button.
        GoogleAuth.signOut();
      }
    } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }
  }

  function revokeAccess() {
    GoogleAuth.disconnect();
  }

  function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
      $('#revoke-access-button').show();
      $('#authorization-overlay').hide();
      $("#execute-request-button").remove().off("click");
      $('<a class="nav" id="execute-request-button"><span class="min-screen-display">Sign Out</span><i class="material-icons">lock</i></a>').appendTo("nav");
      $("#settings-revoke-access").append($("#revoke-access-button").prop("outerHTML"));
      $('#execute-request-button').click(handleAuthClick);
      onAuth();
    } else {
      $("#authorization-overlay").show();
      $('#revoke-access-button').hide();
      $("#execute-request-button").remove().off("click");
      $('#auth-status').html('Please sign in to access ShuffleTube');
      $('<button id="execute-request-button">Sign In</button>').insertBefore("#revoke-access-button");
      $('#execute-request-button').click(handleAuthClick);
    }
  }

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }
