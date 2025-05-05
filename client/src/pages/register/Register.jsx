import { SignUp } from "@clerk/clerk-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  return (
    <div className="mid register-wrapper">
      <SignUp
        signUpForceRedirectUrl="/selectRole"
        // HOẶC dùng sự kiện nếu bạn muốn xử lý logic phức tạp:
        // afterSignUp={(user) => {
        //   navigate('/select-role');
        // }}
      />
    </div>
  );
}

export default Register;
