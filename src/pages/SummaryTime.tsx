
import TimeCalcuration from "../pages/TimeCalculation";
import { useState, useEffect } from "react";
import {User, onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebase/firebase";
import "../App.css"


const Summary: React.FC = () => {
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
      <TimeCalcuration user={user}/>
       </>
    ):(
      <p>ログインしてください</p>
    )}
    
    </>
  );
}


export default Summary;