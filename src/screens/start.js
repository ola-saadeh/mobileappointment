import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View  ,ImageBackground ,Image ,LinearGradient} from 'react-native';
 import image from '../../assets/gp1(background).jpg'
import logo from '../../assets/logoo-new.png'
import { Animated } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import React, { Component } from 'react';
import CommonBtn from '../components/CommonBtn';
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function RootFunction (){
    const navigation = useNavigation() // extract navigation prop here 
    
     return <HomePage navigation={navigation} /> //pass to your component.
    
      }



class HomePage extends Component {
   
  constructor() {
    super();
    this.spinValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.spin();
  }

  spin() {
    this.spinValue.setValue(0);
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 10000, // Adjust the duration as needed
        useNativeDriver: true, // Enable native driver for performance
      }
    ).start(() => this.spin());
  }
   render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, .5, 1],
      outputRange: [  '-45deg', '+45deg' ,'-45deg'], // Define the animation values
    });
   

  return (
    
    <View style={styles.container}>
       <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.div2}>
        <View style={styles.logo} >
        <Animated.View  style={[ { transform: [{ perspective: 500 }, { rotateY: spin }] }]}>
          {
<Image
        style={styles.tinyLogo}
        source={logo}
        resizeMode="contain"
      />
            
          }
        </Animated.View>
          
        
      <Text style={styles.text}> WELCOME TO PALESTINIAN CHILD INSTITUTE </Text>
      <Text style={styles.text1}>Our mission is to improve and develop the quality of children`s lives</Text>
    
      <CommonBtn
        w={150}
        h={40}
       status={true}
        txt={`Let's Start`}
 
        
       
        onClick={() =>  {
            this.props.navigation.navigate('Login')
                  // now prop will be available here

          }}
      />
    
         
   
          
        </View>
        <Text style={{color:"white", marginBottom:32, textAlign:'center'}}>Don't have an account?
         <TouchableOpacity
            onPress={() =>    this.props.navigation.navigate("RegisterScreen")}
            style={styles.linkButton}
          >
            <Text style={{color: 'white', fontWeight: 'bold', textDecorationLine: 'underline', marginBottom:-4,marginLeft:5 }}>
              Submit Request to Institute
            </Text>
          </TouchableOpacity></Text>
      </View>
    </ImageBackground>
   </View>
  );
}}

const styles = StyleSheet.create({
  button:{
    paddingTop:30
  },
  container:
  {
    flex:1,
    height: '100%',
   
  }
  ,
  logo:{
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',   
    
  },
  tinyLogo: {
    
    width: 200,
    height: 200,
   
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
    fontSize: 17,
    marginBottom:23,
     textAlign: 'center',
     width:315
    
  }
});


