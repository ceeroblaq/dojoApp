import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from "react-native-modal";
import { getPlayers } from '../firebase';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import PlayersList from '../components/PlayersList';
import { ShareIcon } from 'react-native-heroicons/solid';

const CompareScreen = () => {

    const [selection, setSelection] = useState(0)
    const [players, setPlayers] = useState(null)
    const [p1, setOne] = useState(null)
    const [p2, setTwo] = useState(null)
    const [isVisible, setIsVisible] = useState(false)
    const [html, setHTML] = useState('')
   

    const statgroups = [
        {
            key: '1', value: 'Points', data:
                [
                    { key: '1', value: 'Games Played (GP)' },
                    { key: '2', value: 'Minutes Per Game (MPG)' },
                    { key: '3', value: 'Points Per Game (PTS)' },
                    { key: '4', value: 'Field Goals Made (FGM)' },
                    { key: '5', value: 'Field Goals Attempted (FGA)' },
                    { key: '6', value: 'Field Goal Percentage (FG%)' },
                    { key: '7', value: '3-Point Field Goals Made (3PM)' },
                    { key: '8', value: '3-Point Field Goals Attempted (3PA)' },
                    { key: '9', value: '3-Point Percentage (3P%)' },
                    { key: '10', value: 'Free Throws Made (FTM)' },
                    { key: '11', value: 'Free Throws Attempted (FTA)' },
                    { key: '12', value: 'Free Throw Percentage (FT%)' }
                ]
        },
        {
            key: '2', value: 'Rebounds', data: [
                { key: '1', value: 'Games Played (GP)' },
                { key: '2', value: 'Minutes Per Game (MPG)' },
                { key: '3', value: 'Offensive Rebounds (OFF)' },
                { key: '4', value: 'Offensive Rebounds Per Game (ORPG)' },
                { key: '5', value: 'Defensive Rebounds (DEF)' },
                { key: '6', value: 'Defensive Rebounds Per Game (DRPG)' },
                { key: '7', value: 'Rebounds (REB)' },
                { key: '8', value: 'Rebounds Per Game (RPG)' },
                { key: '9', value: 'Rebounds Per 40 Minutes (RP40)' }
            ]
        },
        {
            key: '3', value: 'Field Goals', data: [
                { key: '1', value: 'Games Played (GP)' },
                { key: '2', value: 'Minutes Per Game (MPG)' },
                { key: '3', value: 'Points Per Game (PPG)' },
                { key: '4', value: 'Field Goals Made (FGM)' },
                { key: '5', value: 'Field Goals Attempted (FGA)' },
                { key: '6', value: 'Field Goals Made (FGM)' },
                { key: '7', value: 'Field Goals Attempted (FGA)' },
                { key: '8', value: 'Field Goal Percentage (FG%)' },
                { key: '9', value: '2-Point Field Goals Made (2PM)' },
                { key: '10', value: '2-Point Field Goals Attempted (2PA)' },
                { key: '11', value: '2-Point Percentage (2P%)' },
                { key: '12', value: 'Points Per Shot (PPS)' },
                { key: '13', value: 'Adjusted Field Goal Percentage (FG%)' }
            ]
        },
        {
            key: '4', value: 'Free-Throws', data: [
                { key: '1', value: 'Games Played (GP)' },
                { key: '2', value: 'Minutes Per Game (MPG)' },
                { key: '3', value: 'Points Per Game (PPG)' },
                { key: '4', value: 'Free-Throws Made (FTM)' },
                { key: '5', value: 'Free Throws Attempted (FTA)' },
                { key: '6', value: 'Free-Throws Made (FTM)' },
                { key: '7', value: 'Free-Throws Attempted (FTA)' },
                { key: '8', value: 'Free-Throw Percentage (FT%)' }
            ]
        },
        {
            key: '5', value: '3-Points', data: [
                { key: '1', value: 'Games Played (GP)' },
                { key: '2', value: 'Points Per Game (PPG)' },
                { key: '3', value: '3-Point Field Goals Made Per Game (3PM)' },
                { key: '4', value: '3-Point Field Goals Attempted Per Game (3PA)' },
                { key: '5', value: 'Total 3-Point Field Goals Made (3PM)' },
                { key: '6', value: 'Total 3-Point Field Goals Attempted (3PA)' },
                { key: '7', value: 'Total 3-Point Field Goal Percentage (3P%)' },
                { key: '8', value: '2-Point Field Goals Made (2PM)' },
                { key: '9', value: '2-Point Field Goals Attempted (2PA)' },
                { key: '10', value: '2-Point Field Goal Percentage (2P%)' },
                { key: '11', value: 'Points Per Shot (PPS)' },
                { key: '12', value: 'Adjusted Field Goal Percentage (FG%)' }
            ]
        },
        {
            key: '6', value: 'Assists', data: [
                { key: '1', value: 'Games Played (GP)' },
                { key: '2', value: 'Minutes Per Game (MPG)' },
                { key: '3', value: 'Assists (AST)' },
                { key: '4', value: 'Assists Per Game (APG)' },
                { key: '5', value: 'Turnovers (TO)' },
                { key: '6', value: 'Turnovers Per Game (TOPG)' },
                { key: '7', value: 'Assists Per 40 Minutes (AP40M)' },
                { key: '8', value: 'Assists Per Turnover (AST/TO)' }
            ]
        },
        {
            key: '7', value: 'Steals', data: [
                { key: '1', value: 'Games Played (GP)' },
                { key: '2', value: 'Minutes Per Game (MPG)' },
                { key: '3', value: 'Steals (STL)' },
                { key: '4', value: 'Steals Per Game (STPG)' },
                { key: '5', value: 'Steals Per 40 Minutes (STP40M)' },
                { key: '6', value: 'Turnovers (TO)' },
                { key: '7', value: 'Turnovers Per Game (TOPG)' },
                { key: '8', value: 'Personal Fouls (PF)' },
                { key: '9', value: 'Steals Per Turnover (ST/TO)' },
                { key: '10', value: 'Steals Per Personal Foul (ST/PF)' }
            ]
        },
        {
            key: '8', value: 'Blocks', data: [
                { key: '1', value: 'Games Played (GP)' },
                { key: '2', value: 'Minutes Per Game (MPG)' },
                { key: '3', value: 'Blocks (BLK)' },
                { key: '4', value: 'Personal Fouls (PF)' },
                { key: '5', value: 'Blocks Per Game (BLKPG)' },
                { key: '6', value: 'Blocks Per 40 Minutes (BLK40M)' },
                { key: '7', value: 'Blocks Per Personal Foul (BLK/PF)' }
            ]
        },
        {
            key: '9', value: 'Fouls', data: [
                { key: '1', value: 'Games Played (GP)' },
                { key: '2', value: 'Minutes Per Game (MPG)' },
                { key: '3', value: 'Personal Fouls (PF)' },
                { key: '4', value: 'Personal Fouls Per Game (PFPG)' },
                { key: '5', value: 'Personal Fouls Per 40 Minutes (PF40M)' },
                { key: '6', value: 'Flagrant Fouls (FLAG)' },
                { key: '7', value: 'Technical Fouls (TECH)' },
                { key: '8', value: 'Ejections (EJECT)' }
            ]
        },
        {
            key: '10', value: 'Minutes', data: [
                { key: '1', value: 'Games Played (GP)' },
                { key: '2', value: 'Minutes (MIN)' },
                { key: '3', value: 'Minutes Per Game (MPG)' }
            ]
        },
        {
            key: '11', value: 'Turnovers', data: [
                { key: '1', value: 'Games Played (GP)' },
                { key: '2', value: 'Minutes Per Game (MPG)' },
                { key: '3', value: 'Turnovers (TO)' },
                { key: '4', value: 'Turnovers Per Game (TOPG)' },
                { key: '5', value: 'Turnovers Per 40 Minutes (TO40)' },
                { key: '6', value: 'Assist Per Turnover (AST/TO)' },
                { key: '7', value: 'Steal Per Turnover (STL/TO)' }
            ]
        },
        {
            key: '12', value: 'Double Doubles', data: [
                { key: '1', value: 'Games Played (GP)' },
                { key: '2', value: 'Minutes Per Game (MPG)' },
                { key: '3', value: 'Points Per Game (PPG)' },
                { key: '4', value: 'Rebounds Per Game (RPG)' },
                { key: '5', value: 'Assists Per Game (APG)' },
                { key: '6', value: 'Steals Per Game (STPG)' },
                { key: '7', value: 'Blocks Per Game (BLKPG)' },
                { key: '8', value: 'Double Doubles (DBLDBL)' },
                { key: '9', value: 'Triple Doubles (TRIDBL)' }
            ]
        },
    ]

    const handleSelection = (player) => {
        switch (selection) {
            case -1:
                setOne(player)  
                           
                break;
            case 1:
                setTwo(player)
                console.log(player)
                break;
            default:
                break;
        }

    }

    const loadPlayers = () => {
        console.log('loading players')
        getPlayers().then((res) => {
            setPlayers(res)
        })
    }

    useEffect(() => {
        loadPlayers()
    }, [])

    const handleHTML=()=> {
        return (`
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          </head>
          <body style="text-align: center;">
          
            <div style="padding-top: 1rem; padding-left: 0.5rem; padding-right: 0.5rem; height: 100%;">
                <div style="display: flex; flex-direction: row; width: 100%; height: 30%; justify-content: center; gap:12px;">

                    <div style="display: flex; flex-direction: column;  width: 45%; height: 100%;">
                        
                        <img style=' width: 100%; height: 100%;' src=${p1.photo} />
                        <span style="font-size: 22px; text-align: center; margin-top: 1rem; font-weight: 600; font-size: 12px;">${p1?.name??'Player One'}</span>

                    </div>

                    <div style="display: flex; flex-direction: column;  width: 45%; height: 100%;">

                        <img style=' width: 100%; height: 100%;' src=${p2.photo} />
                        <span style="font-size: 22px; text-align: center; margin-top: 1rem; font-weight: 600; font-size: 12px;">${p2?.name??'Player Two'}</span>

                    </div>

                </div>
                <div style="display: flex; flex-direction: column; margin-top: 22px">
                
                    ${ statgroups.map((group, idx) => {
                        return(
                                `<div key={${idx}}>
                                    <span className='p-2 rounded-md m-1 text-lg font-semibold text-center'>${group.value}</span>
                                    <div className=''>
                                        ${group.data.map((stat, idx) => {
                                            return(
                                                `<div key={${idx}} style="width: 100%; display: flex; flex-direction: row; justify-content: center; gap:8px padding-left: 0.5rem; padding-right: 0.5rem;">
                                                    <span style="font-size: 11px; font-weight: 200; padding-top: 0.5rem; padding-bottom: 0.5rem;">${p1?p1.stats.find((s)=> s.key === `${group.value}:${stat.value}`)?.value??0:0}</span>
                                                    <span style="font-size: 11px; font-weight: 200; padding-top: 0.5rem; padding-bottom: 0.5rem;">${stat.value}</span>
                                                    <span style="font-size: 11px; font-weight: 200; padding-top: 0.5rem; padding-bottom: 0.5rem;">${p2?p2.stats.find((s)=> s.key === `${group.value}:${stat.value}`)?.value??0:0}</span>
                                                </div>`
                                            )
                                        }).join('')}
                                    </div>
                                </div>`
                    )}).join('')
                    }
                </div>
            </div>
          </body>
        </html>
        `)
    }

  const printToFile = async () => {
    const html = handleHTML()

    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

    return (
        <SafeAreaView>
            <View className='h-full relative'>
            <ScrollView>
                <View className='pt-4 px-2 h-full mb-24'>
                    <View className='flex flex-row w-full justify-between'>
                        <View className='w-[45%] h-44'>
                            
                        <TouchableOpacity onPress={() => {
                            setSelection(-1)
                            setIsVisible(true)
                        }
                        }
                            className='w-full h-full rounded bg-slate-300'>
                            {p1 && <Image
                            className='w-full h-full'
                             source={{uri: p1.photo}} />}
                        </TouchableOpacity>

                        <Text className='text-center mt-1 font-semibold text-xs'>{p1?.name??'Player One'}</Text>
                        </View>
                        <View className='w-[45%] h-44'>
                            

                        <TouchableOpacity onPress={() => {
                            setSelection(1)
                            setIsVisible(true)
                        }}
                            className='w-full h-full rounded bg-slate-300'>
                            {
                            p2 && <Image
                            className='w-full h-full'
                             source={{uri: p2.photo}} />
                             }
                        </TouchableOpacity>
                        <Text className='text-center mt-1 font-semibold text-xs'>{p2?.name??'Player Two'}</Text>
                        </View>
                    </View>

                    { statgroups.map((group) => {
                            return (
                                <View>
                                    <Text className='p-2 rounded-md m-1 text-lg font-semibold text-center'>{group.value}</Text>
                                    <View className=''>
                                        {group.data.map((stat, idx) => {
                                            const a = p1?p1.stats.find((s)=> s.key === `${group.value}:${stat.value}`)?.value??0:0
                                            const b = p2?p2.stats.find((s)=> s.key === `${group.value}:${stat.value}`)?.value??0:0
                                            return (
                                                <View key={idx} className='w-full flex flex-row justify-between px-2'>
                                                    <Text>{a}</Text>
                                                    <Text className='text-[11px] font-extralight py-2'>{stat.value}</Text>
                                                    <Text>{b}</Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                            )
                        })
                    }

                </View>
            </ScrollView>

        <TouchableOpacity
        onPress={()=>{printToFile()}}
          className='absolute bottom-0 mb-4 left-0 right-0 mx-8 border border-blue-500 rounded-full py-4 px-8 bg-blue-50 flex flex-row items-center justify-between space-x-8'>
          <Text className='text-blue-500'>Share stats</Text>
          <ShareIcon color={'#3B82F6'} />
        </TouchableOpacity>

            </View>
            {<Modal isVisible={isVisible}
                onBackdropPress={() => (setIsVisible(false))}>
                <ScrollView 
                className='bg-white rounded-3xl px-4 py-2 max-h-[60vh]'>
                    {
                        players?.map((player, idx) => <PlayersList key={idx} player={player} handleSelection={handleSelection} setIsVisible={setIsVisible} />)
                    }

                </ScrollView>
            </Modal>}
        </SafeAreaView>
    )
}

export default CompareScreen