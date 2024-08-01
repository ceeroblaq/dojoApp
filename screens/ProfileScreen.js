import { View, Text, Image, Button, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import logo from '../assets/team_logo.png'
import SegmentHeader from '../components/SegmentHeader'
import { useNavigation } from '@react-navigation/native'
import ReactNativeToggleElement from 'react-native-toggle-element'
import PlayerScreen from './PlayerScreen'
import { deleteAccount, getComments, getUserInfo, getValidationRequests, logout, requestValidation, upgradeToPremium } from '../firebase'
import PlayerProfileData from '../components/PlayerProfileData'
import CommentList from '../components/CommentList'
import CommentInput from '../components/CommentInput'
import { ArrowRightOnRectangleIcon } from 'react-native-heroicons/solid'
import * as ImagePicker from 'expo-image-picker'
import { uploadImage } from '../firebase'
import PlayerDataUpdate from '../components/PlayerDataUpdate'
import Toast from 'react-native-toast-message';
import Webapp from './Webapp'

const ProfileScreen = ({ route }) => {
    const nav = useNavigation()
    const [toggleValue, setToggleValue] = useState(false);
    const [comments, setComments] = useState(null)
    const [image, setImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [subbing, setSubbing] = useState(null)
    const [validation, setValidation] = useState(0)

    const [user, setUser] = useState(null)
    const loadUser = () => {
        console.log('loading user', 'profilescreen')
        getUserInfo().then(async(res) => {
            setToggleValue(res.isplayer)
            setUser(res)

            const v = await getValidationRequests()
            console.log(v)
            const foundItem = v.find(obj => obj.uid === res.id);

            if (foundItem) {
                const key = foundItem.status;
                setValidation(key)
            } else {
                console.log("not found in the requests.")
            }
        })
        user && handleComments()
    }

    const handleComments = () => {
        const id = user.pid
        getComments(id).then((res) => setComments(res))
    }

    useEffect(() => {
        loadUser()
    }, [])

    const onAuth = () => {
        route.params.relay()
    }

    const showToast = (t1, t2) => {
        Toast.show({
            type: 'success',
            text1: t1,
            text2: t2
        })
    }
    const handleToggleState = (value) => {
        setToggleValue(value)
        //update DB
        user && handleComments()
    }

    const onRequest = () => {
        loadUser()
    }

    const handleValidation =async () => {
        const data = {
            message: 'Requesting Validation',
            player: user?.name,
            uname: user?.name,
            pemail: user?.email,
            uemail: user?.email,
            pid: user.pid,
            uid: user.id
        }
        await requestValidation(data, onRequest)
        loadUser()
    }

    const pickImage = async () => {
        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })

        console.log("SOURCE",res)
        const source = { uri: res.assets[0].uri }
        uploadImage(setUploading, source, user?.id, user?.pid)
        setImage(source)
        const t1 = 'Hi!'
        const t2 = 'Your photo was saved successfully'
        showToast(t1, t2)
        loadUser()
    }

    const handleDelete = () => {
        deleteAccount().then((res) => {
            if (res) {

                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'You account was deleted'
                })
                logout(onAuth)
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Recent login required',
                    text2: 'Logout and try again please'
                })
            }
        })
    }


    return (
        <>
            {
                subbing ? 
                <Webapp />
                    :
                    <View className='h-full pt-4'>
                        {/* page header */}
                        <View className='flex flex-row px-2 items-start justify-between'>

                            <TouchableOpacity onPress={pickImage}>
                                <Image className='w-24 h-24 object-contain rounded-full bg-slate-300' loading='lazy' source={image ? image : { uri: user?.photo }} />
                            </TouchableOpacity>
                            <View className='flex flex-1 flex-col p-4'>
                                <View className='flex flex-row px-2 items-center justify-between'>
                                    <View className='flex flex-1 flex-col'>
                                        <Text>{user?.name}</Text>
                                        {/* <Text>{user?.about}</Text> */}
                                    </View>
                                    <TouchableOpacity onPress={() => { logout(onAuth) }}>
                                        <ArrowRightOnRectangleIcon color={'rgba(0, 0, 0, 0.9)'} />
                                    </TouchableOpacity>
                                </View>
                                <View className='flex space-x-4  mx-4 flex-row'>
                                    <TouchableOpacity className='my-2 rounded border text-black px-4 py-2'
                                        onPress={() => { nav.navigate('Edit Profile', { user: user, loadUser: loadUser }) }}>
                                        <Text>Edit Profile</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity className='my-2 rounded border text-black px-4 py-2'
                                        onPress={() => { handleDelete() }}>
                                        <Text>Delete me</Text>
                                    </TouchableOpacity>
                                </View>
                                {user && user.isplayer && <View className='hidden flex-row items-center justify-between'>
                                    <Text className='text-xs'>{`${toggleValue ? 'Revert to user' : 'My player'} profile`}</Text>
                                    <ReactNativeToggleElement
                                        value={toggleValue}
                                        onPress={(newState) => handleToggleState(newState)}
                                        trackBarStyle={{
                                            borderColor: "black",
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
                                            activeBackgroundColor: "#000",
                                            inActiveBackgroundColor: "gray"
                                        }}
                                    />
                                </View>}
                            </View>
                        </View>
                        {
                            //    verification 
                            user && toggleValue &&

                            <View className='flex flex-col flex-1'>
                                {/* //    verification  */}
                                <View>
                                    <TouchableOpacity className={`mx-4 my-2 rounded px-4 py-2 ${validation === 0 ? 'bg-red-500' : validation === 1 ? 'bg-amber-400' : validation === 2 ? 'bg-green-400': 'bg-red-400'}`}
                                        onPress={() => { handleValidation() }}
                                        disabled={ [1,2].includes(validation)}>
                                        <Text className='text-center text-white'>{`${validation === 0 ? 'Request validation' : validation === 1 ? 'Validation in progress' : validation === 1 ? 'bg-amber-400' : validation === 2 ?  'Validated':'Validation Rejected'}`}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className=' mt-4 px-6 flex-1'>
                                    {comments && <CommentList data={comments} />}
                                </View>
                                <View className=' p-2'>
                                    <CommentInput
                                        user={user}
                                        id={user.pid}
                                        handleComments={handleComments}
                                    />
                                </View>
                            </View>
                        }


                        {/* {!toggleValue && <View>
            
                <View className=' hidden bg-white w-max flex-col rounded mx-2'>
                    <View className='flex flex-row justify-between p-2'>
                        <Text>Hometown</Text>
                        <Text>Milwaukee</Text>
                    </View>
                    <View className='flex flex-row justify-between p-2'>
                        <Text>Hometown</Text>
                        <Text>Milwaukee</Text>
                    </View>
                    <View className='flex flex-row justify-between p-2'>
                        <Text>Hometown</Text>
                        <Text>Milwaukee</Text>
                    </View>
                </View>
                
                <SegmentHeader title={'Notifications'} />
                <View className='p-4 rounded bg-white m-2'>
                    <Text>{`Confirm your phone number: ${user?.phone}`}</Text>
                </View>

            </View>} */}



                        <Toast />
                    </View>
            }

        </>
    )
}

export default ProfileScreen