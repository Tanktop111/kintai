import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { User } from "firebase/auth";
import Table from '../components/Table';



type StartDoc = {
  id: number;
  timestamp: Timestamp;
};

type FinishDoc = {
  id: number;
  timestamp: Timestamp;
};

type UserProps = {
  user: User | null
}

// 関数: 秒を時間と分に変換
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}時間${minutes}分`;
};

const Calc: React.FC<UserProps> = ({ user }) => {
  const [totalTimes, setTotalTimes] = useState<Map<number, number>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (!user?.uid) {
        return;
      }

      const startCollectionRef = collection(db, "users", user.uid, 'startTime');
      const finishCollectionRef = collection(db, "users", user.uid, 'finishTime');

      const startDocsQuery = query(startCollectionRef, orderBy('id', "asc"));
      const finishDocsQuery = query(finishCollectionRef, orderBy('id', "asc"));

      const startDocs = await getDocs(startDocsQuery);
      const finishDocs = await getDocs(finishDocsQuery);

      const startData: StartDoc[] = startDocs.docs.map((doc) => doc.data() as StartDoc);
      const finishData: FinishDoc[] = finishDocs.docs.map((doc) => doc.data() as FinishDoc);

      const totalTimesMap = new Map<number, number>();

      for (const startDoc of startData) {
        const matchingFinishDoc = finishData.find((finishDoc) => finishDoc.id === startDoc.id);
        if (matchingFinishDoc) {
          const timeDiff = matchingFinishDoc.timestamp.seconds - startDoc.timestamp.seconds;
          const existingTime = totalTimesMap.get(startDoc.id) || 0;
          totalTimesMap.set(startDoc.id, existingTime + timeDiff);
        }
      }

      setTotalTimes(totalTimesMap);
      setIsLoading(false);
    };

    fetchData();
  }, [user?.uid]);

  return (
    <>
      {isLoading ? (
        <p>読み込み中...</p>
      ) : (
        <table style={{width: "95vw"}}>
          <tbody>
          {Array.from(totalTimes).map(([id, totalTime]) => (
              <Table key={id}>
                <th>ID: {id}</th>
                <td>合計時間: {formatTime(totalTime)}</td>
              </Table>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Calc;
