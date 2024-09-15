import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import Constants from "expo-constants";

import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { WizardStore } from "../storage";
import { Button, MD3Colors, ProgressBar, TextInput } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios"; 
import Toast from 'react-native-root-toast';

//import { jsonFieldsChecklist } from "../assets/jsonFieldsChecklist.json"
//import { data } from "../assets/data.json"


export default function LoginScreen({ navigation }) {
  //const jsonFieldsChecklist = require("../assets/checklistApiRetorno.json");
  //const [fieldsArea, setFieldsArea] = useState();
  //const data = require('../assets/data.json');
  // keep back arrow from showing
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const {
    handleSubmit,
    control,
    register,

    formState: { errors },
  } = useForm({ defaultValues: WizardStore.useState((s) => s) });
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused &&
      WizardStore.update((s) => {
        s.progress = 0;
      });
      
  }, [isFocused]);

  const onSubmit = (data) => {
    console.log("onSubmit")
    let datasend_login = {
      username: "foca",
      password: "931777"
    }
    axios.post("https://www.pomodoros.com.br/wp-json/jwt-auth/v1/token", datasend_login)
    .then((r)=> {
      let token = r.data.token;
      console.log("token", token);
      
      var options = {
        method: 'POST',
        url: 'https://www.pomodoros.com.br/wp-json/wp/v2/users/me',
        headers: {
          Authorization: 'Bearer ' + token,
        }
      };
      
      axios.request(options)
      .then(function (r2) {
          console.log(r2.data);
          console.log("r2.data", r2.data)
          WizardStore.update((s)=> {
            s.token = token;
            s.user = r2.data;
            let toast = Toast.show('Bem vindo ' + r2.data.username, { position: 0 });
          })
          navigation.navigate("Focus");
      }).catch(function (error) {
        let toast = Toast.show('Erro ao recuperar dados do usuário', { position: 0 });
        console.error(error);
      });

      // axios.post("https://www.pomodoros.com.br/wp-json/wp/v2/users/me", datasend_tokenme)
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  return (
    <View style={styles.container}>
      <ProgressBar
        style={styles.progressBar}
        progress={WizardStore.getRawState().progress}
        color={MD3Colors.primary60}
      />
      <View style={{ paddingHorizontal: 16 }}>
        
        <View style={styles.formEntry}>
          <Controller
            control={control}
            rules={{
              //required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label="Usuário"
                placeholder="Digite seu nome de usuário"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="username"
          />
          {errors.username && (
            <Text style={{ margin: 8, marginLeft: 16, color: "red" }}>
              Campo obrigatório.
            </Text>
          )}
        </View>

        <View style={[styles.formEntry]}>
          <Controller
            control={control}
            rules={{
              //required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label="Senha"
                placeholder="Digite sua senha"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                //keyboardType="numeric"
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={{ margin: 8, marginLeft: 16, color: "red" }}>
              Campo obrigatório.
            </Text>
          )}
        </View>

        <Button
          onPress={handleSubmit(onSubmit)}
          mode="outlined"
          style={styles.button}
        >
          ENTRAR
        </Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    margin: 8,
  },
  formEntry: {
    margin: 8,
  },
  container: {
    flex: 1,
  },
  progressBar: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
});
