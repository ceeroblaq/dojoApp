import { View, Text, TextInput, Button, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { checkSubscriptionStatus, getSports, getStats, updatePlayerInfo } from '../firebase'
import Toast from 'react-native-toast-message';
import PlayerDataUpdate from '../components/PlayerDataUpdate'

const EditProfileScreen = () => {
    const { params: {
        user, loadUser
    } } = useRoute()

    const [fname, setFname] = useState(user?.fname)
    const [lname, setLname] = useState(user?.lname)
    const [career, setCareer] = useState(user?.career)
    const [country, setCountry] = useState(user?.country)
    const [phone, setPhone] = useState(user?.phone)
    const [dob, setDOB] = useState(user?.dob)
    const [pos, setPos] = useState(user?.position)
    const [home, setHome] = useState(user?.hometown)
    const [college, setCollege] = useState(user?.college)
    const [hs, setHS] = useState(user?.highschool)
    const [xperience, setExperience] = useState(user?.experience)
    const [about, setAbout] = useState(user?.about)

    const showToast = (t1, t2) => {
        Toast.show({
            type: 'success',
            text1: t1,
            text2: t2
        });
    }


    const handleChange = (i, value) => {
        // console.log(i, value)
        switch (i) {
            case 0:
                setFname(value)
                break;
            case 1:
                setLname(value)
                break;
            case 2:
                setPhone(value)
                break;
            case 3:
                setDOB(value)
                break;
            case 4:
                setPos(value)
                break;
            case 5:
                setHome(value)
                break;
            case 6:
                setCollege(value)
                break;
            case 7:
                setHS(value)
                break;
            case 8:
                setExperience(value)
                break;
            case 9:
                setAbout(value)
                break;

            case 10:
                setCountry(value)
                break;

            case 11:
                setCareer(value)
                break;

            default:
                break;
        }
    }

    const handleSave = () => {
        const data = {
            uid: user?.id,
            fname: fname ?? '',
            lname: lname ?? '',
            phone: phone ?? '',
            dob: dob ?? '',
            position: pos ?? '',
            hometown: home ?? '',
            college: college ?? '',
            highschool: hs ?? '',
            experience: xperience ?? '',
            about: about ?? '',
            country: country ?? '',
            career: career ?? '',
        }

        updatePlayerInfo(user?.pid, data).then(() => {
            loadUser()
            console.log('new data', data)
            const t1 = 'Hi!'
            const t2 = 'Your info was saved successfully'
            showToast(t1, t2)
        })
    }
    

    return (
        <View className='flex fles-col px-4 bg-slate-200 justify-between h-full'>
            <ScrollView className='flex-1'>

                <View className=''>
                    <PlayerDataUpdate user={user} showToast={showToast} loadUser={loadUser} />
                </View>

                <Text className='mt-4 mb-1 px-2 font-semibold'>Your info</Text>
                <TextInput defaultValue={fname}
                    onChangeText={(e) => handleChange(0, e)}
                    className='my-1 bg-white p-2 border border-gray-200 rounded'
                    placeholder="First Name"
                />
                <TextInput defaultValue={lname}
                    onChangeText={(e) => handleChange(1, e)}
                    className='my-1 bg-white p-2 border border-gray-200 rounded'
                    placeholder="Last Name"
                />
                <TextInput defaultValue={phone}
                    onChangeText={(e) => handleChange(2, e)}
                    className='my-1 bg-white p-2 border border-gray-200 rounded'
                    placeholder="Phone"
                />
                <TextInput defaultValue={country}
                    onChangeText={(e) => handleChange(10, e)}
                    className='my-1 bg-white p-2 border border-gray-200 rounded'
                    placeholder="Country"
                />
                <TextInput defaultValue={career}
                    onChangeText={(e) => handleChange(11, e)}
                    className='my-1 bg-white p-2 border border-gray-200 rounded'
                    placeholder="Career start year"
                />
                <TextInput defaultValue={dob}
                    onChangeText={(e) => handleChange(3, e)}
                    className='my-1 bg-white p-2 border border-gray-200 rounded'
                    placeholder="D.O.B."
                />
                <TextInput defaultValue={pos}
                    onChangeText={(e) => handleChange(4, e)}
                    className='my-1 bg-white p-2 border border-gray-200 rounded'
                    placeholder="Position"
                />
                <TextInput defaultValue={home}
                    onChangeText={(e) => handleChange(5, e)}
                    className='my-1 bg-white p-2 border border-gray-200 rounded'
                    placeholder="Hometown"
                />
                <TextInput defaultValue={college}
                    onChangeText={(e) => handleChange(6, e)}
                    className='my-1 bg-white p-2 border border-gray-200 rounded'
                    placeholder="College"
                />
                <TextInput defaultValue={hs}
                    onChangeText={(e) => handleChange(7, e)}
                    className='my-1 bg-white p-2 border border-gray-200 rounded'
                    placeholder="High School"
                />
                <TextInput defaultValue={xperience}
                    onChangeText={(e) => handleChange(8, e)}
                    className='my-1 bg-white p-2 border border-gray-200 rounded'
                    placeholder="Experience Level"
                />

                <TextInput defaultValue={about}
                    onChangeText={(e) => handleChange(9, e)} className='my-1 bg-white p-2 border border-gray-200 rounded' placeholder="About Me"
                    editable
                    multiline
                    numberOfLines={4}
                // numberOfLines={4} 
                />
                <TouchableOpacity onPress={handleSave}
                    className='m-4 rounded-3xl bg-slate-400 flex flex-col items-center p-4'>
                    <Text className='text-white'>Save</Text>
                </TouchableOpacity>
            </ScrollView>
            <Toast />
        </View>
    )
}

export default EditProfileScreen