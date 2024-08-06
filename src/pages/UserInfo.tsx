import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, } from "firebase/firestore";
import { User } from "firebase/auth";
import Table from "../components/Table";

type UserInfo = {
  username: string
  email: string
  uid: string
  id: string
}

type UserProps = {
  user: User
}

const StartTimeList: React.FC<UserProps> = ({ user }) => {
  const [userList, setUserList] = useState<UserInfo[]>([]);


  useEffect(() => {
    const contents = async () => {
      const data = await getDocs(collection(db, "user"));

      setUserList(data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        email: doc.data().email,
        username: doc.data().userName,
        uid: user.uid,
      })));
    }
    contents();
  }, [user.uid])



  return (
    <>
      <table style={{width: "95%", maxWidth: "1600px"}}>
        <tbody>
          {userList.map((content) => (
            <Table key={content.id}>
              <th>{content.email}</th>
              <td>{content.uid}</td>
              <td>{content.username}</td>
            </Table>
          ))}
        </tbody>
      </table>
    </>
  );
}


export default StartTimeList;