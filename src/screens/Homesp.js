import React from 'react';
 import  { useState ,useEffect } from 'react'
 import axios from 'axios'
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import { ImageBackground } from 'react-native';

import { View, TouchableOpacity, FlatList, StyleSheet,  Image,SafeAreaView} from 'react-native';
import {themeColors} from '../Theme'
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import "core-js/stable/atob";

import { jwtDecode } from 'jwt-decode';
import { ScrollView } from 'react-native-gesture-handler';

const ProfileScreen = ({navigation}) => {

    const [values, setValues] = React.useState([]);
    const [valuese, setValuese] = React.useState([]);
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
  
    const days = [
      { id: 1, day: 'Monday' },
      { id: 2, day: 'Tuesday' },
      { id: 3, day: 'Wednesday' },
      { id: 4, day: 'Thursday' },
      { id: 5, day: 'Friday' },
      { id: 6, day: 'Saturday' },
      { id:7, day: 'Sunday' },
    ];
  
    const slots = [
      { id: 1, slot: '8:00 AM - 10:00 AM' },
      { id: 2, slot: '10:00 AM - 12:00 PM' },
      { id: 3, slot: '12:00 PM - 2:00 PM' },
      { id: 4, slot: '2:00 PM - 4:00 PM' },
      { id: 5, slot: '4:00 PM - 6:00 PM' },
    ];
 let spID;
 const toggleDaySelection = (day) => {
    const updatedDays = selectedDays.includes(day) ? selectedDays.filter((selectedDay) => selectedDay !== day) : [...selectedDays, day];
    setSelectedDays(updatedDays);
  };

  const toggleSlotSelection = (slot) => {
    const updatedSlots = selectedSlots.includes(slot) ? selectedSlots.filter((selectedSlot) => selectedSlot !== slot) : [...selectedSlots, slot];
    setSelectedSlots(updatedSlots);
  };
  const renderSelectionButtons = (data, selectedItems, toggleSelection) => {
    return (
      <FlatList
        numColumns={2}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              ...styles.selectionButton,
              backgroundColor: selectedItems.includes(item.id) ? 'blue' : 'white',
            }}
            onPress={() => toggleSelection(item.id)}
          >
            <Text style={{ color: selectedItems.includes(item.id) ? 'white' : 'blue' }}>{item.day || item.slot}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };
      
    useEffect(() => {
        const getTokenAndDecode = async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            console.log('Token:', token);
    
            if (token) {
              const decoded = jwtDecode(token);
              console.log('Decoded Token:', decoded);
             spID = decoded.studentId;
              console.log(spID);
              fetchSp(spID);
              console.log(values)
            setValuese(decoded)
            } else {
              console.log('Token not found');
            }
          } catch (error) {
            console.error('Error:', error.stack);
          }
        }; 

        const fetchSp = async (spID) => {
            const Response = await axios.get(`http://10.0.2.2:3003/Spicalistion/${spID}`);
            const spData = Response.data;
            
            setValues(spData);
          };
      
    getTokenAndDecode()
}, []);

const handleBookNow = async () => {
    try {
      // Ensure at least one day and slot are selected
      if (selectedDays.length === 0 || selectedSlots.length === 0) {
        alert('Please select at least one day and one time slot.');
        return;
      }
  
      // Additional data needed for the request
  
      // Construct the request payload based on selected days and slots
      const requestData = {
        spicalistId: values._id,
        selectedDays: selectedDays.map(dayId => days.find(day => day.id === dayId).day),
        selectedSlots: selectedSlots.map(slotId => slots.find(slot => slot.id === slotId).slot),
        classRoom: values.subjectofspecialization,
        // Add other data fields as needed
      };
  
      // Check if the specialist already has appointments
      const existingAppointments = await checkExistingAppointments(values._id);
      if (existingAppointments.length > 0) {
        // If there are existing appointments, handle accordingly (e.g., show a message)
        
        alert('Specialist already has appointments. Cannot add new schedule.');
        return;
      }
  
      // Make the POST request to your Express.js server
      const apiUrl = 'http://10.0.2.2:3003/appoint/create'; // Update the URL
      const response = await axios.post(apiUrl, requestData);
  
      // Handle the response accordingly
      console.log('Server response:', response.data);
      const putResponse = await axios.put(`http://10.0.2.2:3003/Spicalistion/${values._id}`, {
        isAvailable: true
      });
    
   
      navigation.navigate('Success');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while booking the appointment.');
      // Handle the error and provide user feedback if necessary
    }
  };
  
  // Function to check if the specialist already has appointments
  const checkExistingAppointments = async (spicalistId) => {
    try {
      const apiUrl = `http://10.0.2.2:3003/appoint/appointments/${spicalistId}`;
      const response = await axios.get(apiUrl);
  
    
      // Access the "data" property in the response
      const appointmentsData = response.data.data;
   

      return Array.isArray(appointmentsData) ? appointmentsData : [];
        // التحقق من نجاح الطلبين
       
    } catch (error) {
      console.error('Error fetching specialist appointments:', error);
      // Handle the error as needed
      return [];
    }
  };
  
  const image = {uri: 'https://www.alsbbora.info/UploadCache/libfiles/21/3/600x338o/748.jpg'};

  return (
    <>
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
 
   
    <View style={styles.userInfoSection}>
      <View style={{flexDirection: 'row', marginTop: 15}}>
        <Avatar.Image 
          source={{
            uri: values.spimage,
          }}
          size={120}
        />
     
      </View>
    </View>
    
    <View style={{paddingLeftLeft: 20,backgroundColor:'#95adc9',borderTopRightRadius: 50,borderTopLeftRadius: 50}}>
          <View></View>
            <Title style={[styles.title, {
              marginTop:10,
              marginBottom: 0,
              marginLeft:30,
            }]}> {values.firstname} {values.lastname}</Title>
            <View></View>
            <Caption style={styles.caption}>
            <Image
            source={require('../images/clinicicon.png')}
            style={styles.bottomIcon}
          /> {values.subjectofspecialization}</Caption>
             <Caption style={styles.caption1}>
            <Image
            source={require('../images/emailicon.png')}
            style={styles.bottomIcon}
          />  
        {valuese.email} 
          </Caption>
          </View></ImageBackground>
             <Text style={styles.heading}>Set Your Availability
    </Text> 
          <TouchableOpacity
        style={styles.bookButton}
        onPress={() => {
          // Handle booking with selected days and slots
          console.log('Selected Days:', selectedDays);
          console.log('Selected Slots:', selectedSlots);
          handleBookNow();
          // Add your booking logic here
        }}
      >
        <Text style={{ color: 'white' }}>Set Validate</Text>
      </TouchableOpacity>
  
  
<ScrollView style={{backgroundColor:'#95adc9',}} ><View style={styles.container}>
     
      <View style={styles.selectionContainer}>
        <Text style={styles.subheading}>Select Days:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {days.map((day) => (
            <TouchableOpacity
              key={day.id}
              style={{
                ...styles.selectionButton,
                backgroundColor: selectedDays.includes(day.id) ? 'blue' : 'white',
                marginRight: 10, // Add some margin between buttons
              }}
              onPress={() => toggleDaySelection(day.id)}
            >
              <Text style={{ color: selectedDays.includes(day.id) ? 'white' : 'blue' }}>{day.day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.selectionContainer1}>
        <Text style={styles.subheading}>Select Slots:</Text>
        {renderSelectionButtons(slots, selectedSlots, toggleSlotSelection)}
      </View>
    
    </View></ScrollView>
      
    <View style={styles.bottomView}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('spapptable');
          }}>
          <Image
            source={require('../images/logo.png')}
            style={styles.bottomIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Childapp');
          }}>
          <Image
            source={require('../images/pending.png')}
            style={styles.bottomIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}
        >
          <Image
            source={require('../images/logout1.png')}
            style={styles.bottomIcon}
          />
        </TouchableOpacity>
      </View>
  
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    marginLeft:50,
    marginBottom:60
    
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: -10,
    marginTop:10,
marginLeft:15,
},
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    margin : 10,
  },
  selectionContainer: {
    marginBottom: 20,
    marginLeft:-49,
  },
  selectionContainer1: {
    marginBottom: 20,
 
  },
  selectionButton: {
    width: 150,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  bookButton: {
    backgroundColor: '#2A2A72',
    padding: 10,
    width:142,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:230,
    marginBottom:10,
  },
  caption: {
    fontSize: 14,
    lineHeight: 56,
    fontWeight: '500',
    marginLeft:40,
    marginBottom:-15,
    marginTop:0,
   },
   caption1: {
    fontSize: 14,
    lineHeight: 56,
    fontWeight: '500',
    marginLeft:40,
    marginBottom:10,
    marginTop:0,
   },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#2A2A72',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
     marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  bottomView: {
    width: '90%',
    height: 60,
    borderRadius: 10,
    elevation: 5,
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#2A2A72',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',

  },
  bottomIcon: {
    width: 30,
    height: 30,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
  },
  image: {
    // flex:1,
    // justifyContent: 'center',
 
   
  },
});
