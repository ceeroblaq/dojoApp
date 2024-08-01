import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Divider } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { authenticateUserEmailPass, facebookSignIn } from '../firebase';
import FacebookButton from '../components/FacebookButton';
import AnimatedLoader from "react-native-animated-loader";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const LoginScreen = ({ route }) => {
    const navigation = useNavigation()

    const [visible, setVisible] = useState(false)
    // useEffect(() => {
    //     setInterval(() => {
    //       setVisible(!visible);
    //     }, 2000);
    //   }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    const [email, setEmail] = useState('')//cyrileugene3@gmail.com
    const [password, setPassword] = useState('')//m$QSJ6aUGpd$fYF
    
    const onAuth = (user) => { 
        setVisible(false)
        if(user){
            route.params.handleAuth() 
        }
    }

    const handleLogin = () => {
        setVisible(true)
        authenticateUserEmailPass(email, password, onAuth)
    }
    const handleSignUp = () => {
        navigation.navigate('Sign up', { onAuth: onAuth })
    }

    return (
        <View className='flex flex-col h-full'>
            <View className='p-4 flex-1 flex flex-col justify-center items-center'>
                <View className='flex flex-col space-y-2 w-full'>
                    <Text className=' text-center font-semibold text-4xl '>Login</Text>
                    <TextInput className="p-4 relative cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                        placeholder="Email"
                        value={email}
                        inputMode='email'
                        keyboardType='email-address'
                        onChangeText={text => setEmail(text)}
                    />
                    <TextInput className="p-4 relative  cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        autoCorrect={false}
                        onChangeText={text => setPassword(text)} />
                </View>
                <View className='flex flex-row space-x-6 my-8 w-1/2'>
                    <TouchableOpacity
                        className='bg-red-500 py-4  flex-1 rounded-full shadow-sm '
                        onPress={() => {
                            handleLogin()
                        }}>
                        <Text className='text-white text-center font-medium'>Login</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        className='bg-white py-4 flex-1 rounded-full shadow-sm'
                        onPress={() => {

                        }}>
                        <Text className='text-black text-center font-medium'>Forgot password?</Text>
                    </TouchableOpacity> */}
                </View>
                <AnimatedLoader
                    visible={visible}
                    overlayColor="rgba(255,255,255,0.75)"
                    source={require("../assets/lottie.json")}
                    animationStyle={{
                        width: 100,
                        height: 100
                      }}
                    speed={1}
                    >
                    <Text>Loading...</Text>
                </AnimatedLoader>

                <FacebookButton />
            </View>
            <TouchableOpacity
                className='py-4 px-2 flex flex-row justify-center space-x-1'
                onPress={() => {
                    handleSignUp()
                }}>
                <Text className=' text-gray-400 text-center font-medium'>
                    No account?
                </Text>
                <Text className='text-black text-center font-medium'>
                    Sign up
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen