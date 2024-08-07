import React, { useState, useEffect } from "react";
import { User, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Navigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import Header from "../components/Head";
import { addDoc, collection, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase"




const Signup: React.FC = () => {
  const [registerName, setRegisterName] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [id, setId] = useState<number>(0);


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user

      if (user) {
        await addDoc(collection(db, "user"), {
          userName: registerName,
          email: registerEmail,
          uid: user.uid,
          // password: user.password, 
        });

      }

      if(user) {
        await addDoc(collection(db, "users"), {
          id
        })
      }

    } catch (e) {
      if (e instanceof FirebaseError)
        alert(e.message);
    }
  };

  useEffect(() => {
    const getFinishTime = async () => {
      if (!user) return; // userがnullの場合は関数を終了

      try {
        const userDoc = doc(db, "users", user.uid);
        const docRef = await getDoc(userDoc);
        const IdValue = docRef.data()?.id;

        if (IdValue !== undefined) {
          setId(IdValue);
        }
      } catch (error) {
        console.error("Error fetching finish time:", error);
      }
    };

    if (user) {
      getFinishTime();
    }
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <div>
      <Header>
        <ul>
          <li><Link to={"/"}>ログイン</Link></li>
        </ul>
      </Header>
      {user ? (
        <Navigate to={`/timestamp`} />
      ) : (
        <div>
          <h1>新規登録</h1>

          <form onSubmit={handleSubmit}>


          <div>
              <label>名前</label>
              <input
                type="username"
                name="username"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />
            </div>

            <div>
              <label>メールアドレス</label>
              <input
                type="email"
                name="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </div>

            <div>
              <label>パスワード</label>
              <input
                type="password"
                name="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </div>

            <button>登録する</button>
            <p>ログインは<Link to={`/`}>こちら</Link></p>
          </form>
        </div>
      )}
    </div>
  );
}

export default Signup;
