import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { addDoc, collection, Timestamp, doc,  } from "firebase/firestore";
import { auth } from "../firebase/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import Head from "../components/Head";
import "../App.css";







const TimeStamp: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [id, setId] = useState<number>(0);

  // ユーザーのログインの判別
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);



  // 出勤打刻
  const inTime = async () => {
    try {
      if (!user) throw new Error("User is not authenticated");

      const newId = id + 1;
      setId(newId);

      const userDocRef = doc(db, "users", user.uid);
      const startTimeCollectionRef = collection(userDocRef, "startTime");

      await addDoc(startTimeCollectionRef, {
        id: newId,
        timestamp: Timestamp.fromDate(new Date()),
      });

      setError("出勤を打刻しました");
      alert("出勤を打刻しました！");
    } catch (error) {
      console.error("Error in inTime function:", error);
      if (error instanceof Error) {
        setError(`エラー: ${error.message}`);
      } else {
        setError("エラー: An unknown error occurred");
      }
    }
  };


  // 退勤打刻
  const outTime = async () => {
    try {
      if (!user) throw new Error("User is not authenticated");

      const userDoc = doc(db, "users", user.uid);
      const collectionRef = collection(userDoc, "finishTime");
      await addDoc(collectionRef, {
        id,
        timestamp: Timestamp.fromDate(new Date()),
      });

      setError("退勤を打刻しました");
      alert("退勤を打刻しました！");
    } catch (e) {
      setError(`エラー: ${e}`);
    }
  };

  // 休憩開始打刻
  const breakStartTime = async () => {
    try {
      if (!user) throw new Error("User is not authenticated");

      const userDoc = doc(db, "users", user.uid);
      const collectionRef = collection(userDoc, "breakStartTime");
      await addDoc(collectionRef, {
        id,
        timestamp: Timestamp.fromDate(new Date()),
      });

      setError("休憩開始しました");
      alert("休憩開始しました！");
    } catch (e) {
      setError(`エラー: ${e}`);
    }
  };

  // 休憩終了打刻
  const breakFinishTime = async () => {
    try {
      if (!user) throw new Error("User is not authenticated");

      const userDoc = doc(db, "users", user.uid);
      const collectionRef = collection(userDoc, "breakFinishTime");
      await addDoc(collectionRef, {
        id,
        timestamp: Timestamp.fromDate(new Date()),
      });

      setError("休憩を終了しました");
      alert("休憩を終了しました！");
    } catch (e) {
      setError(`エラー: ${e}`);
    }
  };

  return (
    <>
      {user ? (
        <>
          <Head>{`こんにちは、${user.email || "名無しさん"}さん`}</Head>
          <div style={{ display: "flex" }}>
            <button onClick={inTime}>出勤打刻</button>
            <button onClick={outTime}>退勤打刻</button>
            <button onClick={breakStartTime}>休憩開始</button>
            <button onClick={breakFinishTime}>休憩終了</button>
          </div>

        

          <p style={{ color: "orange" }}>{error && error}</p>
        </>
      ) : (
        <p>ログインしてください</p>
      )}
    </>
  );
};

export default TimeStamp;

