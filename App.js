import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedHomeScreen from './screens/FeedHomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DojoScreen from './screens/DojoScreen';
import { FireIcon as FireIcon, StopCircleIcon as StopCircleIcon, UserCircleIcon as UserCircleIcon} from 'react-native-heroicons/outline';
import { FireIcon as FireIconSolid, StopCircleIcon as StopCircleIconSolid, UserCircleIcon as UserCircleIconSolid} from 'react-native-heroicons/solid';
import AccountScreen from './screens/AccountScreen';
import { auth } from './firebase';
import { useEffect, useState } from 'react';
import AuthScreen from './screens/AuthScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const Tab = createBottomTabNavigator()

export default function App() {
  const [user, setUser] = useState(null)

  const handleAuth = () => {
    setUser(auth.currentUser)
    console.log("User Auth", auth.currentUser?"signed in":"signed out")
  }
  
  onAuthStateChanged(auth, (user)=>{
    // handleAuth()
    if(user){
      setUser(user)
    }
  })
  
  useEffect(()=>{
    handleAuth()
  }, [auth])

  return (
    <>
    <StatusBar style="auto" translucent={false} />
    <NavigationContainer>
   { user ?
    <Tab.Navigator 
      screenOptions={({route})=>({
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor:'gray',
        tabBarIcon: ({focused, color, size})=> {
          let icon;
          if(route.name === 'Feed'){
            icon = focused?  <FireIconSolid color={color}/>  :<FireIcon color={color}/>
          }else if(route.name === 'Dojo'){
            icon = focused ? <StopCircleIconSolid color={color}/> :<StopCircleIcon color={color}/>
          }else if(route.name === 'Account'){
            icon = focused ? <UserCircleIconSolid color={color}/> :<UserCircleIcon color={color}/>
          }
          return(
            <>{icon}</>
          )
        }
      })}>

      <Tab.Screen name="Feed" component={FeedHomeScreen} />
      <Tab.Screen name="Dojo" component={DojoScreen} />
      <Tab.Screen name="Account" component={AccountScreen}  initialParams={{ handleAuth: handleAuth }} />
    </Tab.Navigator>
    :
    <AuthScreen handleAuth={handleAuth}/>
    }

    </NavigationContainer>
    </>
  );
}


