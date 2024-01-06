import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { startOfDay, addHours } from 'date-fns';
import axios from 'axios';
import "core-js/stable/atob";
import { jwtDecode } from 'jwt-decode';
import { set } from 'date-fns';
import { useNavigation, useRoute } from '@react-navigation/native';
import { startOfMonth, endOfMonth, eachDayOfInterval, isPast } from 'date-fns';
import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import CommonBtn from '../components/CommonBtn';
import imgPlaceHolder from '../images/doctor.jpg'

import Home from './Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { da } from 'date-fns/locale';

let DaysList = [];
const BookAppointment = ({navigation}) => {
  const route = useRoute();
  const [childName, setChildName] = useState('');
 
const [d,setd] = useState('');
   const olaid =route.params?.studentId;
  const SpecialistId =route.params?.SpecialistId || '';
const SpecialistName = route.params?.SpecialistName || '';
const clinicImage = route.params?.clinicImage || imgPlaceHolder; 
let studentId;
const clinicName = route.params?.clinicName || ''; 

  const [selectedSlot, setSelectedSlot] = useState(-1);
  
  const [selectedGender, setSelectedGender] = useState(0);
  const [selectedDay, setSelectedDay] = useState(-1);
  const [slots, setSlots] = useState([
    {sloT: '8:00-10:00AM', selected: false},
    {sloT: '10:00-12:00PM', selected: false},
    {sloT: '12:00-02:00PM', selected: false},
    {sloT: '02:00-04:00PM', selected: false},
    {sloT: '04:00-06:00PM', selected: false},
    {sloT: '06:00-08:00PM', selected: false},
    {sloT: '08:00-11:00PM', selected: false},
  ]);


  const [days, setDays] = useState([]);
  useEffect(() => {
    const getTokenAndDecode = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token:', token);

        if (token) {
          const decoded = jwtDecode(token);
          console.log('Decoded Token:in book appointment', decoded);
          setd(jwtDecode(token))
        
          console.log("dd",d);
         studentId= decoded.studentId;
          console.log(studentId);
 
        } else {
          console.log('Token not found');
        }
      } catch (error) {
        console.error('Error:', error.stack);
      }
    };
 
    getTokenAndDecode();
  }, []);
  
  useEffect(() => {
    const fetchSpecialistSchedule = async () => {
      try {
        const apiUrl = `http://10.0.2.2:3003/appoint/appointments/${SpecialistId}`;
        const response = await axios.get(apiUrl);
  
        console.log('Response from server:', response.data);
  
        // Access the "data" property in the response
        const appointmentsData = response.data.data;
  
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
        console.error('Error fetching specialist schedule:', error);
        // Handle the error as needed
      }
    };
  
     fetchSpecialistSchedule();
  }, [SpecialistId]);

  const getDayIndex = (dayName) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek.indexOf(dayName);
  };
  
  
  
  
 
  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Header
          icon={require('../images/back.png')}
          title={'Book Appointment'}
        />
        <Image
  source={{ uri: clinicImage }}
  style={styles.docImg} 
/>
       

        <Text style={styles.name}>{SpecialistName}</Text>
        <Text style={styles.spcl}>{clinicName}</Text>
        <Text style={styles.heading}>Select Date</Text>
        <View style={{marginTop: 20}}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={days}
             renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={{
                    width: 60,
                    height: 70,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: selectedDay == index ? 'blue' : 'white',
                    borderWidth: selectedDay == index ? 0 : 1,
                    marginLeft: 10,
                  }}
                  onPress={() => {
                   
                      setSelectedDay(index);
                    
                  }}>
                  <Text style={{color: selectedDay == index ? '#fff' : 'blue'}}>
                    {item.day}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <Text style={styles.heading}>Available Slots</Text>
        <View> 
 


          <FlatList
            numColumns={2}
            data={slots}
             renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.timeSlot,
                    {borderColor: index == selectedSlot ? 'blue' : 'black'},
                  ]}
                  onPress={() => {
                    setSelectedSlot(index);
                  }}>
                  <Text
                    style={{color: index == selectedSlot ? 'blue' : 'black'}}>
                    {item.sloT}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <Text style={styles.heading}>Children Name</Text>
        <TextInput
  style={styles.nameInput}
  placeholder={'Enter Name'}
  value={childName}
  onChangeText={(text) => setChildName(text)}
/>

         
        <Text style={styles.heading}>Select Gender</Text>
        <View style={styles.genderView}>
          <TouchableOpacity
            style={[
              styles.gender,
              {
                borderWidth: 1,
                borderColor: selectedGender == 0 ? 'blue' : 'black',
              },
            ]}
            onPress={() => {
              setSelectedGender(0);
            }}>
            <Image
              source={require('../images/male.png')}
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.gender,
              {
                borderWidth: 1,
                borderColor: selectedGender == 1 ? 'blue' : 'black',
              },
            ]}
            onPress={() => {
              setSelectedGender(1);
            }}>
            <Image
              source={require('../images/female.png')}
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.btnView}>
          <CommonBtn
            w={300}
            h={45}
            txt={'Book Now'}
            status={true}
           
            onClick={() => {
              const selectedDayObject = days[selectedDay];
              const selectedSlotObject = slots[selectedSlot];
            
              if (!selectedDayObject || !selectedSlotObject) {
                console.error('Invalid selection');
                return;
              }
            
              console.log('Selected Day Object:', selectedDayObject);
              console.log('Selected Slot Object:', selectedSlotObject);
            
              const startTime = selectedSlotObject.sloT.split('-')[0].trim(); // Extract start time
              const dayIndex = getDayIndex(selectedDayObject.day);
            
              if (dayIndex === -1) {
                console.error('Invalid day:', selectedDayObject.day);
                return;
              }
            
              const startDate = new Date();
              startDate.setDate(startDate.getDate() + (dayIndex - startDate.getDay() + 7) % 7);
            
              const [startHour, startMinute] = startTime.split(':');
              startDate.setHours(parseInt(startHour), parseInt(startMinute));
            
              const endDate = new Date(startDate);
              endDate.setHours(endDate.getHours() + 2); // Assuming the appointments are 2 hours long
            
              console.log('Formatted Start Date:', startDate);
              console.log('Formatted End Date:', endDate);
            console.log("sid",d.studentId)
              const schema = {
                studentId: d.studentId,
                spicalistId: SpecialistId,
                endDate: endDate,
                startDate: startDate,
                classRoom: clinicName,
                condition : "yes",
              };
            
              const handleBookNow = async () => {
                try {
                  const apiUrl = 'http://10.0.2.2:3003/schoudle/create';
                  const gender = selectedGender === 0 ? 'male' : 'female';
                  const response = await axios.post(apiUrl, schema);
            if(response.data != "there is overlapping schedules"){navigation.navigate('Success');
          }else{
              navigation.navigate('error');
            }
                  // You can update the application state or navigate to the success page here
                  
                } catch (error) {
                  console.error('Error:', error);
                  alert('There is overlapping schedules');
                  // Handle errors here, e.g., show an error message to the user
                }
              };
            
              // Call the function when needed, e.g., in a button press event
              handleBookNow();
            }}
            
            
            
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default BookAppointment;
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  docImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 50,
    alignSelf: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'center',
    marginTop: 10,
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
});
