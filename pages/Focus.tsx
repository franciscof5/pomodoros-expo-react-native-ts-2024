import { StatusBar } from 'expo-status-bar';
import { Platform, Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Audio } from 'expo-av';
import { AppRegistry } from 'react-native';
import { ProgressBar, MD3Colors, PaperProvider } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { WizardStore } from "../storage";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const foca = require("../images/mascote_foca.png")
const soundStart = require("../sounds/crank-2.mp3")
const soundTrompeth = require("../sounds/77711__sorohanro__solo-trumpet-06in-f-90bpm.mp3")
const soundRing = require("../sounds/telephone-ring-1.mp3")

function setSecondsRemainingFromPHP(val) {
  WizardStore.update((s)=>{
    s.secondsRemainingFromPHP = val;
  })
}

let pomodoroTime = WizardStore.getRawState().session_object.pomodoroTime;
let restTime=WizardStore.getRawState().session_object.restTime;

const UrgeWithPleasureComponent = ( () => {
  const [secondsRemainingInsideClock, setSecondsRemainingInsideClock] = useState(pomodoroTime);
  const [key, setKey] = useState(0);
  const [isPlayingR, setIsPlayingR] = useState(Boolean);
  const [buttonTitle, setButtonTitle] = useState("Iniciar");
  const [pomodorosDone, setPomodorosDone] = useState(0);
  const [isPomodoroTime, setIsPomodoroTime] = useState(true);
  const [sound, setSound] = useState(null);
  const [remainingTime, setRemainingTime] = useState();

  async function playSound(soundR) {
    const { sound } = await Audio.Sound.createAsync( soundR );
    setSound(sound);
    await sound.playAsync();
  }

  const completeCicle = function() {
    if (isPomodoroTime==true) {
      //it just completed a pomodoro
      setPomodorosDone(pomodorosDone+1)
      setIsPomodoroTime(false)
      setSecondsRemainingFromPHP(restTime)
      playSound(soundTrompeth)
    } else {
      //it just finished a rest
      setIsPomodoroTime(true)
      setSecondsRemainingFromPHP(pomodoroTime)
    }
    //always has to setKey
    setKey(prevKey => prevKey + 1)
    return { 
      shouldRepeat: true, 
      delay: 1.5,
    } 
  }

  const actioButton = function() {
    setSecondsRemainingFromPHP(pomodoroTime)
    if (isPlayingR==true) {
      setKey(prevKey => prevKey + 1)
      setIsPlayingR(false)
      setButtonTitle("Iniciar")
      playSound(soundRing)
    } else {
      setIsPlayingR(true)
      setButtonTitle("Parar")
      playSound(soundStart)          
    }
  }

  return (
    <View>
      <TouchableOpacity style={styles.buttonFloat} onPress={()=>{actioButton()}} />
      <CountdownCircleTimer
        key={key}
        size={300}
        strokeWidth={25}
        isPlaying={isPlayingR}
        duration={WizardStore.getRawState().secondsRemainingFromPHP}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[7, 5, 2, 0]}
        onComplete={ () => {
          completeCicle()
        } }
      >
        {({ remainingTime }) => <View>
            <Text style={styles.titleText}>{returnSecondToClock(remainingTime)}</Text>
            {/* <Text>seconds: {secondsRemainingFromPHP}</Text> */}
            </View>
        }
      </CountdownCircleTimer>

      <ProgressBar style={{height:20, marginTop:20,marginBottom:20}} progress={0.01+(pomodorosDone/4)} color={MD3Colors.error50} />

      <View>
        <Image source={foca} style={styles.mascotImage}/>
        <Text style={styles.mascotText}>{buttonTitle} / pomodoros done {pomodorosDone}  </Text>
      </View>
    </View>
  )
})

const TaskPanel = ( (rdata) =>{
  return (
    <View>
      <Text>Tarefa </Text>
    </View>
  )
})

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [rdata, setRdata] = useState([]);

  useEffect(() => {
    load_session();

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  async function load_session() {
    console.log("r1");

    var options = {
      method: 'GET',
      url: 'https://www.pomodoros.com.br/wp-admin/admin-ajax.php',
      params: {
        action: 'load_session',
        t: WizardStore.getRawState().token
      },
    };
    console.log("options", options)
    axios.request(options).then(function (r) {
      setRdata(r.data.post_object);
      console.log("r.data.post_object", r.data.post_object);
      let secsP = r.data.secondsRemainingFromPHP;
      let post_status = r.data.post_object.post_status;
      console.log("secsP", secsP);
      console.log("post_status", post_status);
      if(post_status=="future") {
        setSecondsRemainingFromPHP(secsP)
      } else {
        setSecondsRemainingFromPHP(pomodoroTime)
      }
      WizardStore.update((s)=>{
        s.post_object = r.data.post_object
      })
    }).catch(function (error) {
      console.error(error);
    });

    // let data_load_session = {
    //   method: "GET",
    //   action: "load_session",
    //   t: WizardStore.getRawState().token,
    // };
    // await axios.request("https://www.pomodoros.com.br/wp-admin/admin-ajax.php", data_load_session)
    // .then((r)=> {
    //   setRdata(r.data);
    //   let secsP = r.data.secondsRemainingFromPHP;
    //   //pomodoroTime = r.data.secondsRemainingFromPHP;
    //   //rdata = r.data;
    //   console.log("secsP", secsP);
    // })
    // .catch(function (error) {
    //   console.error(error);
    // });
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* <Text>Open up App.js to start working on your app!</Text> */}
        <StatusBar style="auto" />
        <Button 
          title="load_session()"
          onPress={
          async () => {
            await load_session()
          }} />
        <Text>Name: {WizardStore.getRawState().user.username} | {WizardStore.getRawState().user.id}</Text>
        <Text>{WizardStore.getRawState().post_object.post_status ? WizardStore.getRawState().post_object.post_status + " | " + WizardStore.getRawState().post_object.post_title : "loading..."}</Text>
        {/* <Text>TT{ WizardStore.getRawState().post_object["post_status"] }</Text> */}
        <UrgeWithPleasureComponent />
        <TaskPanel />
        <Text>{WizardStore.getRawState().post_object.post_title} - Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownCircleTimer: {
    width:1000,
    backgroundColor: "#09d",
  },
  buttonFloat: {
    position: "absolute",
    zIndex: 10,
    width: 500,
    height: 300,
    backgroundColor: "transparent",
  },
  mascotView: {
     flex:1,
     backgroundColor: "red",
     flexDirection: "row", 
     height: 10,
  },
  mascotImage: {
    width: 100,
    height: 100,
  },
  mascotText: {
    padding:10,
    margin:10,
    width:200,
    height:80,
    borderRadius:5,
    backgroundColor:"#EEE",
  },
  titleText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 10 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

const returnSecondToClock = function (totalSeconds) {
  if (totalSeconds) {
    let hours   = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    seconds = Math.round(seconds * 100) / 100; 

    let result = "";//hide hours (hours < 10 ? "0" + hours : hours);
    result += (minutes < 10 ? "0" + minutes : minutes);
    result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
    return result;

  }
  return totalSeconds;
};