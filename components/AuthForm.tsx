import React from 'react'

type AuthFormProps = "sign-in" | "sign-up"
function AuthForm({type}: {type: AuthFormProps}) {
  return (
    <div>{type}</div>
  )
}

export default AuthForm