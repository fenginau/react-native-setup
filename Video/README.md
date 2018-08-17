
# react-native-video

## Getting started

`$ npm install react-native-video --save`

### Mostly automatic installation

`$ react-native link react-native-video`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-video` and add `RNVideo.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNVideo.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNVideoPackage;` to the imports at the top of the file
  - Add `new RNVideoPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-video'
  	project(':react-native-video').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-video/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-video')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNVideo.sln` in `node_modules/react-native-video/windows/RNVideo.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Video.RNVideo;` to the usings at the top of the file
  - Add `new RNVideoPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNVideo from 'react-native-video';

// TODO: What to do with the module?
RNVideo;
```
  