import { SignIn } from "@clerk/clerk-react"
import React from "react"
import "./Login.scss"

function Login() {
  return (
    <div className="mid">
      <SignIn 
        signInForceRedirectUrl="/selectRole"
      />
    </div>
  )
}

export default Login