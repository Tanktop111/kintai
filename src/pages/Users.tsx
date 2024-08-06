
import UserInfo from "./UserInfo";
import { useState, useEffect } from "react";
import {User, onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebase/firebase";
import "../App.css"

const UserList: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <>
    {user ? (
      <> 
      <UserInfo user={user}/>
      </>

    ):(
      <p>ログインしてください</p>
    )}
    
    </>
  );
}


export default UserList;