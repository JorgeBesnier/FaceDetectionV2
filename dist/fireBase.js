var fireBase = fireBase || firebase;
var hasInit = false;
    const config = {
        apiKey: "AIzaSyCrGrao9en43NT_L3vBHt2RoHno8V8qRXY",
        authDomain: "test-prtec.firebaseapp.com",
        projectId: "test-prtec",
        storageBucket: "test-prtec.appspot.com",
        messagingSenderId: "539343904593",
        appId: "1:539343904593:web:a55cb88e5bc3eda246bd70",
        measurementId: "G-DET7FYKBER"
      };
if(!hasInit){
    firebase.initializeApp(config);
    hasInit = true;
}
