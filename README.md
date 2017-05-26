# Learn with LaForest

This repository is my first attempt at a progressive web app. This app is my classroom website (I currently teach high school math and engineering). The app will be hosted on firebase for the ease of deployment and data storage as well as PWA requirements of HTTP/2 and HTTPS default on firebase.


# Trials and Triumphs
- Implementing switching between classes via the menu button was my first challenge as I had a hard time getting the `addEventListener()` method to work correctly and pass the `this` value as well as a parameter. After researching more on the `bind()` method I realized that I can add args after the `this` parameter which will be prepended to the bound method. So for each menu item I passed the corresponding class name after the `this` parameter.  Example
```javascript
 this.showAlg1 = document.getElementById('showAlg1')
 this.showAlg1.addEventListener('click', this.clickedOn.bind(this, "Alg1"));
 ```
- Service-worker: Wanted to try making my own but could sw-precache and sw-toolbox work?
