import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { User } from "firebase/auth";
import * as XLSX from 'xlsx';
import "../index.css"
import Head from '../components/Head';
import { Link } from 'react-router-dom';

type StartDoc = {
  id: number;
  timestamp: Timestamp;
};

type FinishDoc = {
  id: number;
  timestamp: Timestamp;
};

type UserProps = {
  user: User | null;
};

// Function to convert seconds to hours and minutes
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

  // Function to export data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      Array.from(totalTimes).map(([id, totalTime]) => ({
        ID: id,
        "合計時間": formatTime(totalTime),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '勤務データ');
    XLSX.writeFile(workbook, '勤怠データ.xlsx');
  };

  return (
    <>
      {isLoading ? (
        <p>読み込み中...</p>
      ) : (
        <>
        {user ? (<><Head>{`こんにちは、${user.email || "名無しさん"}さん`}</Head>
          <table style={{ width: "95vw", border: "solid 1px" , margin: "80px auto"}}>
            <tbody>
              {Array.from(totalTimes).map(([id, totalTime]) => (
                <tr key={id}>
                  <th style={{borderRight: "solid 1px"}}>ID: {id}</th>
                  <td>合計時間: {formatTime(totalTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={exportToExcel}>Excelエクスポート</button></>)
           : (
            <Link to={`/`}/>
           )}
          
        </>
      )}
    </>
  );
};

export default Calc;
