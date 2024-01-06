import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ImageBackground } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import "core-js/stable/atob";
import { jwtDecode } from 'jwt-decode';
import imgPlaceHolder from '../images/doctor.png'

import axios from 'axios';
import Header from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import CommonBtn from '../components/CommonBtn';
import ImagePicker, { openPicker } from 'react-native-image-crop-picker';
import { secondsInDay } from 'date-fns';

const Home = ({ navigation }) => {
  const [profile, setProfile] = useState(null)
  const [values, setValues] = React.useState([]);

  let studentId ;
  const imagePick = () => {
    ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true
    }).then(image => {
        console.log(image);
        setProfile(image.path)
    });
}
  const [specialists, setSpecialists] = useState([]);
  const [courses, setCourses] = useState([]);
const [username,setUsername] =useState('');
  useEffect(() => {
    const getTokenAndDecode = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token:', token);

        if (token) {
          const decoded = jwtDecode(token);
          console.log('Decoded Token:', decoded);
         studentId = decoded.studentId;
          console.log(studentId);
          const fetchuser = async () => {
            const Response = await axios.get(`http://10.0.2.2:3003/student/${decoded.studentId}`);
            const userData = Response.data;
            
            setValues(userData);
            console.log(userData)
          };
          fetchuser();
          await fetchSpecialists(studentId, false);
          await fetchCourses(studentId);
        } else {
          console.log('Token not found');
        }
      } catch (error) {
        console.error('Error:', error.stack);
      }
    };

  

    const fetchCourses = async (studentId) => {
      const coursesResponse = await axios.get(`http://10.0.2.2:3003/Courses/${studentId}`);
      const coursesData = coursesResponse.data;
      setCourses(coursesData);
    };

    getTokenAndDecode();
  }, []);

 
  const renderCourseItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => fetchSpecialists(item._id , true)}>
    
      <LinearGradient colors={['#009FFD', '#2A2A72']} style={styles.linearGradient}>
        <Text style={styles.catName}>
          {item.Name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
  const fetchSpecialists = async (studentId ,isClinic) => {
    let specialistsData;
    if (isClinic) {
      // جلب الأخصائيين التابعين للعيادة
      const clinicSpecialistsResponse = await axios.get(`http://10.0.2.2:3003/studentspicalistion/clinic/${studentId}`);
      specialistsData = clinicSpecialistsResponse.data;
    } else {
      // جلب الأخصائيين الخاصين بالطالب
      const studentSpecialistsResponse =  await axios.get(`http://10.0.2.2:3003/studentspicalistion/${studentId}`);
      specialistsData = studentSpecialistsResponse.data;
    }      


    const specialistPromises = specialistsData.map(specialist =>
      axios.get(`http://10.0.2.2:3003/Spicalistion/${specialist.spicalistId}`)
    );

    const specialistDetails = await Promise.all(specialistPromises);

    const updatedSpecialistsData = specialistsData.map((specialist, index) => ({
      ...specialist,
      additionalDetails: specialistDetails[index].data,
    }));

    setSpecialists(updatedSpecialistsData);
  };

  const renderSpecialistItem = ({ item, index }) => (
    <View style={{  backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0.2,margin:10,width:170,alignSelf: specialists.length === 1 ? 'center' : 'flex-start' }
  }>
      <Image
      source={item.additionalDetails?.spimage ? { uri: `${item.additionalDetails?.spimage}` } : imgPlaceHolder}  
           
       // source={{ uri: `../images/${item.additionalDetails?.spimage}` }}
        style={styles.docImg}
      />
      <Text style={styles.docName}>
        {item.additionalDetails?.firstname} {item.additionalDetails?.lastname}
      </Text>
      <Text style={styles.docSpl}>
        {item.additionalDetails?.subjectofspecialization}
      </Text>
      <Text  
        style={[
          styles.status,
          {
            color: item.additionalDetails?.isAvailable ? 'green' : 'red',
            opacity: item.additionalDetails?.isAvailable ? 1 : 0.5,
            marginTop: 5,
          },
        ]}
      >
        {item.additionalDetails?.isAvailable ? 'Available' : 'Busy'}
      </Text>
      <CommonBtn
        w={150}
        h={40}
        status={item.additionalDetails?.isAvailable}
        txt={'Book Appointment'}
        onClick={() => {
          if (item.additionalDetails?.isAvailable) {
            const specialistName = `${item.additionalDetails?.firstname} ${item.additionalDetails?.lastname}`;

            navigation.navigate('BookAppointment', {
             
              SpecialistId : item.additionalDetails?._id,
              SpecialistName: specialistName ,
              studentId  :studentId ,
              clinicImage: item.additionalDetails?.spimage,
              clinicName: item.additionalDetails?.subjectofspecialization,
            });
          }
        }}
      />
    </View>
  );
  const image = {uri: 'https://www.alsbbora.info/UploadCache/libfiles/21/3/600x338o/748.jpg'};

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <Header title={'Appointment'} icon={require('../images/logo.png')} />
          <View></View>
          <ImageBackground  resizeMode="cover" style={styles.image}>  
          <Text style={styles.docSpl1}>Hello, {values.firstname} {values.lastname} book your next appointment</Text>
           <View style={{ marginBottom: 20,marginTop: 20 }}>
            
            <FlatList
              data={courses}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderCourseItem}
            />
          </View>
       </ImageBackground>

        
          <Image
            source={require('../images/pic1.jpg')}
            style={styles.banner}
            resizeMode="contain"
          />
          <Text style={styles.heading}>Specialists</Text>
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <FlatList
              numColumns={2}    
              data={specialists}
              renderItem={renderSpecialistItem}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomView}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Completed');
          }}
        >
          <Image
            source={require('../images/logo.png')}
            style={styles.bottomIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login',{studentId  :studentId });
          }}
        >
          <Image
            source={require('../images/logout.png')}
            style={styles.bottomIcon}
          />
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  image:{
    height:180,
    backgroundColor: 'rgba(24, 73, 220, 0.10)',

   borderRadius:23,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'center',
    marginTop: 10,
  },
  heading: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
    marginLeft: 15,
  },
  linearGradient: {
    width: 120,
    height: 80,
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  docItem: {
    width: '75%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0.2,
    margin: 10,    
  },
  docImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 20,
  },
  docImg1: {
    width: 130,
    height: 130,
    borderRadius: 60,
   marginLeft:40,
    marginTop: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#36419A', 
  },
  docName: {
    fontSize: 18,
    fontWeight: '700',
    alignSelf: 'center',
    marginTop: 10,
  },
  docSpl: {
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
  docSpl1: {
    fontSize: 14,
    marginTop: 5,
   
    fontWeight: '600',
    alignSelf: 'center',
    color: '#000',
    padding: 5,
    borderRadius: 10,
   },
  status: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: '600',
    alignSelf: 'center',
  },
  bottomView: {
    width: '90%',
    height: 60,
    borderRadius: 10,
    elevation: 5,
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#fff',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  bottomIcon: {
    width: 30,
    height: 30,
  },
    header: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 5,
    alignItems: 'center',
    paddingLeft: 20,
  },
  back: {
    width: 24,
    height: 24,
  },
  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  title: {  
    fontSize: 18,
    fontWeight: '600',
  },
});







