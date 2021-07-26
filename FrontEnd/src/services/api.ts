import { UserResponse } from 'views/Users'

const baseUrl = 'https://api.b7web.com.br/devcond/api/admin'

const request = async (
  method: any,
  endpoint: any,
  params: any,
  token: any = null
) => {
  method = method.toLowerCase()
  let fullUrl = `${baseUrl}${endpoint}`
  let body = null

  switch (method) {
    case 'get':
      let queryString = new URLSearchParams(params).toString()
      fullUrl += `?${queryString}`
      break
    case 'post':
    case 'put':
    case 'delete':
      body = JSON.stringify(params)
      break
    default:
      break
  }

  let headers: any = { 'Content-Type': 'application/json' }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let req = await fetch(fullUrl, { method, headers, body })
  let json = await req.json()

  return json
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  let token = localStorage.getItem('@token/conddev')

  return {
    getToken: () => {
      return localStorage.getItem('@token/conddev')
    },

    validadeToken: async () => {
      let json = await request('post', '/auth/validate', {}, token)
      return json
    },

    login: async (email: string, password: string) => {
      let json = await request('post', '/auth/login', { email, password })
      return json
    },
    logout: async () => {
      let json = await request('post', '/auth/logout', {}, token)
      localStorage.removeItem('@token/conddev')
      return json
    },

    getWall: async () => {
      let json = await request('get', '/walls', {}, token)
      return json
    },
    updateWall: async (id: string, data: { title: string; body: string }) => {
      let json = await request('put', `/wall/${id}`, data, token)
      return json
    },
    addWall: async (data: { title: string; body: string }) => {
      let json = await request('post', `/walls`, data, token)
      return json
    },

    removeWall: async (id: string) => {
      let json = await request('delete', `/wall/${id}`, {}, token)
      return json
    },
    getDocuments: async () => {
      let json = await request('get', `/docs`, {}, token)
      return json
    },
    addDocument: async (data: { title: string; file: File }) => {
      let formData = new FormData()
      formData.append('title', data.title)
      if (data.file) {
        formData.append('file', data.file)
      }

      let req = await fetch(`${baseUrl}/docs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      let json = await req.json()

      return json
    },
    updateDocument: async (id: string, data: { title: string; file: File }) => {
      let formData = new FormData()
      formData.append('title', data.title)
      if (data.file) {
        formData.append('file', data.file)
      }

      let req = await fetch(`${baseUrl}/doc/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      let json = await req.json()

      return json
    },

    removeDocument: async (id: string) => {
      let json = await request('delete', `/doc/${id}`, {}, token)
      return json
    },
    getReservations: async () => {
      let json = await request('get', `/reservations`, {}, token)
      return json
    },
    getUnits: async () => {
      let json = await request('get', `/units`, {}, token)
      return json
    },
    getAreas: async () => {
      let json = await request('get', `/areas`, {}, token)
      return json
    },
    addReservation: async (data: {
      id_unit: number
      id_area: number
      reservation_date: string
    }) => {
      let json = await request('post', `/reservations`, data, token)
      return json
    },
    updateReservation: async (
      id: string,
      data: {
        id_unit: number
        id_area: number
        reservation_date: string
      }
    ) => {
      let json = await request('put', `/reservation/${id}`, data, token)
      return json
    },
    removeReservation: async (id: string) => {
      let json = await request('delete', `/reservation/${id}`, {}, token)
      return json
    },
    getWarnings: async () => {
      let json = await request('get', `/warnings`, {}, token)
      return json
    },
    updateWarning: async (id: string) => {
      let json = await request('put', `/warning/${id}`, {}, token)
      return json
    },
    getFoundAndLost: async () => {
      let json = await request('get', `/foundandlost`, {}, token)
      return json
    },
    updateFoundAndLost: async (id: string) => {
      let json = await request('put', `/foundandlost/${id}`, {}, token)
      return json
    },
    getUsers: async () => {
      let json = await request('get', `/users`, {}, token)
      return json
    },
    addUsers: async (data: UserResponse) => {
      let json = await request('post', `/users`, data, token)
      return json
    },
    updateUsers: async (id: string, data: UserResponse) => {
      let json = await request('put', `/user/${id}`, data, token)
      return json
    },
    removeUsers: async (id: string) => {
      let json = await request('delete', `/user/${id}`, {}, token)
      return json
    },
    addArea: async (data: any) => {
      console.log(data, 'data comoom')

      let formData = new FormData()

      for (let i in data) {
        formData.append(i, data[i])
      }
      let req = await fetch(`${baseUrl}/areas`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })
      console.log(req, 'req')

      let json = await req.json()

      return json
    },
    updateArea: async (id: string, data: any) => {
      let formData = new FormData()

      for (let i in data) {
        formData.append(i, data[i])
      }

      let req = await fetch(`${baseUrl}/area/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      let json = await req.json()

      return json
    },
    updateAreaAllowerd: async (id: string) => {
      let json = await request('put', `/area/${id}/allowed`, {}, token)
      return json
    },
    removeArea: async (id: string) => {
      let json = await request('delete', `/area/${id}`, {}, token)
      return json
    },
    searchQuery: async (query: string) => {
      let json = await request('get', `/users/search`, { q: query }, token)
      return json
    },
    addUnit: async (data: any) => {
      let json = await request('post', `/units`, data, token)
      return json
    },
    updateUnit: async (id: string, data: any) => {
      let json = await request('put', `/unit/${id}`, data, token)
      return json
    },
    removeUnit: async (id: string) => {
      let json = await request('delete', `/unit/${id}`, {}, token)
      return json
    }
  }
}
