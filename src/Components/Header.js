import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"

const Header = () => {
  const { push } = useHistory()
  const { user } = useSelector(({ authReducer }) => authReducer)
  return (
    <header>
      {user && user.user_id && (
        <div>
          <button onClick={() => push("/dashboard")}>Dashboard</button>
          <button onClick={() => push("/userlist")}>User List</button>
        </div>
      )}
      {!user || !user.user_id && (
          <div>
            <button onClick={() => push("/login")}>Login</button>
            <button onClick={() => push("/register")}>Register</button>
          </div>
        )}
    </header>
  )
}

export default Header
