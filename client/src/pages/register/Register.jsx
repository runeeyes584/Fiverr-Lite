import { SignUp } from "@clerk/clerk-react"
import React from "react"
import "./Register.scss"

function Register() {
  return (
    <div className="center">
      <SignUp /> 
    </div>
  )
}

export default Register