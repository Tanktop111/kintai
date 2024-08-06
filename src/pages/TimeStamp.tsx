


import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { addDoc, collection, Timestamp, doc, getDoc,updateDoc} from "firebase/firestore";
import { auth } from "../firebase/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import StartTimeList from "./StartTimeList";
import StopTimeList from "./StopTimeList";
import StartBreakTimeList from "../pages/StartBreakTimeList";
import StopBreakTimeList from "../pages/StopBreakTimeList";
// import TimeDisplay from "../components/TimeDisplay";
import Header from "../components/Header";
import "../App.css"
import Table from "../components/Table";


// type Id = {
//   id :number;
// }

// type UserProps = {
//   user: User
// }

//const users :string|undefined = "users";
//const users: User = auth.currentUser;



const TimeStamp: React.FC = () => {

  const [error, setError] = useState<string | null>(null);
  const [user, setUsers] = useState<User | null>(null);
  const [id, setId] = useState<number>(0)


  //ユーザーのログインの判別
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUsers(currentUser);
      //id取得
    });

  }, []);


  useEffect(() => {
    const getFinishTime = async () => {
   
      const users: User = user as User
      console.log("こんにちは",users);
      console.log("こんばんは",users.uid);

      // const data = await getDocs(query(collection(db,"users" , users.uid, "id"), orderBy("timestamp", "asc")));
      // setId(data.docs.map((doc) => ({
      //   id: doc.data().id,
     
      // })));

      const data =  doc(db,"users",users.uid)
      const docRef = await getDoc(data)
      const IdValue = docRef.data()?.id;
      setId(IdValue);
      console.log("お品",docRef.data()?.id);
     

     
      //setId(docRef.data());
      //setId(doc.data().id > 0 ? data.docs.length : 1); // Initialize id based on existing data
      
    }
    getFinishTime()
  }, [user])




  //出勤打刻
  const inTime = async () => {
    try {
      const users: User = user as User
      const NewId = id+1;   
      setId(id=>id+1);
         const docRef =  doc(db,"users",users.uid)
         await updateDoc(docRef, {
          id: NewId
        });

      if (user) {
        const userRef = doc(db, "users", user.uid, );
        const collectionRef = collection(userRef, "startTime")
      
        await addDoc(collectionRef, {
          NewId,
          timestamp: Timestamp.fromDate(new Date()),

        });
        

        setError("出勤を打刻しました");
        alert("出勤を打刻しました！");
      }
    } catch (e) {
      setError(`エラー: ${e}`);
    }
  };


  //退勤打刻
  const outTime = async () => {
    try {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const collectionRef = collection(userRef, "finishTime");
        await addDoc(collectionRef, {
          id,
          timestamp: Timestamp.fromDate(new Date()),

        });
        
        setError("退勤を打刻しました");
        alert("退勤を打刻しました！");
      }
    } catch (e) {
      setError(`エラー: ${e}`);
    }
  };

  //休憩開始打刻
  const breakStartTime = async () => {
    try {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const collectionRef = collection(userRef, "breakStartTime");
       // 'currentBreakStartId' を ID として使用する
        await addDoc(collectionRef, {
          id,
          timestamp: Timestamp.fromDate(new Date()),
        });
   
        setError("休憩開始しました");
        alert("休憩開始しました！");
        // ID をインクリメント
      }
    } catch (e) {
      setError(`エラー: ${e}`);
    }
  };


  //休憩終了打刻
  const breakFinishTime = async () => {
    try {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const collectionRef = collection(userRef, "breakFinishTime");
       
        await addDoc(collectionRef, {
      id,
          timestamp: Timestamp.fromDate(new Date()),

        });
    
        setError("休憩を終了しました");
        alert("休憩を終了しました！");
      }
    } catch (e) {
      setError(`エラー: ${e}`);
    }
  };



  return (
    <>
      {user ? (
        <>
          <Header>{`こんにちは、${user.email || "名無しさん"}さん`}</Header>
          <div style={{ display: "flex" }}>
            <button onClick={inTime}>出勤打刻</button>
            <button onClick={outTime}>退勤打刻</button>
            <button onClick={breakStartTime}>休憩開始</button>
            <button onClick={breakFinishTime}>休憩終了</button>
          </div>

          {/* <TimeDisplay> */}
          <table style={{margin: "0 auto", width: "98vw", borderRadius: "10px", backgroundColor: "lightgray", padding: "5px", border: "1"}}>
            <tbody>
              <Table>
                <th><StartTimeList user={user} /></th>
                <td><StopTimeList user={user} /></td>
                <td><StartBreakTimeList user={user} /></td>
                <td><StopBreakTimeList user={user} /></td>
              </Table>
            </tbody>
          </table>

          {/* </TimeDisplay> */}
          <p style={{ color: "orange" }}>{error && error}</p>


        </>
      ) : (
        <p>ログインしてください</p>
      )}
    </>
  );
};



export default TimeStamp;