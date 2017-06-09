# Learn with LaForest

This repository is my first attempt at a progressive web app. This app is my classroom website (I currently teach high school math and engineering). The app will be hosted on firebase for the ease of deployment and data storage as well as PWA requirements of HTTP/2 and HTTPS default on firebase.


# Trials and Triumphs
- Implementing switching between classes via the menu button was my first challenge as I had a hard time getting the `addEventListener()` method to work correctly and pass the `this` value as well as a parameter. After researching more on the `bind()` method I realized that I can add args after the `this` parameter which will be prepended to the bound method. So for each menu item I passed the corresponding class name after the `this` parameter.  Example
```javascript
 this.showAlg1 = document.getElementById('showAlg1')
 this.showAlg1.addEventListener('click', this.clickedOn.bind(this, "Alg1"));
 ```
- Service-worker: CDNs at getmdl.io are not CORS supported. So I had to manually fetch them and then cache them thanks to the answer here by Jeff Posnick on [StackOverflow](https://stackoverflow.com/questions/39109789/what-limitations-apply-to-opaque-responses/39109790#39109790).
Example
```javascript
const request = new Request('https://code.getmdl.io/1.3.0/material.deep_purple-yellow.min.css', {mode: 'no-cors'});
fetch(request).then(response => cache.put(request, response));
```
- Firebase DB- TIL that firebase saves data locally on all firebase clients [Firebase offline](https://firebase.google.com/docs/database/web/read-and-write#write_data_offline) . I was going to make a fetch then cache fetch event for the firebase databas url but this default functionality seems to work fine for offline.

- Struggling getting firebase messagine working with topics. First was using API key instead of SERVER_KEY which led to 401 responses. And also needed to prepend key= in the request header for the google iid api. Still receiving empty object for response on checking current topics.

- In order to show admin link only to admin (me) I created a child in the firebase db of `isAdmin`. The isAdmin child has children nodes for eadh admin id. I can then check the signed in user's id against the database.

  ```javascript
  this.database.ref('/isAdmin/').once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
          if (childSnapshot.key.replace(/\"/g, "") === userId) {
            console.log("isAdmin");
            document.getElementById('showAdmin').removeAttribute("hidden");
          }
          else{
            document.getElementById('showAdmin').setAttribute('hidden', 'true');
          }
      });
  });
  ```
