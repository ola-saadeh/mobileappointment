import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  View,
  Easing 
} from "react-native";

 
import { Animated } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import DateTimePicker from "@react-native-community/datetimepicker";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { ImageBackground } from "react-native";
const RegisterScreen = ( ) => {
  const navigation = useNavigation();
let ola =  "report.pdf"
  const [date, setDate] = useState(new Date());
  const [selectedGender, setSelectedGender] = useState(0);
  const [mode, setMode] = useState("date");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [text, setText] = useState("Empty");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    patientNumber: "",
    firstname: "",
    lastname: "",
    birthday: "",
    gender: "",
    phone: "",
    emergencyContact: "",
    country: "",
    address: "",
 
  });
  const [file, setFile] = useState();

  const pickDocument = async () => {
   
    // try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles]
      });
  
      console.log('res: ' + JSON.stringify(res));
  
      setFile(res);
      console.log(file)
      const formData1 = new FormData();
      formData1.append('file',   [{"fileCopyUri":null,"size":34087,"name":"child2.jpg","type":"image/jpeg","uri":"content://com.android.providers.media.documents/document/image%3A1000000034"}]);
      console.log(formData1._parts[0][1][0].uri);
  setFile( [{"fileCopyUri":null,"size":34087,"name":"child2.jpg","type":"image/jpeg","uri":"content://com.android.providers.media.documents/document/image%3A1000000034"}])
    //   axios.post(`http://10.0.2.2:3003/student/upload/`, formData1  )
    //     .then(response => {
    //       console.log(response.data);
    //     })
    //     .catch(error => {
    //       console.log('Error uploading file:', error);
    //       if (error.response) {
    //         // الطلب تم ولكن الخادم قام بإرجاع كود استجابة غير ناجح
    //         console.log('Response data:', error.response.data);
    //         console.log('Response status:', error.response.status);
    //         console.log('Response headers:', error.response.headers);
    //       } else if (error.request) {
    //         // الطلب تم، لكن لم يتم الرد
    //         console.log('No response received:', error.request);
    //       } else {
    //         // حدث خطأ أثناء إعداد الطلب
    //         console.log('Error setting up the request:', error.message);
    //       }
    //     });
    // } catch (err) {
    //   setFile(null);
    //   if (DocumentPicker.isCancel(err)) {
    //     alert('Canceled');
    //   } else {
    //     alert('Unknown Error: ' + JSON.stringify(err));
    //     console.error('Error in pickDocument:', err);
    //   }
    //}
  };
  

  
 
  const handleSignup = () => {
    // يمكنك إجراء أي عمل تحتاجه هنا، ثم إرسال الطلب
    axios
      .post("http://10.0.2.2:3003/student/create/", formData)
      .then((response) => {
       
         
          if (response.data === 'you are orady have account  ') {
            
              setreslt('you are orady have account  ')
          }
        // التعامل مع الاستجابة في حالة نجاح الطلب
        console.log(response.data);
        navigation.navigate('Successadd');

        // إذا كنت بحاجة إلى توجيه المستخدم إلى صفحة أخرى بعد التسجيل، يمكنك استخدام:
        // navigate("SuccessScreen"); حيث "SuccessScreen" هو اسم الشاشة التي تريد التوجيه إليها
      })
      .catch((error) => {
        // التعامل مع خطأ في حالة فشل الطلب
        console.error("An error occurred:", error);
      });
  };
  useEffect(() => {
    console.log(date);
  }, []);
   

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(selectedDate);
    // يمكنك إجراء أي عمل إضافي بناءً على التاريخ المحدد هنا
    const formattedDate = new Date(currentDate);
    const formattedDateString = formattedDate.toLocaleDateString();
    setFormData({ ...formData, birthday: date });
  };

  const showMode = (currentMode) => {
    setShowDatePicker(true);
    setMode(currentMode);
  };
 
  const [spinValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.rightSection}>
          {/* الجهة اليمنى */}<ImageBackground source={require("../images/ppp.png")} resizeMode="cover" style={{width:409, height:823,marginTop:-243}}>
          <View style={styles.imageContainer}>
         
          <Animated.View style={[styles.animatedLogo, { transform: [{ perspective: 500 }, { rotateY: spin }] }]}>
          {
<Image
        style={styles.image}
        source={require("../images/oa.png")}
        resizeMode="contain"
      />
            
          }
        </Animated.View>
          </View>
          </ImageBackground>
        </View>
        <View style={styles.leftSection}>
          {/* الجهة اليسرى */}
          <View style={styles.textInputContainer}>
            <Text
              style={{
                fontSize: FontSize.xLarge,
                color: Colors.primary,
                fontFamily: Font["poppins-bold"],
                marginTop:-230,
                marginBottom:30,
                textAlign: "center",
              }}
            >
              Account Registration
            </Text>
            <Text
              style={{
                fontFamily: Font["poppins-regular"],
                fontSize: FontSize.small,
                maxWidth: "80%",
                textAlign: "center",
                marginLeft:30,
              }}
            >
                  Register to submit a request to the Palestine Child Institute

            </Text>

           
            <TextInput
              placeholder="patientNumber"
              style={{
                marginVertical: Spacing,
                backgroundColor: Colors.gray,
              }}
              onChangeText={(patientNumber) =>
                setFormData({ ...formData, patientNumber })
              }
            />
            <TextInput
              placeholder="firstname"
              style={{
                marginVertical: Spacing,
                backgroundColor: Colors.gray,
              }}
              onChangeText={(firstname) =>
                setFormData({ ...formData, firstname })
              }
            />

            <TextInput
              placeholder="lastname"
              style={{
                marginVertical: Spacing,
                backgroundColor: Colors.gray,
              }}
              onChangeText={(lastname) => setFormData({ ...formData, lastname })}

            />

<Text style={styles.heading}>Select your birthdate</Text>

<TouchableOpacity
  style={[
    styles.genderView,
    {
      paddingTop: 9,
      height: Spacing * 4,
      marginVertical: Spacing,
      backgroundColor: Colors.gray,
    },
  ]}
  onPress={() => setShowDatePicker(true)}
>
  <Text>{date.toDateString()}</Text>
</TouchableOpacity>

{showDatePicker && (
  <DateTimePicker
    value={date}
    mode="date"
    display="default"
    textColor={Colors.primary}
    onChange={(event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShowDatePicker(false);
      setDate(selectedDate);
       const formattedDate = new Date(currentDate);
    
    
      setFormData({ ...formData, birthday: formattedDate });

    }}

  />
)}
             <TextInput
              placeholder="Email"
              style={{
                marginVertical: Spacing,
                backgroundColor: Colors.gray,
              }}
              onChangeText={(email) => setFormData({ ...formData, email })}

            />
            <TextInput
              placeholder="Password"
              style={{
                marginVertical: Spacing,
                backgroundColor: Colors.gray,
              }}
              onChangeText={(password) => setFormData({ ...formData, password })}
              secureTextEntry
            />
            <TextInput
              placeholder="Confirm Password"
              style={{
                marginVertical: Spacing,
                backgroundColor: Colors.gray,
              }}
              onChangeText={(confirmPassword) =>
                setFormData({ ...formData, confirmPassword })
              }
              secureTextEntry
            />
<Text style={styles.heading}>Select Gender</Text>
            <View style={styles.genderView}>
              <TouchableOpacity
                style={[
                  styles.gender,
                  {
                    borderWidth: 0.5,
                    borderColor: selectedGender == 0 ? "blue" : "black",
                  },
                ]}
                onPress={() => {
                  setSelectedGender(0);
                  setFormData({ ...formData, gender: "Male" });

                }}
              >
                <Image
                  source={require("../images/male.png")}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.gender,
                  {
                    borderWidth: 0.5,
                    borderColor: selectedGender == 1 ? "blue" : "black",
                  },
                ]}
                onPress={() => {
                  setSelectedGender(1);
                  setFormData({ ...formData, gender: "Female" });

                }}
              >
                <Image
                  source={require("../images/female.png")}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            </View>


            <TextInput
              placeholder="phone"
              style={{
                marginVertical: Spacing,
                backgroundColor: Colors.gray,
                marginTop: 30,
              }}
              onChangeText={(phone) =>
                setFormData({ ...formData, phone })
              }
            />
              <TextInput
              placeholder="emergencyContact"
              style={{
                marginVertical: Spacing,
                backgroundColor: Colors.gray,
              }}
              onChangeText={(emergencyContact) =>
                setFormData({ ...formData, emergencyContact })
              }
            />

            <TextInput
              placeholder="country"
              style={{
                marginVertical: Spacing,
                backgroundColor: Colors.gray,
              }}
              onChangeText={(country) =>
                setFormData({ ...formData, country })
              }
            />
            <TextInput
              placeholder="address"
              style={{
                marginVertical: Spacing,
                backgroundColor: Colors.gray,
              }}
              onChangeText={(address) =>
                setFormData({ ...formData, address })
              }
            />
             <TextInput
              placeholder="medicalHistroy"
              style={{
                marginVertical: Spacing,
                backgroundColor: Colors.gray,
              }}
              onChangeText={(medicalHistroy) =>
                setFormData({ ...formData, medicalHistroy })
              }
            />
             <TextInput
              placeholder="allergies"
              style={{
                marginVertical: Spacing,
                backgroundColor: Colors.gray,
              }}
              onChangeText={(allergies) =>
                setFormData({ ...formData, allergies })
              }
            />

   


           
            <TouchableOpacity
   
  onPress={pickDocument}
>
  <Text style={styles.buttonTex}>Pick Report</Text>
</TouchableOpacity>
<Text>Selected File: {ola}</Text>
           
         
             
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleSignup()            }}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>  navigation.navigate("Login")}
            style={styles.linkButton}
          >
            <Text style={styles.linkButtonText}>
              Already have an account
            </Text>
          </TouchableOpacity>
        </View>

     
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  leftSection: {
    flex: 1,
    padding: Spacing * 2,
  },
  rightSection: {
    flex: 1,
  },
  textInputContainer: {
    // ... تصميم حاوية حقول النصوص
  },
  heading: {
    color: Colors.primary,
    fontSize: 18,
    marginTop: 15,
    marginLeft: 15,
    fontFamily: Font["poppins-bold"],
  },
  genderView: {
    marginTop: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  gender: {
    borderRadius: 10,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: Spacing * 2,
    backgroundColor: Colors.primary,
    marginVertical: Spacing * 3,
    borderRadius: Spacing,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  buttonText: {
    fontFamily: Font["poppins-bold"],
    color: Colors.onPrimary,
    textAlign: "center",
    fontSize: FontSize.large,
  },
  buttonTex:  {
    fontFamily: Font["poppins-bold"],
    color: Colors.onPrimary,
    textAlign: "center",
    fontSize: FontSize.medium,
    width: 100, // عرض الزر
    backgroundColor: Colors.primary, // لون الخلفية
    borderRadius: 8, // حجم زوايا الزر
    paddingVertical: 12, // المسافة الرأسية داخل الزر
    paddingHorizontal: 20, // المسافة الأفقية داخل الزر
    elevation: 3, // رفعة الظل للزر
    marginTop: 10, // المسافة العلوية للزر
    // يمكنك إضافة المزيد من الخصائص حسب الحاجة
  },
  
  linkButton: {
    padding: Spacing,
  },
  linkButtonText: {
    fontFamily: Font["poppins-semiBold"],
    color: Colors.text,
    textAlign: "center",
    fontSize: FontSize.small,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop:-80,
  },
  image: {
    width: 150,
    height: 200,
    resizeMode: "contain",
    marginBottom:0,
  },
});

export default RegisterScreen;
