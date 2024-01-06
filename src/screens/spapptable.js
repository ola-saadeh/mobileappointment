import {View, Text, StyleSheet, FlatList, Image,ScrollView,TouchableOpacity} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "core-js/stable/atob";
import { jwtDecode } from 'jwt-decode';
import imgPlaceHolder from '../images/doctor.png'
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import CommonBtn from '../components/CommonBtn';
import { isNewBackTitleImplementation } from 'react-native-screens';

const Completed = ({navigation}) => {
  const route = useRoute();
  const [selectedSlot, setSelectedSlot] = useState(-1);
  const [selectedDay, setSelectedDay] = useState(-1);
  const [slots, setSlots] = useState([]);
  const [days, setDays] = useState([]);
 
  let spName;
  const [values, setValues] = React.useState([]);

  
  const [appointments, setAppointments] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [  specialistId,   setSpecialistId] = useState([]);

 
  
  useEffect(() => {
    const getTokenAndDecode = async () => {
      try {

        
        const token = await AsyncStorage.getItem('token');
        console.log('Token:', token);

        if (token) {
          const decoded = jwtDecode(token);
          console.log('Decoded Token:in pendinng', decoded);
          const specialistIdFromToken = decoded.studentId;
          setSpecialistId(specialistIdFromToken);  
      
           spName = decoded.email;
           fetchSp(specialistIdFromToken);
          
           const fetchSpecialistSchedule = async () => {
            try {
              const apiUrl = `http://10.0.2.2:3003/appoint/appointments/${specialistIdFromToken}`;
              const response = await axios.get(apiUrl);
        
              console.log('Response from server:', response.data);
        
              // Access the "data" property in the response
              const appointmentsData = response.data.data;
        console.log(response.data)
              // Check if appointmentsData is an array before mapping
              if (Array.isArray(appointmentsData)) {
                console.log('Appointments Data:', appointmentsData);
        
                // Extract selectedDays and selectedSlots and flatten the arrays
                const extractedDays = appointmentsData.flatMap(appointment => appointment.selectedDays) || [];
                const extractedSlots = appointmentsData.flatMap(appointment => appointment.selectedSlots) || [];
        
                console.log('Extracted Days:', extractedDays);
                console.log('Extracted Slots:', extractedSlots);
        
                // Transform extracted days into the desired format
                const formattedDays = extractedDays.map(day => ({ day, selected: false }));
          // Convert extractedSlots to the desired structure
          const formattedSlots = extractedSlots.map(slot => ({ sloT: slot, selected: false }));
      
          console.log('Formatted Slots:', formattedSlots);
      
                setDays(formattedDays);
                setSlots(formattedSlots);
              }
            } catch (error) {
                console.log("sds",specialistId)
              console.error('Error fetching specialist schedule:', error);
              // Handle the error as needed
            }
          };
          fetchSpecialistSchedule();

         } else {
          console.log('Token not found');
        }
      } catch (error) {
        console.error('Error:', error.stack);
      }
    };
    const fetchSp = async (specialistIdFromToken) => {
        const Response = await axios.get(`http://10.0.2.2:3003/Spicalistion/${specialistIdFromToken}`);
        const spData = Response.data;
        
        setValues(spData);
        console.log("hhhhhhh",spData)
      };
    getTokenAndDecode();
  }, [specialistId]);
   
  
 


  const getDayIndex = (dayName) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek.indexOf(dayName);
  };
  
 
 


  
  


  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Header
          icon={require('../images/back.png')}
          title={'Selected Available'}
        />
  
        {days.length > 0 && (
          <>
            <Text style={styles.heading}>Select Date</Text>
            <View style={{marginTop: 20}}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={days}
                renderItem={({item, index}) => {
                  return (
                    
                      <Text
                        style={{
                            width: 100,
                            height: 60,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                       padding:20,
                            borderWidth: selectedDay == index ? 0 : 1,
                            marginLeft: 10,
                          color:  'blue',
                        }}>
                        {item.day}
                      </Text>
            
                  );
                }}
              />
            </View>
          </>
        )}
  
        {slots.length > 0 && (
          <>
            <Text style={styles.heading}>Available Slots</Text>
            <View>
              <FlatList
                numColumns={2}
                data={slots}
                renderItem={({item, index}) => {
                  return (
                    <Text
                    style={[
                      styles.timeSlot,
                      {
                        borderColor: index == selectedSlot ? 'blue' : 'black',
                        textAlign: 'center', // توسيط النص
                        justifyContent:'center',
                      
                        borderRadius: 20,
                      },
                    ]}>
                    {item.sloT}
                  </Text>
                  
                  );
                }}
              />
            </View>
          </>
        )}
  
        <View style={styles.btnView}>
          {days.length > 0 && slots.length > 0 ? (
            <CommonBtn
              w={300}
              h={45}
              txt={'Delete Now'}
              status={true}
              onClick={() => {
                const handleBookNow = async () => {
                    try {
                        // إرسال طلب DELETE لحذف مواعيد التخصص
                        const deleteResponse = await axios.delete(`http://10.0.2.2:3003/appoint/appointments/${specialistId}`);
                      
                        // إرسال طلب PUT لتحديث الحالة isAvailable إلى false
                        const putResponse = await axios.put(`http://10.0.2.2:3003/Spicalistion/${specialistId}`, {
                          isAvailable: false
                        });
                      
                        // التحقق من نجاح الطلبين
                        if (deleteResponse.status === 200 && putResponse.status === 200) {
                          // تم حذف المواعيد وتحديث الحالة بنجاح
                          console.log('Appointments deleted and isAvailable updated successfully.');
                      
                          // يمكنك إجراء الإجراءات الإضافية هنا، على سبيل المثال، تحديث حالة الحوالة أو إعادة التوجيه إلى شاشة أخرى.
                          navigation.navigate('Successdelete');
                        } else {
                          // في حالة حدوث خطأ في أحد الطلبين
                          console.error('Error in one of the requests.');
                          // يمكنك إضافة إجراءات إضافية هنا، على سبيل المثال، إظهار رسالة خطأ للمستخدم.
                        }
                      } catch (error) {
                        // في حالة حدوث خطأ عام
                        console.error('Error:', error);
                        // يمكنك إضافة إجراءات إضافية هنا، على سبيل المثال، إظهار رسالة خطأ للمستخدم.
                      }
                      
                };
  
                // Call the function when needed, e.g., in a button press event
                handleBookNow();
              }}
            />
          ) : (
            <Text>You don't have any available time to delete.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
  
};

export default Completed;
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
  docImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 50,
    alignSelf: 'center',
  },
 

  spcl: {
    fontSize: 16,
    fontWeight: '700',
    alignSelf: 'center',
    marginTop: 10,
    color: '#36419A',
    backgroundColor: '#a0b5eb',
    padding: 5,
    borderRadius: 10,
  },
  heading: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
    marginLeft: 15,
  },
  timeSlot: {
    width: '45%',
    height: 40,
    borderRadius: 10,
    borderWidth: 0.5,
    margin: 10,
    padding:10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameInput: {
    borderRadius: 10,
    marginTop: 10,
    width: '94%',
    height: 45,
    borderWidth: 0.5,
    alignSelf: 'center',
    paddingLeft: 20,
  },
  genderView: {
    marginTop: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  gender: {
    borderRadius: 10,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnView: {marginTop: 20, marginBottom: 20},
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
    color: 'green',
  },
});
