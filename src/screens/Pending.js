import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "core-js/stable/atob";
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import imgPlaceHolder from '../images/doctor.png'
import { format } from 'date-fns';
 
import Header from '../components/Header';
 
 const Pending = () => {
  const route = useRoute();
     
  const iid =route.params?.studentId || '';
  const [appointments, setAppointments] = useState([]);
  
  let studentId;
  const [specialists, setSpecialists] = useState([]);
  
  useEffect(() => {
    const getTokenAndDecode = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token:', token);

        if (token) {
          const decoded = jwtDecode(token);
          console.log('Decoded Token:in pendinng', decoded);
          studentId= decoded.studentId;
          console.log(decoded.studentId);
          console.log(studentId);
          await fetchAppointments(studentId);
        } else {
          console.log('Token not found');
        }
      } catch (error) {
        console.error('Error:', error.stack);
      }
    };
    getTokenAndDecode();
  }, []);
   
  
 
  

   // استرجاع البيانات من الخادم
   const fetchAppointments = async (studentId) => {
    try {
      const appresponse = await axios.get(`http://10.0.2.2:3003/schoudle/user/${studentId}`);
      const appointmentsData = appresponse.data;

      console.log("Appointments Data:", appointmentsData);
      const appointments = appointmentsData;

      const specialistPromises = appointments.map(specialist =>
        axios.get(`http://10.0.2.2:3003/Spicalistion/${specialist.spicalistId}`)
      );
      const specialistDetails = await Promise.all(specialistPromises);

      const updatedSpecialistsData = appointments.map((specialist, index) => ({
        ...specialist,
        additionalDetails: specialistDetails[index].data,
      }));
  
      setSpecialists(updatedSpecialistsData);
      console.log(updatedSpecialistsData)
      console.log(specialists)
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
 
  
  const formatAppointmentTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'hh:mm a'); // تنسيق الوقت كـ 07:30 PM
  };
  
  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd'); // تنسيق التاريخ كـ 2023-12-30
  };
  
  const renderSpecialistItem = ({ item, index }) => {
    if (item.condition === "yes") {
      return null;
    }
    
    return (
    <View style={styles.itemView}>
    <Image
source={item.additionalDetails?.spimage ? { uri: `${item.additionalDetails?.spimage}` } : imgPlaceHolder}  
style={styles.docImage}        
    />
    <View>
                

      <Text style={styles.name}>   {item.additionalDetails?.firstname} {item.additionalDetails?.lastname}</Text>
      <Text style={styles.timing}>{formatAppointmentDate(item.startDate)} {formatAppointmentTime(item.startDate)} </Text>
      
      <Text  style={styles.nameq}>{item.additionalDetails?.subjectofspecialization}</Text>

    </View> 
    <Text style={styles.status}>{'Pending'}</Text>
  </View>
 
  );};




  return (
    <View style={styles.container}>
      <Header
      
        icon={require('../images/back.png')}
        
        title={'Pending  Appointments'}


      
        
      />
       <View>
        <FlatList
           data={specialists}
        
          renderItem={renderSpecialistItem}
        />
      </View>
    </View>
  );
};

export default Pending;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemView: {
    width: '94%',
    height: 100,
    borderRadius: 10,
    borderWidth: 0.5,
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  docImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
  },
  nameq: {
  
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 20,
  },
  nam1: {
    
      fontSize: 14,
      marginTop: 5,
      fontWeight: '600',
      alignSelf: 'center',
      color: '#36419A',
      backgroundColor: '#a0b5eb',
      padding: 5,
      borderRadius: 10,
      textAlign: 'center',
       
   
  },
  timing: {
    fontSize: 16,
    marginLeft: 20,
    marginTop: 5,
  },
  status: {
    marginLeft: 60,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    padding: 5,
    color: 'orange',
  },
});   

   





