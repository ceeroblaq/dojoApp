import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";



export const getPaymentStatus = async (app, playerid, userId) => {
  // const auth = getAuth(app);
  // const userId = auth.currentUser?.uid;
  // if (!userId) throw new Error("User not logged in");

  const db = getFirestore(app);
  const subscriptionsRef = collection(db, "customers", `${userId}`, "payments");
  const q = query(
    subscriptionsRef,
    where("status", "==", "succeeded"),
    where("metadata", "==",{item:playerid})
  );

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // In this implementation we only expect one active or trialing subscription to exist.
        // console.log("Subscription snapshot", snapshot.docs.length);
        if (snapshot.docs.length === 0) {
          // console.log("No successful payment found");
          resolve(false);
        } else {
          // console.log("Successful payment found");
          resolve(true);
        }
        unsubscribe();
      },
      reject
    )
  })
}

export const getPremiumStatus = async (app, userId) => {
  // const auth = getAuth(app);
  // const userId = auth.currentUser?.uid;
  // if (!userId) throw new Error("User not logged in");

  const db = getFirestore(app);
  const subscriptionsRef = collection(db, "customers", `${userId}`, "subscriptions");
  const q = query(
    subscriptionsRef,
    where("status", "==", "active")
  );

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // In this implementation we only expect one active or trialing subscription to exist.
        // console.log("Subscription snapshot", snapshot.docs.length);
        if (snapshot.docs.length === 0) {
          // console.log("No successful payment found");
          resolve(false);
        } else {
          // console.log("Successful payment found");
          resolve(true);
        }
        unsubscribe();
      },
      reject
    );
  });
};