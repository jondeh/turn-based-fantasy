import React, { useState, useEffect } from "react"
import useAxios from "../hooks/useAxios"
import { useSelector, useDispatch } from "react-redux"
import useAuth from "../hooks/useAuth"
import { setGameState } from "../redux/newGameReducer"

const UserList = () => {
  useAuth()
  const dispatch = useDispatch()
  const [toggleUsers, setToggleUsers] = useState(true)
  const { users, setUsers } = useAxios("user")
  const [challenges, setChallenges] = useState([])
  const { socket } = useSelector(({ socketReducer }) => socketReducer)
  const { user } = useSelector(({ authReducer }) => authReducer)
  const { gameState } = useSelector(({ gameReducer }) => gameReducer)
  useEffect(() => {
    socket.emit("join", user)
    socket.on("users", (body) => setUsers(body))
    socket.on("send-challenge", (body) => {
      setChallenges((c) => {
        if (c.length === 0) return [body]
        else return c.push(body)
      })
    })
    socket.on("remove-challenge", (body) => {
      setChallenges((c) => {
        return c.filter((e) => {
          if (e.challenger.user_id === body.user_id) {
            return null
          } else {
            return e
          }
        })
      })
    })
    socket.on("game-start", (body) => {
      // console.log(body)
      setToggleUsers(false)
      dispatch(setGameState(body, user.user_id))
      
    })
  }, [])
  return (
    <div>
      <button
      onClick ={() => setToggleUsers(!toggleUsers)}
      >{toggleUsers ? "Hide Users": "View Users"}</button>
      {toggleUsers && (
        <div>
          <div>Active Users:</div>
          {users.length > 0 &&
            users.map(({ username, user_id, email }) => (
              <div key={user_id}>
                <span>{username}</span>
                {user.user_id !== user_id && !gameState.gameStart && (
                  <button
                    onClick={() => {
                      if (user.user_id !== user_id) {
                        socket.emit("challenge", {
                          challenger: user,
                          opponent: { username, user_id, email },
                          gameStart: false,
                        })
                      }
                    }}
                  >
                    Challenge
                  </button>
                )}
              </div>
            ))}
          {challenges.length > 0 && (
            <div>
              <div>Challenges:</div>
              {challenges.map(({ challenger, opponent }) => (
                <div key={challenger.user_id}>
                  <span>{challenger.username}</span>
                  <button
                    onClick={() =>
                      socket.emit("accept-challenge", {
                        challenger,
                        opponent,
                        gameStart: true,
                      })
                    }
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
    </div>
  )
}

export default UserList
