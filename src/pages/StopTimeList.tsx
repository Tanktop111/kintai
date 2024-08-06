import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { Timestamp, collection, getDocs, query, orderBy} from "firebase/firestore";
// import ListStyle from "../components/ListStyle";
import { User } from "firebase/auth";
// import UnOrderedStyle from "../components/UnOrderdStyle";


type Id = {
  id :string
  timestamp: Timestamp
}

type UserProps = {
  user: User
}


const StopTimeList: React.FC<UserProps> = ({user}) => {
  const [finishStampList, setFinishStampList] = useState<Id[]>([]);



  useEffect(() => {
    const getFinishTime = async () => {
      const data = await getDocs(query(collection(db, "users", user.uid, "finishTime"), orderBy("timestamp", "asc")));
      setFinishStampList(data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data({serverTimestamps: "estimate"}).timestamp,
      })));
    }
    getFinishTime()
  }, [user.uid])


  return (
    <>
      
        {finishStampList.map((content) => (
          <p key={content.id}>
             {new Date(content.timestamp.seconds * 1000).toLocaleString()}
          </p>

        ))}
   
    </>
  );
};


export default StopTimeList;