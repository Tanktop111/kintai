import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { Timestamp, collection, getDocs, orderBy, query, } from "firebase/firestore";
// import ListStyle from "../components/ListStyle";
import { User } from "firebase/auth";
// import UnOrderedStyle from "../components/UnOrderdStyle";



type Id = {
  id: string
  timestamp: Timestamp
}

type UserProps =  {
user: User
}

const StartTimeList: React.FC<UserProps> = ({ user }) => {
  const [startStampList, setStartStampList] = useState<Id[]>([]);


  useEffect(() => {
    const contents = async () => {
      const data = await getDocs(query(collection(db, "users", user.uid, "breakStartTime"), orderBy("timestamp", "asc")));

      setStartStampList(data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data({ serverTimestamps: "estimate" }).timestamp,
      })));
    }
    contents();
  }, [user.uid])



  return (
    <>
     
        {startStampList.map((content) => (
          <p key={content.id}> 
       
            {new Date(content.timestamp.seconds * 1000).toLocaleString()}
  
          </p>
        ))}
      
    </>
  );
}


export default StartTimeList;