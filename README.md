A collection of minimal apps to get myself started with React Native.

Built a few web apps with Next.JS. Goal is to port them to mobile.

* One folder for each app.
* Starting with a very basic Hello World
* Building up to something I could use in production.


| App         | Purpose                     |
|:-------------|-----------------------------|
| hello_world 			| Simple text       			|
| nav_swipe 			| Swipe between two screen      |

### Observations 
Random things I noticed coming from Next.JS

* Basic hello world app from expo template `npx create-expo-app --template expo-template-blank` is 259 MB
* press Ctrl + D (or shake your device) to open the developer menu
* [StatusBar](https://reactnative.dev/docs/statusbar)
   * `hidden` hides the top bar 
* [Expo Component List](https://docs.expo.dev/versions/latest/)
* [View Component](https://reactnative.dev/docs/view)
 * the most fundamental building block for creating user interfaces. equivalent of a `<div>` in web development
 * Flexbox by Default: React Native uses flexbox for all layout. flexDirection defaults to column (unlike the web, where it defaults to row).
 * No Inherited Styles
 * Nested, yes
* Navigation with [React Navigation](https://reactnavigation.org/docs/getting-started/)
* Have to position the TopNavigator bar manually? That's weird

### Run

Testing on iOS

* Install "Expo Go"

* cd into app dir

```
npm install expo
npx expo start
```

* Scan QR Code on phone

