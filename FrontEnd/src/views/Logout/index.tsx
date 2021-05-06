import useApi from '../../services/api'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'

function Logout(): any {
  const api = useApi()
  const history = useHistory()
  
  useEffect(() => {
    const doLoggout = async () => {
      await api.logout()
      history.push('/login')
    }
    doLoggout()
  }, [api, history])

  return null
}

export default Logout
