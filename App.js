import { StatusBar } from 'expo-status-bar';
import { React, Button, StyleSheet, Text, View, Image, Alert, Title } from 'react-native';
import { useState } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
const foca = require("./images/mascote_foca.png")

const UrgeWithPleasureComponent = ( () => {
  let pomodoroTime = 5;
  let restTime=3;
  const [key, setKey] = useState(0);
  const [isPlayingR, setIsPlayingR] = useState(0);
  const [durationR, setDurationR] = useState(pomodoroTime);
  const [buttonTitle, setButtonTitle] = useState("Iniciar");
  const [pomodorosDone, setPomodorosDone] = useState(0);
  const [isPomodoroTime, setIsPomodoroTime] = useState(true);
  return (
    <View>
      <CountdownCircleTimer
        key={key}
        size={300}
        strokeWidth={25}
        isPlaying={isPlayingR}
        duration={durationR}
        //initialRemainingTime={durationR}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[7, 5, 2, 0]}
        onComplete={() => {
          if (isPomodoroTime==true) {
            setPomodorosDone(pomodorosDone+1)
            setIsPomodoroTime(false)
            setDurationR(restTime)
          } else {
            setIsPomodoroTime(true)
            setDurationR(pomodoroTime)
          }
          setKey(prevKey => prevKey + 1)
          //(isPomodoroTime) ?  : 
          return { 
            shouldRepeat: true, 
            delay: 1.5,
          } 
        }}
      >
        {({ remainingTime }) => <View>
            <Text style={styles.titleText}>{returnSecondToClock(remainingTime)}</Text>
            <Text>{remainingTime} / total {pomodorosDone} / dur: {durationR}</Text>
            </View>
        }
      </CountdownCircleTimer>
      <Button title={buttonTitle} onPress={()=>{
        setDurationR(pomodoroTime)
        if (isPlayingR==true) {
          setKey(prevKey => prevKey + 1)
          setIsPlayingR(false)
          setButtonTitle("Iniciar")
        } else {
          setIsPlayingR(true)
          setButtonTitle("Parar");          
        }
      }}></Button>
    </View>
  )
})

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      <StatusBar style="auto" />
      <UrgeWithPleasureComponent />
      <Image source={foca} style={styles.imageLogo}/>
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
  titleText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  imageLogo: {
    width: "100px",
    height: "100px",
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