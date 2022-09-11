// context API로 관리할 state
import React, { useState } from "react";

const AuthContext = React.createContext({
  // 상태 : 초기는 빈문자열
  token: "",
  isLoggedIn: false,

  // 상태 바꾸는 함수
  // token을 인자로 받는 login 함수
  login: (token) => {},
  logout: () => {},
});

// 인증 관련 상태를 관리하는 컴포넌트
// -> 이 컴포넌트를 최상위에 두고 감싸면 하위 컴포넌트들은 AuthContext 컨텍스트에 접근가능
export const AuthContextProvider = (props) => {
  // 처음에 로컬스토리지에 토큰이 있는지 확인
  const initialToken = localStorage.getItem("token");

  // 인증데이터 상태 -> 이 토큰의 상태를 보고 로그인 여부 확인가능
  // 토큰이 없으면 로그인상태X, 토큰이 있으면 로그인상태O
  const [token, setToken] = useState(initialToken);

  // !! => https://ifuwanna.tistory.com/278
  // token이 빈문자열이면 false를 반환, 빈문자열이 아니면 true를 반환
  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
