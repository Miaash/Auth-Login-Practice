import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import classes from "./AuthForm.module.css";
import AuthContext from "../../store/auth-context";

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  // 로그인 모드인지 아닌지 확인하는 state (default는 true)
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 로그인/회원가입 전환 버튼을 눌렀을 때
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  // 회원가입 버튼을 눌렀을 때
  const onSubmitHandler = (e) => {
    e.preventDefault();

    // useRef를 통해 email input에 입력된 value를 가져올 수 있음
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    //로그인 모드인지 아닌지 확인하기, 아니라면 회원가입 - axios ver
    // let url;
    // if (isLogin) {
    //   url =
    //     "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA57iPa21JV5ADJ53aJLWbraqXSklIv_vg";
    // } else {
    //   url =
    //     "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA57iPa21JV5ADJ53aJLWbraqXSklIv_vg";
    // }
    // let content = {
    //   email: enteredEmail,
    //   password: enteredPassword,
    //   returnSecureToken: true,
    // };
    // axios
    //   .post(url, content)
    //   .then((res) => {
    //     console.log(res.data);
    //     setIsLoading(false);
    //     authCtx.login(res.data.idToken);
    //     // console.log(res.data.idToken);
    //   })
    //   .then((err) => alert("Authentication failed!", err));

    //로그인 모드인지 아닌지 확인하기, 아니라면 회원가입 - fetch ver
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA57iPa21JV5ADJ53aJLWbraqXSklIv_vg";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA57iPa21JV5ADJ53aJLWbraqXSklIv_vg";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
          // console.log(res.data);
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication failed!";
            // 아래는 콘솔에 찍히는 에러 내용이 alert 창에 나타난다.
            // if (data && data.error && data.error.message) {
            //   errorMessage = data.error.message;
            // }
            // alert(errorMessage);
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        authCtx.login(data.idToken);
        // console.log(data.idToken);
        // 다른 페이지로 리디렉션 함, 사용자가 뒤로가기를 할 수 없게 함
        history.replace("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={onSubmitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Loading...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
