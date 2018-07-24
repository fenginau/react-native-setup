import * as firebase from 'firebase';

// absolutely nothing to see here...
const config = {
  apiKey: 'AIzaSyAs0x5RZfj2HWVda2sBbNbXZCcmzu_jtIU',
  authDomain: 'reacttest-5733d.firebaseapp.com',
  databaseURL: 'https://reacttest-5733d.firebaseio.com',
  projectId: 'reacttest-5733d',
  storageBucket: 'reacttest-5733d.appspot.com',
  messagingSenderId: '413369226301',
};

firebase.initializeApp(config);

export default firebase;