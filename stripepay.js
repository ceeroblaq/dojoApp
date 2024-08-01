"use client";
import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

export const getCheckoutUrl = async (
  app,
  priceId,
  userId,
  playerid
) => {
  console.log("getting checkout url");
  if (!userId) throw new Error("User is not authenticated");
  const db = getFirestore(app);
  const checkoutSessionRef = collection(
    db,
    "customers",
    `${userId}`,
    "checkout_sessions"
  )

  const url ='https://dojo-8a998.web.app/subscribe'

  const docRef = await addDoc(checkoutSessionRef, playerid !== null?{
    mode: "payment",
    automatic_tax: true,
    tax_id_collection: true,
    price: priceId,
    success_url: url,
    cancel_url: url,
    metadata: {item: playerid},
  }:{
    //mode: "payment",
    automatic_tax: true,
    tax_id_collection: true,
    price: priceId,
    success_url: url,
    cancel_url: url,
    // metadata: {item: residenceId},
  })
  console.log(userId, docRef.id);

  return new Promise ((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const { error, url } = snap.data()

      if (error) {
        unsubscribe()
        console.log("error", error.message);
        reject(new Error(`An error occurred: ${error.message}`))
      }

      if (url) {
        console.log("Stripe Checkout URL:", url)
        unsubscribe()
        resolve(url)
      }
    });
  });
};

export const getPortalUrl = async (app) => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  let dataWithUrl;
  try {
    const functions = getFunctions(app, "us-central1");
    const functionRef = httpsCallable(
      functions,
      "ext-firestore-stripe-payments-createPortalLink"
    );
    const { data } = await functionRef({
      customerId: user?.uid,
      returnUrl: window.location.origin,
    });

    // Add a type to the data
    dataWithUrl = data 
    console.log("Reroute to Stripe portal: ", dataWithUrl.url);
  } catch (error) {
    console.error(error);
  }

  return new Promise ((resolve, reject) => {
    if (dataWithUrl.url) {
      resolve(dataWithUrl.url);
    } else {
      reject(new Error("No url returned"));
    }
  });
};