'use strict';
// Initializes Assignment.
function Assignment() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.assignmentsList = document.getElementById('assignments')
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');

  this.currentCourse = "Alg1";
  document.getElementById('showAlg1').addEventListener('click', this.setCourse.bind(this, "Alg1"));
  document.getElementById('showIED').addEventListener('click', this.setCourse.bind(this, "IED"));
  document.getElementById('showCEA').addEventListener('click', this.setCourse.bind(this, "CEA"));
  document.getElementById('show3DDA').addEventListener('click', this.setCourse.bind(this, "3DDA"));

  this.signInButton.removeAttribute("hidden");
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));


  this.initFirebase();
}
Assignment.prototype.setCourse = function(course){
  this.currentCourse = course;
  this.clearAssignments();
  this.loadMessages();
}

Assignment.prototype.clearAssignments = function(){
  var myNode = document.getElementById("assignments");
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
}
// Sets up shortcuts to Firebase features and initiate firebase auth.
Assignment.prototype.initFirebase = function() {
    this.auth = firebase.auth();
    this.database = firebase.database();
    // this.storage = firebase.storage();
    // Initiates Firebase auth and listen to auth state changes.
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
  };

Assignment.prototype.signIn = function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
  };

Assignment.prototype.signOut = function() {
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
Assignment.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
      // Get profile pic and user's name from the Firebase user object.
      var profilePicUrl = user.photoURL; // Only change these two lines!
      var userName = user.displayName;   // Only change these two lines!
    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

    // We load currently existing chant messages.
    this.loadMessages();

    // We save the Firebase Messaging Device token and enable notifications.
    // this.saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');
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

// // Saves the messaging device token to the datastore.
// Assignment.prototype.saveMessagingDeviceToken = function() {
//   firebase.messaging().getToken().then(function(currentToken) {
//     if (currentToken) {
//       console.log('Got FCM device token:', currentToken);
//       // Saving the Device Token to the datastore.
//       firebase.database().ref('/fcmTokens').child(currentToken)
//           .set(firebase.auth().currentUser.uid);
//     } else {
//       // Need to request permissions to show notifications.
//       this.requestNotificationsPermissions();
//     }
//   }.bind(this)).catch(function(error){
//     console.error('Unable to get messaging token.', error);
//   });
// };
// // Requests permissions to show notifications.
// Assignment.prototype.requestNotificationsPermissions = function() {
//   console.log('Requesting notifications permission...');
//   firebase.messaging().requestPermission().then(function() {
//     // Notification permission granted.
//     this.saveMessagingDeviceToken();
//   }.bind(this)).catch(function(error) {
//     console.error('Unable to get permission to notify.', error);
//   });
// };


Assignment.prototype.loadMessages = function() {
  var course =  "algebra1"
  switch (this.currentCourse) {
    case 'Alg1':
      course = "algebra1";
      break;
    case 'IED':
      course = "ied";
      break;
    case 'CEA':
      course = "cea";
      break;
    case '3DDA':
      course = "3dda";
      break;
  }
  var assignTitle = document.getElementById('assignmentsTitle');
  assignTitle.textContent = this.currentCourse + ' Assignments';
  // Reference to the /assignments/ database path.
  this.messagesRef = this.database.ref(course+'/assignments');
  // Make sure we remove all previous listeners.
  this.messagesRef.off();


  // Loads the last 12 messages and listen for new ones.
  var setMessage = function(data) {
    var val = data.val();
    this.displayAssignment( data.key, val.title, val.description, val.dateAssigned, val.dateDue, val.links);
  }.bind(this);

  this.messagesRef.limitToLast(12).on('child_added', setMessage);
  this.messagesRef.limitToLast(12).on('child_changed', setMessage);
};


// Template for messages.
Assignment.ASSIGNMENT_TEMPLATE =
'<li class="mdl-list__item mdl-list__item--two-line">' +
  '<span class="mdl-list__item-primary-content">' +
    '<i class="material-icons mdl-list__item-avatar">assignment</i>'+
    '<span class="title"></span>'+
    '<span class="mdl-list__item-sub-title dateAssigned"></span>'+
    '<span class="mdl-list__item-sub-title dateDue"></span>'+
    '<span class="mdl-list__item-sub-title links"></span>'+
  '</span> </li>'
  // +
  // '<span class="mdl-list__item-secondary-content">'+
  // '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="list-checkbox-1">'+
  //   '</label>'+
  // '</span>'


Assignment.prototype.displayAssignment = function(key, title, desc, assigned, due, links) {

  var div = document.getElementById(key);

  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('li');
    container.innerHTML = Assignment.ASSIGNMENT_TEMPLATE ;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.assignmentsList.appendChild(div);
  }

  div.querySelector('.title').textContent = title;
  div.querySelector('.dateAssigned').textContent = "Assigned: "+ this.convertTimestamp(assigned);
  div.querySelector('.dateDue').textContent = "Due: " + this.convertTimestamp(due);


  //template for adding checkbox in secondary info
  //<input type="checkbox" id="list-checkbox-1" class="mdl-checkbox__input" checked />
};


// Checks that the Firebase SDK has been correctly setup and configured.
Assignment.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};

Assignment.prototype.convertTimestamp = function(timestamp){
  var dateDue = new Date(timestamp*1000);
  return  ""+ (dateDue.getMonth()+ 1) + "/" + dateDue.getDate() + "/" + dateDue.getFullYear()
};
window.onload = function() {
  window.assignment = new Assignment();
  window.assignment.loadMessages();
};
