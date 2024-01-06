import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect} from 'react';
import { LearnMoreLinks } from 'react-native/Libraries/NewAppScreen';
import { km } from 'date-fns/locale';
import { scheduleFlushOperations } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon';
 
const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('start');     
    }, 3000);
}, []);
  return (
    <View style={styles.container}>
      <Image source={require('../images/oa.png')} style={styles.logo} resizeMode="contain"/>
      <Text style={styles.title}>Book Session</Text>
    </View>
  );
};
  
export default Splash;
const styles = StyleSheet.create({
  container: {   
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#36419A',
  },
  logo: {
    width: 200,
    height: 210,
    tintColor: '#fff',
  },
  title: {color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 20},
});
