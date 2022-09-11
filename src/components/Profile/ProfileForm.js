import { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import axios from "axios";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const history = useHistory();

  const authCtx = useContext(AuthContext);

  const SubmitHandler = (e) => {
    e.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    //유효성 검사 추가 (추후에)
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyA57iPa21JV5ADJ53aJLWbraqXSklIv_vg";

    // let content = {
    //   idToken: authCtx.token,
    //   password: enteredNewPassword,
    //   returnSecureToken: false,
    // };
    // axios
    //   .post(url, content)
    //   .then((res) => console.log(res.data))
    //   .then((err) => console.log("err", err));

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res.data);
      history.replace("/");
    });
  };

  return (
    <form className={classes.form} onSubmit={SubmitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
