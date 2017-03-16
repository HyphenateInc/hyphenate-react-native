# React Native

## Content

1. [Version Support](#version-support)
2. [Version log](#version-log)
3. [Start](#start)
   1. [Getting Started](#getting-started) 
   2. [notes](#notes)
      - [node_modules](#node_modules)
   3. [Android](#android-debug-and-release)
      - [Android potential issues](#android-potential-issues)
   4. [iOS](#ios-debug-and-release)
      - [iOS potential issues](#ios-potential-issues)
4. [Content structure](#content-structure)
5. [Redux State](#redux-state)
6. [Features coming soon](#features-coming-soon)
7. [Hyphenate Web SDK](#hyphenate-web-sdk)
      
## Version Support

iOS >= 9.0
Android >= 4.1 (API 16)

Note: Development and testing environment is base on Mac.



## Version log

Current version **v0.2.0 @ 2017-01-03**

**[CHANGE LOG](./CHANGELOG.md)**



## Getting Started

### Setup React Native Environment

1. Set up React Native environment https://facebook.github.io/react-native/docs/getting-started.html
2. Run `$ npm install` to install dependencies and ensure React Native are up to date.

**Note:**

1. Install the latest vesion of npm by running `$ npm install npm@latest -g`
2. Install yarn by running command `$ npm install -g yarnpkg@0.15.1`
3. Run `$ npm run newclear` if encountering library dependency (node_modules) errors, which triggers commands `rm -rf $TMPDIR/react-* && watchman watch-del-all && rm -rf ios/build/ModuleCache/* && rm -rf node_modules/ && npm cache clean && npm i'.
4. Clean the buffer after installation**
  - `npm run clean`
  - Open Xcode: select product -> clean
  - Please close the terminal if open there's one currently open

- Compile debug version of the app if no signature in place, release version require signature to run
- Update app version. Go to package.json -> `version` key

### IDEs

#### WebStorm on Mac

1. Add project: File -> New -> Project -> select "React Native" -> select project file location -> pop up "Create Project" The directory {file path} is not empty. Would you like to create a project from existing sources instead? -> select "Yes"
2. Open the app "Terminal" -> Run `$ npm install` to install dependencies
3. Add simulator: select "Run" tab -> "Edit Configurations" -> click "+" sign -> select "React Native" -> select "Target platform", either Android or iOS -> click "OK"
4. select "Run" tab -> click "Run"

- [WebStorm react native setup](https://blog.jetbrains.com/webstorm/2016/12/developing-mobile-apps-with-react-native-in-webstorm/)

#### Android 

1. Basic installation environment iOS and Android https://facebook.github.io/react-native/docs/getting-started.html

- `$ brew install android-sdk`
```bash
	// zshrc depending on your dependencies
	export ANDROID_HOME=~/Library/Android/sdk
	export PATH=${PATH}:${ANDROID_HOME}/tools:${ANDROID_HOME}/platform-tools
	export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_112.jdk/Contents/Home/
	// remember this!
	source .zshrc
```

2. Emulator and SDK installation https://developer.android.com/studio/run/managing-avds.html
	- react-native support api minimal 16
	- Recommend use `$ android ` for API and image management
		- Install API and Image based on your platform dependencies
		- Create image after install `AVD Mannger ` successfully
		- Install Android xx (API xx)
			- SDK Platform
			- Google APIS Intel x86 Atom System Image
	- Recommend use `Android studio` for image management and operation (or use `$ android avd ` )
		- Open any item -> Tools -> Android -> AVD Manager / SDK Manager

3. Emulator testing
	- run any Image
		- `emulator -avd <avd name>`
	- root diretory `$ npm start ` and run the server
	- root diretory `$ react-native run-android` will install app to Image（will install to physical device if connected）
		- use `sudo` for authentication errors
		- There's no need to recompile the app everytime once the app is running normally on the device, because contect is loaded via `main.jsbundle`.
	- after running
		- `ctr + m` or `cmd + m` to turn on controller
			- if button failed, then try: emulator -> settings -> send keyboards shortcuts to -> Emulator controls(default)
	- Emulator production testing environment: `$ react-native run-android --variant=release`

4. Formal signed version https://facebook.github.io/react-native/docs/signed-apk-android.html
	- Please follow the steps above to sign the app
	- `build.gradle` located in android/app directory
	- compile to `$ cd android && ./gradlew assembleRelease`

5. 4 different methods to install to device
	- `$ react-native run-android  --variant=release`
	- `$ npm run android:install`
		- Remove the installed package from physical device
	- `$ npm run android:build`
		- Go to `android/app/build/outpus/apk` and run `adb install xx.apk`. Make sure there's one device is running
		- Download `Android File Transfer`, will automatically popup if connected（unlock device, allow USB testing, connect to device）
	- `$ cd android && ./gradlew assembleRelease`
6. log
	- `$ npm run android:logcat`
	- Check the log for abnormal app termination. Device must be under the same network as computer.

#### Commands

```bash
$ npm start
$ android
$ android avd
$ emulator -avd n4-768
$ react-native run-android
$ react-native run-android  --variant=release
$ npm run android:install
$ npm run android:build
$ npm run android:logcat
$ ./gradlew assembleRelease
$ ./gradlew installRelease
$ cd android/app/build/outpus/apk && adb install app-release.apk
```

**Note: see shortcuts in root directory `package.json` scripts content**

#### Android issues

##### Q: Emulator is running intially for the first time, but failed later on
A: Remove image file, rebuild it, then run it again

##### Q: Have trouble installing on physical device
A: Try remove the installed app first, the reinstall
- https://github.com/facebook/react-native/issues/2720

##### Q: Object.freeze can only be called on Object 
A: `ctrl+m` to open controller, the select `Debug JS Remotely`


#### iOS 

1. Basic installation environment iOS and Android https://facebook.github.io/react-native/docs/getting-started.html

2. iOS simulator installation
	- Xcode -> Preferences-> Components -> iOS x.x Simulator

3. Simulator testing
	- `react-native run-ios --simulator "iPhone 7"`
	- `cmd + d` to open controller
	- `cmd + r` reload

4. Physical device testing
	- Xcode config
		- Targets -> app -> General -> Signing -> add an iCloud account
		- Add team and unique Bundle Identifier. ex. org.reactjs.native.example.app.lwz
			- Targets -> app -> General -> Signing -> Team
			- Targets -> app -> General -> Signing -> Signing Certificate
			- Targets -> app -> General -> Identity -> Bundle Identifier -> update unique id indicator
			- Targets -> appTests -> General -> Signing -> Team
			- Targets -> appTests -> General -> Signing -> Signing Certificate
		- `Product -> Scheme -> Edit Scheme (cmd + <), make sure you're in the Run tab from the side` update to debug or release
		- `Project -> app -> Configurations -> use 'debug' for command-line builds` update to debug or release
	- Xcode to ensure the usability of app/main.jsbundle, do not add customized index
		- main.jsbundle packaging
			- Packaging using cURL  https://github.com/facebook/react-native/issues/5747
			- `react-native bundle --dev false --platform ios --entry-file ./index.ios.js --bundle-output ./ios/app/main.jsbundle`
				- this method does not support `npm link`, need to `npm unlink hyphenate-web`
	- Debug and release are sharing the same controller, just update the build setting to debug or release on Xcode
	- Run app on physical device via Xcode
		- will automatically open a packager if there's no packager initiated, then build a release version package
		- Note: No relation with local file main.jsbundle. packaging will not update the local version of the file.
	- Xcode -> select device -> run
	- Trust certification: iOS device -> General -> Device Management ->  persion Certificate -> trust it
	- You can turn on controller by shaking the phone under debug mode if the app is running successfully.

- [Signing for requires a development team](https://github.com/CocoaPods/CocoaPo ds/issues/5531)
- [Running On Device](https://facebook.github.io/react-native/docs/running-on-device-ios.html)

```bash
$ npm start
$ react-native run-ios --simulator "iPhone 7"
$ react-native run-ios
$ react-native bundle --dev false --platform ios --entry-file ./index.ios.js --bundle-output ./ios/app/main.jsbundle
```

#### iOS issues

##### Q：Notes
- Close controller between switch to debug or release
- `react-native run-ios --simulator "iPhone 7"`. Make sure no physical device is connected to computer, able to compile multiple devices, but will not be able to run them.

##### Q: If compilation failed
A: Try cleaning, turn off package controller, then run the app

##### Q: Undefined symbols for architecture arm64: "___gxx_personality_v0"
A:  https://github.com/facebook/react-native/issues/11454

##### Q: cant find module npmlog （after yarn installation）
A: fix `curl -0 -L http://npmjs.org/install.sh | sudo sh`

##### Q: Animated: `useNativeDriver` is not supported because the native animated module is missing
Include the NativeAnimation module on iOS in the starter projec

A: https://github.com/facebook/react-native/issues/10638

##### Q: React Native BUILD SUCCEED, but “No devices are booted.”
A: 
- `react-native run-ios` do not use `sudo`, that will cause app compilation issue for simulator
- compiling error `NSLocalizedDescription = "Permission denied";` if not using `sudo`
  - `sudo chmod 777 /Users/username/.babel.json`
- if still receiving `Permission denied` related problems
  - make sure the components and files are under the current user's directory not in root
  - `sudo chown -R user:user_group directory_name`

##### Q: Latest react-native app doesn't work ":CFBundleIdentifier", Does Not Exist #7308
A: https://github.com/facebook/react-native/issues/7308
```
Go to File -> Project settings
Click the Advanced button
Select "Custom" and select "Relative to Workspace" in the pull down
click done, done
```

## Content structure
- App
	- Containers | Page | Routing
		- App.js main entry point
			- Redux/ initialization
			- I18n/ initialization
			- Config/index.js system initialization
		- RootContainer.js root container
			- Navigation/NavigationRouter.js initial routing
			- /Config/ReduxPersist persistent initialization
	- Common components
	- I18n multi-languages support
	- Images resources
	- Lib Web IM initialization
	- Navigation routing
	- Redux actions / reducers
	- Hyphenate web SDK


## Redux State

Redux is a predictable state container for JavaScript apps. [Learn more](http://redux.js.org/)

```javascript
{
	// UI related
	ui: [
		// ex. UI loading
		common: {
			fetching:false
		},
		login: {
			username: '',
			password: '',
			isSigned: false,
		},
		register: { },
		contactInfo: { },
	],
	im: [],
	// data entities
	entities: {
		roster: {
			byName: {
				{
					jid, name, subscription, groups?
				}
			},
			names: ['lwz2'...],
			// friend list is based on roster
			friends: [],
		},
		// subscribe notified
		subscribe: {
			byFrom: {}
		},
		room: {},
		group: {
			byId: {},
			names: []
		},
		members: {
			byName: [],
			byGroupId: []
		}
		blacklist: {},
		message: {
			byId: {}
			chat: {
				[chatId]: [messageId1, messageId2]
			},
			groupChat: {
				[chatId]: {}
			},
		}
	}
}
```

## Features coming soon

- https issue
- splash screen
- hot reloading
- local storage
- Chat optimization, limit the queue length and message pagination
- full loading



## Hyphenate Web SDK 
React Native SDK is modified due to different browser environment from [Hyphenate web SDK](http://docs.hyphenate.io/docs/web-install-sdk). Hyphenate web SDK is not suitable for direct use under react-native environment, please refer the following steps for React Native SDK integration.

### Integration
1. Copy `App/Lib/WebIM.js` and `App/Lib/WebIMConfig.js`
 
  WebIM.js

  ```js
  // copy the modified strophe
  import '../Sdk/dist/strophe-1.2.8.js'
  // modified sdk directory
  import websdk from '../Sdk'
  // react-native has window object, but not standard browser. Rely on xmldom module for window and document object.
  import xmldom from 'xmldom'
  // modification of basic messaging: remove some browser dependencies
  import config from './WebIMConfig'
  // you can modify http components for http request
  import Api from '../Services/Api'
  ```
  
  ```js
  let WebIM = window.WebIM = websdk
  window.WebIM.config = config
  // strophe dependency
  window.DOMParser = xmldom.DOMParser
  // parse document object
  let document = window.document = new DOMParser().parseFromString("<?xml version='1.0'?>\n", 'text/xml')
  
  // establish connection
  WebIM.conn = new WebIM.connection({
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: WebIM.config.https,
    url: WebIM.config.xmppURL,
    isAutoLogin: false,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval
  })
  ```

2. copy App/Sdk directory
3. install dependencies for xmldom  `$ npm install --save xmldom`
4. replace with customized http module
5. Demo example: App/Containers/App.js, listen to XMPP event（currently using Redux, you can customize it depending on the framework and method of data processing)

```js
WebIM.conn.listen({
  // xmpp connected successfully
  onOpened: (msg) => {
    // push message after presence
    WebIM.conn.setPresence();
    // get contacts
    store.dispatch(RosterActions.getContacts())
    // login successful
    store.dispatch(LoginActions.loginSuccess(msg))
    // get blacklist
    store.dispatch(BlacklistActions.getBlacklist())
    // get group list
    store.dispatch(GroupActions.getGroups())

    NavigationActions.contacts()
  },
  ...
```
