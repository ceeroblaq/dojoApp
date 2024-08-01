import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react'
import { checkSubscriptionStatus, getSports, getStatSports, getStats, savePlayerStat, upgradeToPremium, uploadHeroImage } from '../firebase'
import { SelectList } from 'react-native-dropdown-select-list'

const PlayerDataUpdate = ({ user, showToast, loadUser }) => {

    const [image, setImage] = useState(null)
    const [paid, setPaid] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [group, setGroupSelected] = useState(null);
    const [stat, setStatSelected] = useState("");
    const [statval, setStatVal] = useState("");
    const [sports, setSports] = useState(null);
    const [statsports, setStatSports] = useState(null);
    const [data, setGroupData] = useState(null);

    const pickImage = async () => {
        let res = (await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })).assets[0]

        if (res.uri) {
            const source = { uri: res.uri }
            console.log(source)
            setImage(source)
            uploadHeroImage(setUploading, source, user?.id, user?.pid)
            onSaveImage()
        } else {
            console.log('no response')
        }
    }

    const onSaveImage = () => {
        const t1 = 'Hi!'
        const t2 = 'Hero image saved successfully'
        showToast(t1, t2)
        loadUser()
    }

    const onSave = () => {
        const t1 = 'Hi!'
        const t2 = 'Stat was saved successfully'
        showToast(t1, t2)
    }

    const handleStatChange = () => {
        const data = {
            pid: user.pid,
            sportid: group.id,
            sport: group.name,
            stat: stat,
            value: statval
        }
        savePlayerStat(data, onSave)
    }
    const handleStats = (sid) => {
        setGroupData(null)
        getStats(sid).then((data) => {
            setGroupData(data ?? [])
        })
    }

    const handleSubscription = async () => {
        const data = await upgradeToPremium()
        console.log("stripe", data)
        Linking.openURL(data);

    }

    const loadSubData = async () => {
        const paid = await checkSubscriptionStatus(user?.id)
        setPaid(paid)
    }


    useEffect(() => {
        getStatSports().then((data) => {
            setStatSports(data)
        })
        getSports().then((data) => {
            setSports(data)
        })
        loadSubData()
    }, [])

    return (
        <View>
            <Text className='mt-4 mb-1 px-2 font-semibold'>Hero Image</Text>
            <TouchableOpacity onPress={pickImage}
                className='w-full h-44 rounded-3xl'>
                <Image className='object-contain bg-slate-100 w-full h-full' loading='lazy' source={image ? image : { uri: user?.hero }} />
            </TouchableOpacity>
            <Text className='mt-4 mb-1 px-2 font-semibold'>{paid?'Your stats':'Enable Stat Tracking with a Subscription'}</Text>
            {paid ?
                <View className='flex flex-col'>

                    <View className='m-1'>
                        {sports && <SelectList
                            setSelected={(val) => {
                                const s = sports.find((s) => s.name === val)
                                setGroupSelected(s)
                                setStatSelected(null)
                                handleStats(s.id)
                            }}
                            data={statsports}
                            save="value"
                            placeholder='Set Sport'
                        />
                        }
                    </View>
                    <View className='m-1'>
                        {data && data?.length > 0 && <SelectList
                            setSelected={(val) => {
                                setStatSelected(val)
                                setStatVal('')
                            }}
                            data={data}
                            save="value"
                            placeholder={`Select Stat to update`}
                        />}
                    </View>

                    {data && stat !== "" && <TextInput
                        onChangeText={(tx) => setStatVal(tx)}
                        keyboardType='numeric'
                        className='my-1 mx-2 bg-white py-4  px-2 border border-gray-200 rounded-xl'
                        placeholder=" Stat value"
                    />}
                    {data && data.length > 0 && <TouchableOpacity
                        disabled={!(statval !== "" && stat !== "" && group !== "")}
                        onPress={handleStatChange}
                        className='m-4 rounded-3xl bg-slate-400 flex flex-col items-center p-4'>
                        <Text className='text-white'>Save Stat</Text>
                    </TouchableOpacity>}
                </View> :
                < View >
                    <TouchableOpacity className={`mx-4 my-2 rounded px-4 py-2 bg-green-400`}
                        onPress={() => { handleSubscription() }}
                        disabled={false}>
                        <Text className='text-center text-white'>{`${'Subscribe'}`}</Text>
                    </TouchableOpacity>
                </View>
            }
        </View >
    )
}

export default PlayerDataUpdate