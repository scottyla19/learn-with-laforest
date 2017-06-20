



'use strict';
// Initializes Assignment.
function Assignment() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.submitBtn = document.getElementById('submitForm');
  this.submitBtn.addEventListener('click', this.submitForm.bind(this));

  this.signInSnackbar = document.getElementById('must-signin-snackbar');

  this.initFirebase();
}
// Sets up shortcuts to Firebase features and initiate firebase auth.
Assignment.prototype.initFirebase = function() {
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));



}

Assignment.prototype.submitForm = function(){
    var course = document.getElementById('course').value;
    var title = document.getElementById('title').value;
    var dueDate = document.getElementById('due').value;
    var assignDate = document.getElementById('assigned').value;
    var links = document.getElementById('links').value;
    var date = new Date();
    var currentTime =  date.getTime().toString();

    var db = firebase.database();
    db.ref(course + '/assignments/' + currentTime).set({
      title: title,
      dateAssigned: assignDate,
      dateDue:  dueDate,
      links: links
    }).then(function() {
      console.log("submitted " + title)
    }).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
    console.log(course + " - " +title + " - " + dueDate + " - " + assignDate + " - " + links);
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
Assignment.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in

  } else { // User is signed out!
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
Assignment.prototype.checkSignedInWithMessage = function() {
  if (this.auth.currentUser) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};



// Checks that the Firebase SDK has been correctly setup and configured.
Assignment.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};


window.onload = function() {

  window.assignment = new Assignment();
};
