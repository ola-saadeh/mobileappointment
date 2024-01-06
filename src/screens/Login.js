 import  React, { useState, useEffect, Component  } from 'react';
 import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    LinearGradient,
    Easing 
  } from 'react-native';
  import { Animated } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import image from '../../assets/gp1(background).jpg'
import logo from '../../assets/logoo-new.png'
 import Modal from 'react-native-modal';
 
import {NavigationContainer} from '@react-navigation/native';
 
import { Stack, TextInput, IconButton } from "@react-native-material/core";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'
 
 
   import Button from '../components/CommonBtn';
export default function LoginPage({navigation}) {
    
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const [Error, setError]= useState(false)

    
    const handleForgotPass = () => {
      navigation.navigate('ForgetPassword')
 
    }
      
    const handleSubmit = () => {

try{
   
        axios.post('http://10.0.2.2:3003/student/login', values)
            .then(res => {
                
                if (res.status === 200 && res.data === "Incorrect password"  ) {              
                    
                    setError(true)

                }

                else { mmm =async()=>
                  {
                  AsyncStorage.setItem("token", res.data.token);
                  token = await AsyncStorage.getItem("token")
                  if (res.data.message == "11"){ navigation.navigate('Home') }else{ navigation.navigate('Homesp')}
                  
                 
                    
                }
                mmm()
                    
                }
            })
            .catch(err => console.log(err));
    }
    catch (error) {
        console.error('Axios Error:', error);
        // Handle the error (e.g., display an error message to the user)
      }
}

const [slideValue] = useState(new Animated.Value(-200)); // قيمة الانزلاق من الأعلى

useEffect(() => {
  Animated.timing(
    slideValue,
    {
      toValue: 0,
      duration: 900,
      easing: Easing.linear,
      useNativeDriver: true,
    }
  ).start();
}, [slideValue]);
  return (
    <View style={styles.container}>
       <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.div2}>
        <View style={styles.logo}>
        <Animated.View  style={[ { transform: [{ translateY: slideValue }] }]}>
          {
<Image
        style={styles.tinyLogo}
        source={require("../images/oa.png")}
        resizeMode="contain"
      />
            
          }
        </Animated.View>
       <View style={styles.box}>
      <TextInput 
      type="email"
       style={styles.textinput}
      label="Email"
      leading={props =>  <Image  {...props}
        source={require('../images/account.png')}
        style={{width:23,height:23}}
      
      />}
      onChangeText={e => setValues({ ...values, email: e})}
    />
    <TextInput style={styles.textinput} 

      label="Password"
      secureTextEntry={true}
      onChangeText={e => setValues({ ...values, password: e})}
      trailing={props => (
        <IconButton icon={props => <Image  {...props}
        source={require('../images/eye.png')}
        style={{width:43,height:15, resizeMode:'contain'}}
      
      />} {...props} />
      )}
    />
<Modal isVisible={Error}>
      <View style={styles.container}>
        <View style={styles.alert}>
          <Text style={styles.errorText}>Your password or email is incorrect or this account doesn't exist!</Text>
          <TouchableOpacity onPress={()=>{
            setError(!Error)
          }}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    <Text style={{color:"white",marginLeft:215, marginTop:12 }}> 
         <TouchableOpacity
            onPress={handleForgotPass}
            style={styles.linkButton}
          >
            <Text style={{color: 'white',textDecorationLine: 'underline', marginBottom:-4,marginLeft:5 }}>
              Forget Password?
            </Text>
          </TouchableOpacity></Text>
</View>
      <Button 
       w={150}
       h={40}
       status='true'
       txt={"log in"}
       onClick={() => {
           handleSubmit()
                  // now prop will be available here
          }} style={styles.button}
              title="LogIn"
              ViewComponent={LinearGradient}
              titleStyle={{ fontWeight: 'bold', fontSize: 20 }}
              linearGradientProps={{
                backgroundColor:'#01205d'
              }}
              buttonStyle={{
                borderWidth: 0,
                width:"90%",
                borderRadius: 20,
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
              icon={{
                name: 'arrow-right',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
            />
          
        </View>
      </View>
    </ImageBackground>
   </View>
  );
            }
const styles = StyleSheet.create({
    textinput:{
        width:"90%",
        paddingTop:20,
        borderRadius: 20,
        
    },
  button:{
    paddingTop:30 ,
    width:"90%"
  },
  container:
  {
    flex:1,
    height: '100%',
   
  }
  ,
  box:{
width:"90%",
justifyContent: 'center', // Center vertically
alignItems: 'center', 
paddingTop:70 , 
paddingBottom:10,

  },
  logo:{
    
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',   
  },
  tinyLogo: {
    width: 200,
    height: 210,
    tintColor: '#fff',
  
   
    justifyContent: 'center'
  },
  image: {
    flex: 1,
    justifyContent: 'center'},

  div2: {
    
    backgroundColor: '#3f3f3fcc',
    width:'100%',
    height:'100%',
    
  },
  header:{
   
    width:'100%',
    height:'10%'
  },
  text: {
    color: 'white',
    fontSize: 30,
    paddingTop: 40 ,
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
  text1: {
    paddingTop: 10 ,
    color: 'white',
    fontSize: 20,
    
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
  alert: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  closeButton: {
    color: 'white',
    fontSize: 16,}

});


