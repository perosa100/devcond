import React, { useState, useEffect } from 'react'
import { TheContent, TheSidebar, TheFooter } from './index'
import useApi from '../services/api'
import { useHistory } from 'react-router-dom'

const TheLayout = ({ ...props }) => {
  const history = useHistory()
  const api = useApi()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      if (api.getToken()) {
        const result = await api.validadeToken()
        if (result.error === '') {
          setLoading(false)
        } else {
          alert(result.error)
          history.push('/login')
        }
      } else {
        history.push('/login')
      }
    }

    checkLogin()
  }, [api, history])
  return (
    <div className="c-app c-default-layout">
      {!loading && (
        <>
          <TheSidebar />
          <div className="c-wrapper">
            <div className="c-body">
              <TheContent />
            </div>
            <TheFooter />
          </div>
          )
        </>
      )}
    </div>
  )
}

export default TheLayout
