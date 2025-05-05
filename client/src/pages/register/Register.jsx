import { SignUp } from "@clerk/clerk-react";
import React from "react";

function Register() {

  return (
    <div className="mid register-wrapper">
      <SignUp
        signUpForceRedirectUrl="/selectRole"
      />
    </div>
  );
}

export default Register;
