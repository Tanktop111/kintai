import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import StartTimeList from "./StartTimeList";
import StopTimeList from "./StopTimeList";
import StartBreakTimeList from "../pages/StartBreakTimeList";
import StopBreakTimeList from "../pages/StopBreakTimeList";
import Header from "../components/Head";
import "../App.css";
import styled from "styled-components";






const TimeStamp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);


  // ユーザーのログインの判別
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);




  return (
    <>
      {user ? (
        <>
          <Header>{`こんにちは、${user.email || "名無しさん"}さん`}</Header>
      
          <table style={{border: "solid 1px", width: "95%", margin: "80px auto"}}>
            <Tbody>
              <Tr>
                <Th>出勤時間</Th>
                <Td>休憩開始時間</Td>
                <Td>休憩終了時間</Td>
                <Td>退勤時間</Td>
              </Tr>
              <Tr>
                <Th><StartTimeList user={user}/></Th>
               <Td><StopTimeList user={user} /></Td> 
               <Td><StartBreakTimeList user={user} /></Td>  
               <Td><StopBreakTimeList user={user} /></Td>  
              </Tr>
            </Tbody>
          </table>
        </>
      ) : (
        <p>ログインしてください</p>
      )}
    </>
  );
};

export default TimeStamp;


const Tbody = styled.tbody`
  width: 100%;
  border: solid 1px;
`;

const Tr = styled.tr`
  width: 100%;
  display: flex;
`;


const Th = styled.th`
width: 100%;
  display: flex;
  flex-direction: column;
  font-weight: 400;
`
const Td = styled.td`
width: 100%;
  display: flex;
  flex-direction: column;
`;