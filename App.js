import { StatusBar } from 'expo-status-bar';
import { Platform, React, Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert, Title } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Audio } from 'expo-av';
import { AppRegistry } from 'react-native';
import { ProgressBar, MD3Colors, PaperProvider } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const foca = require("./images/mascote_foca.png")
const soundStart = require("./sounds/crank-2.mp3")
const soundTrompeth = require("./sounds/77711__sorohanro__solo-trumpet-06in-f-90bpm.mp3")
const soundRing = require("./sounds/telephone-ring-1.mp3")

const UrgeWithPleasureComponent = ( () => {
  let pomodoroTime = 5;
  let restTime=2;
  const [key, setKey] = useState(0);
  const [isPlayingR, setIsPlayingR] = useState(0);
  const [durationR, setDurationR] = useState(pomodoroTime);
  const [buttonTitle, setButtonTitle] = useState("Iniciar");
  const [pomodorosDone, setPomodorosDone] = useState(0);
  const [isPomodoroTime, setIsPomodoroTime] = useState(true);
  const [sound, setSound] = useState();
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
      setDurationR(restTime)
      playSound(soundTrompeth)
    } else {
      //it just finished a rest
      setIsPomodoroTime(true)
      setDurationR(pomodoroTime)
    }
    //always has to setKey
    setKey(prevKey => prevKey + 1)
    return { 
      shouldRepeat: true, 
      delay: 1.5,
    } 
  }

  const actioButton = function() {
    setDurationR(pomodoroTime)
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
        duration={durationR}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[7, 5, 2, 0]}
        onComplete={ () => {
          completeCicle()
        } }
      >
        {({ remainingTime }) => <View>
            <Text style={styles.titleText}>{returnSecondToClock(remainingTime)}</Text>
            {/* <Text>seconds: {durationR}</Text> */}
            </View>
        }
      </CountdownCircleTimer>

      <ProgressBar style={{height:20, marginTop:20,marginBottom:20}} progress={0.01+(pomodorosDone/4)} color={MD3Colors.error50} />

      <TaskPanel />

      <View style={styles.mascotView}>
        <Image source={foca} style={styles.mascotImage}/>
        <Text style={styles.mascotText}>{buttonTitle} / pomodoros done {pomodorosDone}  </Text>
      </View>
    </View>
  )
})

const TaskPanel = ( () =>{
  return (
    <View>
      <Text>Tarefa</Text>
    </View>
  )
})
export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
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
  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* <Text>Open up App.js to start working on your app!</Text> */}
        <StatusBar style="auto" />
        <UrgeWithPleasureComponent />

        <Text>Your expo push token: {expoPushToken}</Text>
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
    width:"1000px",
    backgroundColor: "#09d",
  },
  buttonFloat: {
    position: "absolute",
    zIndex: 10,
    width: 500,
    height: 300,
    backgroundColor: "transparent",
  },
  // mascotView: {
  //   flex:1,
  //   flexDirection: "row", 
  // },
  mascotImage: {
    width: "100px",
    height: "100px",
  },
  mascotText: {
    padding:"10px",
    margin:"10px",
    width:"100px",
    height:"100px",
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
    trigger: { seconds: 2 },
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
    alert('Must use physical device for Push Notifications');
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