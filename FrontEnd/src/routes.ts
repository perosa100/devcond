import CommonAreas from 'views/CommonAreas'
import Dashboard from 'views/Dashboard'
import Reservations from 'views/Documents'
import Documents from 'views/Documents'
import FoundAndLost from 'views/FoundAndLost'
import Logout from 'views/Logout'
import Wall from 'views/Reservations'
import Units from 'views/Units'
import Users from 'views/Users'
import Warnings from 'views/Warnings'

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/logout', name: 'Logout', component: Logout },
  { path: '/wall', name: 'Wall', component: Wall },
  { path: '/documents', name: 'Documents', component: Documents },
  { path: '/reservations', name: 'Reservations', component: Reservations },
  { path: '/warnings', name: 'Warnings', component: Warnings },
  { path: '/foundAndLost', name: 'FoundAndLost', component: FoundAndLost },
  { path: '/users', name: 'Users', component: Users },
  { path: '/commonAreas', name: 'CommonAreas', component: CommonAreas },
  { path: '/units', name: 'Units', component: Units }
]

export default routes
