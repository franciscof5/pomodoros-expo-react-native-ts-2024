import { StatusBar } from 'expo-status-bar';
import { React, Button, StyleSheet, Text, View, Image, TouchableOpacity, Alert, Title } from 'react-native';
import { useState } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
const foca = require("./images/mascote_foca.png")



const UrgeWithPleasureComponent = ( () => {
  let pomodoroTime = 2;
  let restTime=1;
  const [key, setKey] = useState(0);
  const [isPlayingR, setIsPlayingR] = useState(0);
  const [durationR, setDurationR] = useState(pomodoroTime);
  const [buttonTitle, setButtonTitle] = useState("Iniciar");
  const [pomodorosDone, setPomodorosDone] = useState(0);
  const [isPomodoroTime, setIsPomodoroTime] = useState(true);
  
  const completeCicle = function() {
    if (isPomodoroTime==true) {
      //it just completed a pomodoro
      setPomodorosDone(pomodorosDone+1)
      setIsPomodoroTime(false)
      setDurationR(restTime)
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
    } else {
      setIsPlayingR(true)
      setButtonTitle("Parar");          
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
      <View style={styles.mascotView}>
        <Image source={foca} style={styles.mascotImage}/>
        <Text style={styles.mascotText}>{buttonTitle} / pomodoros done {pomodorosDone}  </Text>
      </View>
    </View>
  )
})

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      <StatusBar style="auto" />
      <UrgeWithPleasureComponent />
    </View>
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