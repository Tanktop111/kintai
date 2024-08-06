import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Navigate, Link } from "react-router-dom";

const Login: React.FC = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
 const [user, setUser] = useState<User | null>(null);


  const handleSubmit = async (e:{ preventDefault: () => void;} ) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error) {
      alert("メルアドレスまたはパスワードに問題があります。");
    }
  };


  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  },[]);

  return (
    <div>
      {user ? (
        <Navigate to={`/timestamp`} />
      ) : (
        <div>
          <h1>ログイン</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>メールアドレス</label>
              <input
                type="email"
                name="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div>
              <label>パスワード</label>
              <input
                type="password"
                name="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button>ログインする</button>
            <p>新規登録は<Link to={`/signup`}>こちら</Link></p>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;
