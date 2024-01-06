import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from './screens/Splash';
import Home from './screens/Home';
import Homesp from './screens/Homesp';
import start from './screens/start'
import BookAppointment from './screens/BookAppointment';
import Success from './screens/Success';
import Pending from './screens/Pending';
import Completed from './screens/Completed';
import CallAmb from './screens/CallAmb';
import Successadd from './screens/Successadd';
import Login from './screens/Login';
import error from './screens/error';
import RegisterScreen from './screens/RegisterScreen';
import test from './screens/test';
import spapptable from './screens/spapptable';
import Successdelete from './screens/successdelete';
import Childapp from './screens/Childapp';
import ForgotPassword from './screens/ForgetPassword';
import ResetPasswordConfirmation from './screens/ResetPasswordConfirmation'
const Stack = createStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={Splash}
          name="Splash"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={start}
          name="start"
          options={{headerShown: false}}
        />
          <Stack.Screen
          component={ForgotPassword}
          name="ForgetPassword"
          options={{headerShown: false}}
          />
          <Stack.Screen
          component={ResetPasswordConfirmation}
          name="ResetPasswordConfirmation"
          options={{headerShown: false}}
        />
          <Stack.Screen
          component={Childapp}
          name="Childapp"
          options={{headerShown: false}}
        />
         <Stack.Screen
          component={Successdelete}
          name="Successdelete"
          options={{headerShown: false}}
        />
         <Stack.Screen
          component={spapptable}
          name="spapptable"
          options={{headerShown: false}}
        />
         <Stack.Screen
          component={error}
          name="error"
          options={{headerShown: false}}
        />
         <Stack.Screen
          component={test}
          name="test"
          options={{headerShown: false}}
        />
         <Stack.Screen
          component={Homesp}
          name="Homesp"
          options={{headerShown: false}}
        />
         <Stack.Screen
          component={RegisterScreen}
          name="RegisterScreen"
          options={{headerShown: false}}
        />
         <Stack.Screen
          component={Login}
          name="Login"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={Home}
          name="Home"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={BookAppointment}
          name="BookAppointment"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={Success}
          name="Success"
          options={{headerShown: false}}
        />
         <Stack.Screen
          component={Successadd}
          name="Successadd"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={Pending}
          name="Pending"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={Completed}
          name="Completed"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={CallAmb}
          name="CallAmb"
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
