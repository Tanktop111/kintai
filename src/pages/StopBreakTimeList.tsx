import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { Timestamp, collection, getDocs, orderBy, query } from "firebase/firestore";
import { User } from "firebase/auth";
import styled from "styled-components";

type Id = {
  id: string;
  timestamp: Timestamp;
}

type UserProps = {
  user: User;
}

const formatTimestampToHoursAndMinutes = (timestamp: Timestamp): string => {
  const date = new Date(timestamp.seconds * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const StartTimeList: React.FC<UserProps> = ({ user }) => {
  const [startStampList, setStartStampList] = useState<Id[]>([]);

  useEffect(() => {
    const contents = async () => {
      const data = await getDocs(query(collection(db, "users", user.uid, "breakFinishTime"), orderBy("timestamp", "asc")));

      setStartStampList(data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data({ serverTimestamps: "estimate" }).timestamp,
      })));
    };
    contents();
  }, [user.uid]);

  return (
    <>
      {startStampList.map((content) => (
        <P key={content.id}>
          {formatTimestampToHoursAndMinutes(content.timestamp)}
        </P>
      ))}
    </>
  );
};

export default StartTimeList;

const P = styled.p`
    border-bottom: solid 1px;
`