import { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import useApi from '../../services/api'
import { useHistory } from 'react-router-dom'

const Login = ({ ...props }) => {
  const api = useApi()
  const history = useHistory()

  const [email, setEmail] = useState('suporte@b7web.com.br')
  const [password, setPassword] = useState('1234')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLoginButton = async () => {
    if (email && password) {
      setLoading(true)
      const result = await api.login(email, password)
      setLoading(false)

      if (result.error === '') {
        localStorage.setItem('@token/conddev', result.token)
        history.push('/')
      } else {
        setError(result.error)
      }
    } else {
      setError('Digite os dados')
    }
  }

  return (
    <div
      className="c-app c-default-layout flex-row align-items-center"
      {...props}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="5">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1 style={{ textAlign: 'center' }}>Login</h1>
                    <p className="text-muted ">Digite seus dados de acesso</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        placeholder="E-mail"
                        autoComplete="username"
                        value={email}
                        disabled={loading}
                        onChange={(e: any) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder="Senha"
                        autoComplete="current-password"
                        value={password}
                        disabled={loading}
                        onChange={(e: any) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    {error !== '' && <CAlert color="danger">{error}</CAlert>}

                    <CRow>
                      <CCol xs="6">
                        <CButton
                          color="primary"
                          className="px-5"
                          onClick={handleLoginButton}
                          disabled={loading}
                        >
                          {loading ? 'Carregando' : 'Entrar'}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
