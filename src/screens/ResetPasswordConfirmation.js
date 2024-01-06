import  React, { useState, useEffect,useContext, Component,createContext  } from 'react';
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
 
import { useNavigation, useRoute } from '@react-navigation/native';

  import Button from '../components/CommonBtn';
export default function ForgotPassword({navigation}) {
   
   
   const [Error, setError]= useState(false)
   const [Error1, setError1]= useState(false)
   const [success1, setSuccess1]= useState(false)
   
   const route = useRoute();

      
   const [values, setValues] = useState({
    code: '',
    newpassword: '',
    cnewpassword:'',
})
   const { ForgotEmail,setForgotEmail } = useState('');
    const email =route.params?.email || '';
const handleSubmit = async () =>{
    if (values.newpassword !== values.cnewpassword){
        setError(true);
    }
    try{
        const data ={
            email : email,
            verificationCode : values.code,
            password : values.newpassword,
            cnewpassword : values.cnewpassword,
        };
       
        const response = await axios.post('http://10.0.2.2:3003/student/resetPasswordConfirm', data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.data.success) {
            setSuccess1(true);
            navigation.navigate('Login');
       
          } else {
            setError1(true);
          }

    }catch(err){console.error(err);
    }

}
 return (
   <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
       
       <View style={styles.div2}>
        

       <View style={styles.logo}>
 
       <Text style={styles.text}> Reset Password Confirmation</Text>
      <View style={styles.box}>
     <TextInput 
     
      style={styles.textinput}
     label="Verfication Code"
  
     onChangeText={e => setValues({ ...values, code: e})}
   />
     <TextInput style={styles.textinput} 

label="New Password"
secureTextEntry={true}
onChangeText={e => setValues({ ...values, newpassword: e})}
trailing={props => (
  <IconButton icon={props => <Image  {...props}
  source={require('../images/eye.png')}
  style={{width:43,height:15, resizeMode:'contain'}}

/>} {...props} />
)}
/>
<TextInput style={styles.textinput} 

label="Confirm New Password"
secureTextEntry={true}
onChangeText={e => setValues({ ...values, cnewpassword: e})}
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
         <Text style={styles.errorText}>Your password do not match  </Text>
         <TouchableOpacity onPress={()=>{
           setError(!Error)
         }}>
           <Text style={styles.closeButton}>Close</Text>
         </TouchableOpacity>
       </View>
     </View>
   </Modal>

   <Modal isVisible={Error1}>
     <View style={styles.container}>
       <View style={styles.alert}>
         <Text style={styles.errorText}>Your code not correct  </Text>
         <TouchableOpacity onPress={()=>{
           setError1(!Error1)
         }}>
           <Text style={styles.closeButton}>Close</Text>
         </TouchableOpacity>
       </View>
     </View>
   </Modal>
   <Modal isVisible={success1}>
     <View style={styles.container}>
       <View style={styles.alert1}>
         <Text style={styles.errorText}>Your password reset successfully </Text>
         <TouchableOpacity onPress={()=>{
           setSuccess1(!success1)
         }}>
           <Text style={styles.closeButton}>Close</Text>
         </TouchableOpacity>
       </View>
     </View>
   </Modal>


   <Text style={{color:"white",marginLeft:215, marginTop:12 }}> 
        <TouchableOpacity
           onPress={() =>    navigation.navigate("Login")}
           style={styles.linkButton}
         >
           <Text style={{color: 'white',textDecorationLine: 'underline', marginBottom:-4,marginLeft:5 }}>

            Back to Login</Text>
         </TouchableOpacity></Text>
</View>
     <Button 
      w={150}
      h={40}
      status='true'
      txt={"Submit"}
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
paddingTop:20 , 
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
 text:{
 color: 'white',
 fontSize: 28,
 paddingTop: 40 ,
 fontWeight: 'bold',
 textAlign: 'center',
 width:590
 
},
 
 alert: {
   backgroundColor: 'red',
   padding: 16,
   borderRadius: 4,
   width: '100%',
   alignItems: 'center',
 },
 alert1: {
    backgroundColor: 'green',
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


