import { initializeApp } from 'firebase/app';


import {
    initializeAuth, getReactNativePersistence,
    signInWithEmailAndPassword, createUserWithEmailAndPassword, FacebookAuthProvider, signInWithRedirect,
    getRedirectResult, signInWithPopup, signOut, deleteUser
} from "firebase/auth";
// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
import { getFirestore, collection, getDocs, getDoc, doc, query, where, Timestamp, addDoc, orderBy, limit, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
// import {...} from "firebase/functions";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getCheckoutUrl } from './stripepay';
import { getPaymentStatus, getPremiumStatus } from './paymentStatus';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA5_rDYIN_6Eo9G--QfeJ91G2EpHmp27QE",
    authDomain: "dojo-8a998.firebaseapp.com",
    databaseURL: 'https://dojo-8a998.firebaseio.com',
    projectId: "dojo-8a998",
    storageBucket: "dojo-8a998.appspot.com",
    messagingSenderId: "637537640196",
    appId: "1:637537640196:web:4046cdf9ecf087ef94fa51",
    measurementId: "G-0FJSWG96YF"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})

export const COLLECTION = {
    roles: 'Roles',
    articles: 'articles',
    games: 'fixtures',
    overalls: 'overalls',
    players: 'players',
    sports: 'sports',
    leagues: 'leagues',
    statgroups: 'statgroups',
    stats: 'stats',
    teams: 'teams',
    users: 'users',
    videos: 'videos',
    comments: 'comments',
    requests: 'requests',
    validation: 'validation',
}

const provider = new FacebookAuthProvider();
provider.setCustomParameters({
    'display': 'popup'
})

export const logout = (onAuth) => {
    signOut(auth).then(() => {
        // Sign-out successful.
        onAuth()
    }).catch((error) => {
        // An error happened.
    });
}

export const deleteAccount = async () => {
    const user = auth.currentUser;

    deleteUser(user).then(() => {
        // User deleted.
        return true
    }).catch((error) => {
        // An error ocurred
        console.log('oops', error)
        return false
    });
}

export const checkPlayerPaidFor = async (playerid) => {
    const ok = await getPaymentStatus(app, playerid, auth.currentUser?.uid)
    return ok
}
export const checkSubscriptionStatus = async (playerid) => {
    const ok = await getPremiumStatus(app, auth.currentUser?.uid)
    return ok
}

export const upgradeToPremium = async () => {
    const priceId = 'price_1PLmtvP7ZL2dT5VaYcKQzvzK'
    console.log("Upgrade to Premium");
    const checkoutUrl = await getCheckoutUrl(app, priceId, auth.currentUser?.uid, null);
    return checkoutUrl;
}
export const dataPayment = async (playerid) => {
    const priceId = 'price_1PdYAYP7ZL2dT5Vaq6hfrZ7w'
    const checkoutUrl = await getCheckoutUrl(app, priceId, auth.currentUser?.uid, playerid);
    console.log("Onetime payment");
    return checkoutUrl
}

const createUser = async (user, data, onAuth) => {
    const user_doc = doc(db, COLLECTION.users, user.uid);
    const docSnap = await getDoc(user_doc);


    if (docSnap.exists()) {
        // await updateDoc(user_doc, { token: token })
        // doc.data() will be undefined in this case
        console.log("User exists!")
    } else {
        // save user
        const docData = {
            created: Timestamp.fromDate(new Date()),
            uid: user.uid,
            pid: '',
            isplayer: data.isplayer,
            about: '',
            fname: data.fname,
            lname: data.lname,
            email: user.email,
            photo: user.photoURL,
            phone: data.phone,
            hero: '',
            verification: 0
        };
        await setDoc(user_doc, docData, { merge: true })
        if (data.isplayer) {
            const pid = await createPlayer(data)
            await setDoc(user_doc, { pid: pid }, { merge: true })
        }
        onAuth()
    }
}

export const createUserEmailPass = (data, onAuth) => {
    const email = data.email
    const password = data.password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // console.log(user)
            createUser(user, data, onAuth)
            // onAuth()
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            // ..
        });
}

export const authenticateUserEmailPass = (email, password, onAuth) => {
    console.log(email)//Cyrileugene3@gmail.com
    console.log(password)//m$QSJ6aUGpd$fYF
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            onAuth(user)
            // ...
        })
        .catch((error) => {
            console.log(error)
            onAuth(null)
        });
}

export const facebookSignIn = () => {
    signInWithRedirect(auth, provider)
}
// getRedirectResult(auth)
//   .then((result) => {
//     // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//     const credential = FacebookAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;

//     const user = result.user;
//     console.log('fbuser', user)
//     // IdP data available using getAdditionalUserInfo(result)
//     // ...
//   }).catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     const email = error.customData.email;
//     // AuthCredential type that was used.
//     const credential = FacebookAuthProvider.credentialFromError(error);
//     // ...
//   });

const usersCollection = collection(db, COLLECTION.users)
const playersCollection = collection(db, COLLECTION.players)

const updateUserDoc = async (uid, data) => {
    const user_doc = doc(db, COLLECTION.users, uid);
    await setDoc(user_doc, data, { merge: true })
}

const updatePlayerDoc = async (id, data) => {
    // console.log("pid",id)
    const user_doc = doc(db, COLLECTION.players, id);
    await setDoc(user_doc, data, { merge: true })
}

export const getLeagues = async (id) => {
    const q = query(
        collection(db, `${COLLECTION.sports}/${id}/${COLLECTION.leagues}`),
        orderBy('title', 'asc')
    )
    const querySnapshot = await getDocs(q);
    const data = []
    if (!querySnapshot.empty) {
        var cnt = 0
        querySnapshot.forEach((doc) => {
            data.push({
                key: doc.id,
                value: doc.data().title,
            })
            cnt++
        })
    }
    return data
}

function pushUniqueObject(arr, obj) {
    if (arr.findIndex(item => item.name === obj.name) === -1) {
        arr.push(obj);
    }
}

export const getSports = async () => {
    const q = collection(db, COLLECTION.sports)
    const querySnapshot = await getDocs(q);
    const data = []
    querySnapshot.forEach(async (doc) => {
        // const leagues = 
        pushUniqueObject(data, {
            id: doc.id,
            name: doc.data().name,
            leagues: []//await getLeagues(collection(db, `${COLLECTION.sports}/${doc.id}/${COLLECTION.leagues}`))
        })
    })
    return data
}
export const getStatSports = async () => {
    const q = collection(db, COLLECTION.sports)
    const querySnapshot = await getDocs(q);
    const data = []
    querySnapshot.forEach(async (doc) => {
        // const leagues = 
        data.push({
            key: doc.id,
            value: doc.data().name
        })
    })
    return data
}
export const getStats = async (sid) => {

    const q = query(
        collection(db, `${COLLECTION.sports}/${sid}/stats`)
    )
    const querySnapshot = await getDocs(q)
    const data = []
    querySnapshot.forEach(async (doc) => {

        data.push({
            key: doc.id,
            value: doc.data().name
        })

    })
    return data
}
export const getRoles = async () => {
    const q = collection(db, COLLECTION.roles)
    const querySnapshot = await getDocs(q);
    const data = []
    querySnapshot.forEach(async (doc) => {
        if (doc.id > 2) {

            data.push({
                id: doc.id,
                label: doc.data().name,
                value: doc.data().name,
            })
        }
    })
    return data
}

export const getGames = async (lid) => {
    const data = []
    const q = query(
        collection(db, COLLECTION.games),
        where('leagueId', '==', lid)
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        const date = doc.data().created.toDate()
        const time = date.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" })
        const shortdate = date.toLocaleDateString("en-GB")
        data.push({
            id: doc.id,
            status: doc.data().status,
            teams: doc.data().teams,
            time: doc.data().time,
            date: doc.data().date,
            homeTeam: doc.data().homeTeam,
            awayTeam: doc.data().awayTeam,
            homeScore: doc.data().homeScore,
            awayScore: doc.data().awayScore
        })
    })
    return data
}

export const getPlayers = async () => {
    const data = []
    // const q = query(
    //     collection(db, COLLECTION.games)
    //     // where('photo', '!=', "")
    // )
    const querySnapshot = await getDocs(collection(db, COLLECTION.players))
    querySnapshot.forEach(async (player) => {
        const reqs = await getPlayerStats(player.id)
        data.push({
            id: player.id,
            name: `${player.data().fname} ${player.data().lname}`,
            about: player.data().about,
            college: player.data().college,
            dob: player.data().dob,
            email: player.data().email,
            experience: player.data().experience,
            fname: player.data().fname,
            highschool: player.data().highschool,
            hometown: player.data().hometown,
            lname: player.data().lname,
            phone: player.data().phone,
            photo: player.data().photo,
            pid: player.data().pid,
            pob: player.data().pob,
            country: player.data().country,
            career: player.data().career,
            position: player.data().position,
            hero: player.data().hero,
            validation: player.data().validation ? player.data().validation : 0,
            stats: reqs
        })
    })

    return data
}

export const getComments = async (refId) => {
    const data = []
    const q = query(
        collection(db, COLLECTION.comments),
        where('refid', '==', refId),
        orderBy("time", "desc"),
        limit(100)
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        const date = doc.data().time.toDate()
        const time = date.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" })
        const shortdate = date.toLocaleDateString("en-GB")
        data.push({
            id: doc.id,
            body: doc.data().body,
            poster: doc.data().poster,
            time: time,
            date: shortdate,
            level: doc.data().level
        })
    })
    return data
}

export const getRelevantComments = async (objarr) => {
    var following = objarr.map((item, idx) => item['key'])
    const data = []
    if (following.length === 0) { return [] }
    const q = query(
        collection(db, COLLECTION.comments),
        where('posterid', 'in', following),
        orderBy("time", "desc"),
        limit(100)
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        const date = doc.data().time.toDate()
        const time = date.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" })
        const shortdate = date.toLocaleDateString("en-GB")
        data.push({
            id: doc.id,
            body: doc.data().body,
            poster: doc.data().poster,
            time: time,
            date: shortdate,
            level: doc.data().level
        })
    })
    // console.log(data)
    return data
}

export const getArticles = async () => {
    const articlesCollection = collection(db, COLLECTION.articles)
    const querySnapshot = await getDocs(articlesCollection);
    const data = []
    var t = 0
    while (t < 15) {
        querySnapshot.forEach((doc) => {
            data.push({
                id: doc.id,
                title: doc.data().title,
                date: '02/09/2023',
                thumb: doc.data().image,
                video: doc.data().video,
                featured: doc.data().featured,
                body: doc.data().body
            })
        })
        t++
    }

    return data
}

export const getVidoes = async () => {
    const videosCollection = collection(db, COLLECTION.videos)
    const querySnapshot = await getDocs(videosCollection);
    const data = []
    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            title: doc.data().title,
            date: '02/09/2023',
            thumb: doc.data().thumbnail,
            description: doc.data().description,
            url: doc.data().url,
            featured: doc.data().featured
        })
    })

    // console.log("filter",data.filter(vid => vid.featured)[0])

    return data
}

const getDataRequests = async (col) => {
    const querySnapshot = await getDocs(col);
    const data = []
    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            data.push({
                rid: doc.id,
                uid: doc.data().uid,
                pid: doc.data().pid,
                status: doc.data().status,
                time: doc.data().time,
            })
        })
    }

    return data
}
export const getValidationRequests = async () => {
    const querySnapshot = await getDocs(query(
        collection(db, `${COLLECTION.validation}`),
        where('uid', '==', auth.currentUser.uid),
        orderBy('time', 'desc')
    ));
    const data = []
    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            data.push({
                rid: doc.id,
                uid: doc.data().uid,
                pid: doc.data().pid,
                status: doc.data().status,
                time: doc.data().time,
            })
        })
    }

    return data
}


export const getTeamInfo = async (teamId) => {
    const ref = doc(db, COLLECTION.teams, teamId)
    const d = await getDoc(ref)
    const data = {
        id: d.id,
        name: d.data().name,
        players: d.data().players,
    }
    return data
}

export const getGameInfo = async (gameId) => {
    const ref = doc(db, COLLECTION.sports, gameId)
    const doc = await getDoc(ref)
    const data = {
        id: doc.id,
        name: doc.data().name
    }
    return data
}

export const createPlayer = async (data) => {
    const ref = collection(db, COLLECTION.players)
    const p = await addDoc(ref, data)

    return p.id
}

export const getPlayerInfo = async (id) => {

    const q = query(
        collection(db, `${COLLECTION.requests}`),
        where('pid', '==', id)
    )
    const ref = doc(db, COLLECTION.players, id)
    const player = await getDoc(ref)
    const followers = await getFollowers(id)
    const reqs = await getDataRequests(q)
    const p = player.data()
    console.log('player', p)
    const data = {
        id: player.id,
        name: `${p.fname} ${p.lname}`,
        about: p.about,
        college: p.college,
        dob: p.dob,
        email: p.email,
        experience: p.experience,
        fname: p.fname,
        highschool: p.highschool,
        hometown: p.hometown,
        lname: p.lname,
        phone: p.phone,
        pid: p.pid,
        pob: p.pob,
        country: p.country,
        career: p.career ?? '',
        position: p.position,
        hero: p.hero,
        photo: p.photo,
        validation: p.validation ? p.validation : 0,
        datareqs: reqs,
        followers: followers
    }

    return data
}

export const updatePlayerInfo = async (pid, data) => {
    const p_doc = doc(db, COLLECTION.players, pid);
    await setDoc(p_doc, data, { merge: true })
    await updateUserDoc(data.uid, data)
}

export const joinTeam = async (tid, onJoin) => {
    const p_doc = doc(db, COLLECTION.teams, tid);
    const user = await getUserInfo()
    console.log('pid', user.pid)
    if (user.pid && user.pid !== '') {
        await updateDoc(p_doc, { players: arrayUnion({ id: user.pid }) })
        onJoin(true)
    } else {
        onJoin(false)
    }
}

export const getUserInfo = async () => {

    const id = auth.currentUser.uid
    console.log(id)
    const ref = doc(db, COLLECTION.users, id)
    const player = (await getDoc(ref)).data()
    console.log(player)
    const following = await getFollowing(id)
    const data = {
        id: id,
        about: player?.about,
        pid: player?.pid,
        email: player?.email,
        fname: player?.fname,
        name: `${player?.fname} ${player?.lname}`,
        isplayer: player?.isplayer ?? false,
        lname: player?.lname,
        validation: player?.validation ? player?.validation : 0,
        phone: player?.phone,
        country: player?.country ?? '',
        experience: player?.experience ?? '',
        career: player?.career ?? '',
        photo: player?.photo,
        hero: player?.hero,
        following: following,
    }
    console.log('current user data', data)

    return data
}

export const savePlayerStat = async (data, onSave) => {
    const doc2 = doc(db, `${COLLECTION.stats}/${data.pid}/${data.sportid}/${data.stat}`)
    await setDoc(doc2, data, { merge: true })
    onSave()
}

export const getPlayerStats = async (id, sportid) => {
    const querySnapshot = await getDocs(collection(db, `${COLLECTION.stats}/${id}/${sportid}`));
    const stats = []
    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            stats.push({
                key: doc.id,
                pid: doc.data().pid,
                sport: doc.data().sport,
                sportid: doc.data().sportid,
                stat: doc.data().stat,
                value: doc.data().value
            })
        })
    }

    return stats

}

export const postComment = async (data, handleComments) => {
    const d = {
        body: data.body,
        posterimage: '',
        level: data.level,
        refid: data.refid,
        posterid: data.posterid,
        poster: data.poster,
        time: Timestamp.fromDate(new Date()),
    }
    const col = collection(db, COLLECTION.comments)
    const menu = await addDoc(col, d)
    handleComments()
}

export const requestValidation = async (data, onRequest) => {
    const d = {
        ...data,
        status: 1,
        time: Timestamp.fromDate(new Date()),
    }
    const col = collection(db, COLLECTION.validation)
    await addDoc(col, d)
    onRequest()
}

export const requestData = async (data, onRequest) => {
    const d = {
        ...data,
        uid: auth.currentUser.uid,
        status: 1,
        time: Timestamp.fromDate(new Date()),
    }
    const col1 = collection(db, `${COLLECTION.players}/${data.pid}/${COLLECTION.requests}`)
    const col2 = collection(db, COLLECTION.requests)
    await addDoc(col2, d)
    await addDoc(col1, d)
    onRequest()
}

export const connectToCoach = async (onRequest) => {
    const d = {
        message: "",
        uid: auth.currentUser.uid,
        status: 1,
        time: Timestamp.fromDate(new Date()),
    }
    const col1 = collection(db, `${COLLECTION.players}/${data.pid}/${COLLECTION.requests}`)
    const col2 = collection(db, COLLECTION.requests)
    await addDoc(col2, d)
    await addDoc(col1, d)
    onRequest()
}

const getFollowers = async (id) => {
    const q = query(
        collection(db, `${COLLECTION.players}/${id}/followers`),
        where('status', '==', 1)
    )

    const querySnapshot = await getDocs(q);
    const followers = []
    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            followers.push({
                key: doc.id,
                pid: doc.data().pid,
                pid: doc.data().uid,
                status: doc.data().status,
            })
        })
    }
    return followers
}
const getFollowing = async (id) => {
    const q = query(
        collection(db, `${COLLECTION.users}/${id}/following`),
        where('status', '==', 1)
    )

    const querySnapshot = await getDocs(q);
    const followers = []
    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            followers.push({
                key: doc.id,
                pid: doc.data().pid,
                pid: doc.data().uid,
                status: doc.data().status,
            })
        })
    }
    return followers
}
const follow = async (data, onFollow) => {
    console.log('following')
    const d = {
        ...data,
        status: 1,
        time: Timestamp.fromDate(new Date()),
    }
    const col1 = collection(db, `${COLLECTION.players}/${data.pid}/followers`)
    const col2 = collection(db, `${COLLECTION.users}/${data.uid}/following`)

    const d1 = doc(col1, data.uid);
    const d2 = doc(col2, data.pid);
    await setDoc(d1, d, { merge: true })
    await setDoc(d2, d, { merge: true })
    onFollow('Now Following')
}
const unfollow = async (data, onFollow) => {
    console.log('unfollowing')
    const d = {
        ...data,
        status: 0,
        time: Timestamp.fromDate(new Date()),
    }

    const d1 = doc(db, `${COLLECTION.players}/${data.pid}/followers`, data.uid);
    const d2 = doc(db, `${COLLECTION.users}/${data.uid}/following`, data.pid);
    await setDoc(d1, d, { merge: true })
    await setDoc(d2, d, { merge: true })
    onFollow('Unfollowed')
}
export const followUnfollow = async (data, onFollow) => {
    const docSnap = await getDoc(doc(db, `${COLLECTION.players}/${data.pid}/followers`, data.uid));

    if (docSnap.exists()) {
        if (docSnap.data().status === 0) {
            await follow(data, onFollow)
        } else {
            await unfollow(data, onFollow)
        }
    } else {
        await follow(data, onFollow)
    }
}

export const uploadImage = async (setUploading, image, uid, pid) => {
    setUploading(true)
    const resp = await fetch(image.uri)
    const blob = await resp.blob()
    const filename = `${uid}.jpg`
    const storageRef = ref(storage, `/avatars/${filename}`)
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            // update progress
            // setPercent(percent)
        },
        (err) => {
            setUploading(false)
            console.log(err)
        },
        () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                const data = { photo: url }
                await updateUserDoc(uid, data)
                await updatePlayerDoc(pid, data)
                setUploading(false)
            });
        }
    );
}

export const uploadHeroImage = async (setUploading, image, uid, pid) => {
    setUploading(true)
    const resp = await fetch(image.uri)
    const blob = await resp.blob()
    const filename = `${uid}.jpg`
    const storageRef = ref(storage, `/heroes/${filename}`)
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            // update progress
            // setPercent(percent)
        },
        (err) => {
            setUploading(false)
            console.log(err)
        },
        () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                const data = { hero: url }
                await updateUserDoc(uid, data)
                await updatePlayerDoc(pid, data)
                setUploading(false)
            });
        }
    );
}


