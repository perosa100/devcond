import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'))

// Pages
const Login = React.lazy(() => import('./views/login/Login'))

const App = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={loading}>
        <Switch>
          <Route exact path="/login" render={(props) => <Login {...props} />} />

          <Route path="/" render={(props) => <TheLayout {...props} />} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  )
}

export default App
