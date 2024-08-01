import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider } from '@rneui/themed'
import FacebookButton from '../components/FacebookButton'
import { createUserEmailPass, getRoles } from '../firebase'
import ReactNativeToggleElement from 'react-native-toggle-element'
import { useRoute } from '@react-navigation/native'
import Roles from './Roles'
import Modal from "react-native-modal";
import AnimatedLoader from "react-native-animated-loader";

const SignUpScreen = () => {

    const { params } = useRoute()
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [roles, setRoles] = useState(null)
    const [role, setRole] = useState(0)
    const [phone, setPhone] = useState('')
    const [toggleValue, setToggleValue] = useState(false)
    const [visible, setVisible] = useState(false)
    const handleToggleState = (value) => {
        setToggleValue(value)
    }

    const handleRoles = () => {
        getRoles().then((res) => {
            setRoles(res)
        })
    }
    useEffect(() => {
        handleRoles()
    }, [])
    const onAuth = () => {
        console.log("inned")
        params.onAuth()
    }

    const handleSignUp = () => {
        const data = {
            fname: fname,
            lname: lname,
            email: email,
            password: password,
            confirm: confirm,
            phone: phone,
            isplayer: role==='3',
            roleid: role
        }
        console.log(data)
        setVisible(true)
        createUserEmailPass(data, onAuth)
    }
    return (
        <View className='flex flex-col justify-evenly h-full p-4'>
            <View className='flex flex-col space-y-2'>
                <TextInput className="p-4 relative cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                    placeholder="First name"
                    defaultValue={fname}
                    onChangeText={text => setFname(text)} />
                <TextInput className="p-4 relative cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                    placeholder="Last name"
                    defaultValue={lname}
                    onChangeText={text => setLname(text)} />
                <TextInput className="p-4 relative cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                    placeholder="Email"
                    defaultValue={email}
                    onChangeText={text => setEmail(text)} />
                <TextInput className="p-4 relative cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                    placeholder="Password"
                    defaultValue={password}
                    onChangeText={text => setPassword(text)} />
                <TextInput className="p-4 relative cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                    placeholder="Confirm Password"
                    defaultValue={confirm}
                    onChangeText={text => setConfirm(text)} />
                {/* <TextInput className="p-4 relative cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                    placeholder="Phone number (+1)"
                    defaultValue={phone}
                    onChangeText={text => setPhone(text)} /> */}
            </View>
            {/* <View className='flex flex-row items-center justify-center space-x-4 p-4'>
                <Roles />
                <ReactNativeToggleElement
                    value={toggleValue}
                    onPress={(newState) => handleToggleState(newState)}
                    trackBarStyle={{
                        borderColor: toggleValue?  "rgba(3,99,235,1)":"black",
                    }}
                    trackBar={{
                        borderWidth: 1,
                        width: 40,
                        height: 20,
                        activeBackgroundColor: "#fff",
                        inActiveBackgroundColor: "#fff"
                    }}
                    thumbButton={{
                        width: 20,
                        height: 20,
                        activeBackgroundColor: "rgba(3,99,235,1)",
                        inActiveBackgroundColor: "gray"
                    }}
                />
                <Text className={`${toggleValue?  "text-blue-600":"text-black"} text-xs`}>{`Sign up as a player`.toUpperCase()}</Text>
            </View> */}
            <View className='mb-8 flex flex-row items-center justify-center'>
                <TouchableOpacity
                    disabled={
                        
                        fname === ''
                        || lname === ''
                        || email === ''
                        || password === ''
                        || confirm === ''
                    }
                    className={`${fname === ''
                    || lname === ''
                    || email === ''
                    || password === ''
                    || confirm === ''?'bg-gray-300 ':'bg-red-500'} py-4 px-8 rounded-full shadow-sm`}
                    onPress={() => {
                        setToggleValue(true)
                    }}>
                    <Text className=' text-white text-center font-medium'>Next</Text>
                </TouchableOpacity>
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
            {
                roles && <Modal isVisible={toggleValue}
                    onBackdropPress={() => setToggleValue(false)}>
                    <View className='bg-white rounded-lg p-8 flex justify-start flex-col space-y-8'>
                        <Text className='bg-white rounded-lg py-4 text-center font-medium'>Select your role and submit</Text>
                        <Roles roles={roles} setRole={setRole} role={role} />
                        <TouchableOpacity
                            disabled={
                                role===0
                            }
                            className={`${role===0?'bg-gray-300 ':'bg-red-500'} py-4 px-8 rounded-full shadow-sm`}
                            onPress={() => {
                                handleSignUp()
                            }}>
                            <Text className=' text-white text-center font-medium'>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            }
        </View>
    )
}

export default SignUpScreen