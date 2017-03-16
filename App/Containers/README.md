### Containers Folder
A container is the so-call "Smart Component" in Redux, a component knows about Redux. Containers are usually used as "Screens".

There're 2 special containers: `App.js` and `RootContainer.js`.

`App.js` is first component loaded after `index.ios.js` or `index.android.js`. The purpose of this file is to setup Redux or 
any other non-visual "global" modules. Having Redux setup here helps the hot-reloading process for React Native app 
development, so it won't try to reload your sagas and reducers colors change.

`RootContainer.js` is the first visual component in the app.  It is the ancestor of all other screens and components.

With those two files you can add components, database like Firebase or something visual like an overlay.
