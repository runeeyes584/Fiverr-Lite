import { SignIn } from "@clerk/clerk-react"
import React from "react"
import "./Login.scss"

function Login() {
  return (
    <div className="mid">
      <SignIn />
    </div>
  )
}

export default Login