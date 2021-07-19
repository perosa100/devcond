import CIcon from '@coreui/icons-react'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CButton,
  CCardBody,
  CDataTable,
  CButtonGroup,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CFormGroup,
  CInput,
  CLabel,
  CAlert,
  CSelect
} from '@coreui/react'
import { useEffect, useState } from 'react'
import useApi from '../../services/api'

export type UserResponse = {
  name: string
  email: string
  cpf: string
  password?: string
}

const fields = [
  {
    key: 'name',
    label: 'Nome',
    sorter: true,
    filter: true
  },
  {
    key: 'email',
    label: 'E-mail',
    sorter: true,
    filter: true
  },
  {
    key: 'cpf',
    label: 'CPF',
    sorter: true,
    filter: true
  },
  {
    label: 'Ações',
    key: 'actions',
    _style: { width: '1px' },
    sorter: false,
    filter: false
  }
]

function Users() {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loadingModal, setLoadingModal] = useState(false)
  const [modalId, setModalId] = useState('')
  const [error, setError] = useState('')

  const [modalNameField, setModalNameField] = useState('')
  const [modalCPFField, setModalCPFField] = useState('')
  const [modalEmailField, setModalEmailField] = useState('')
  const [modalPasswordField, setModalPasswordField] = useState('')
  const [modalPasswordConfirmField, setModalPasswordConfirmField] = useState('')

  const getList = async () => {
    setLoading(true)
    const result = await api.getUsers()
    setLoading(false)

    if (result.error === '') {
      setList(result.list)
    } else {
      setLoading(false)
      alert(result.error)
    }
  }

  useEffect(() => {
    getList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleloseModal = () => {
    setShowModal(false)
  }

  const handleNewButton = () => {
    setModalId('')

    setModalId('')
    setModalNameField('')
    setModalCPFField('')
    setModalEmailField('')
    setModalPasswordField('')
    setModalPasswordConfirmField('')
    setShowModal(true)
  }

  const handleEditButton = (id: number) => {
    let index = list.findIndex((v) => v.id === id)

    setModalId(list[index]['id'])
    setModalNameField(list[index]['name'])
    setModalCPFField(list[index]['cpf'])
    setModalEmailField(list[index]['email'])
    setModalPasswordField('')
    setModalPasswordConfirmField('')
    setShowModal(true)
  }

  const handleModalSave = async () => {
    if (modalNameField && modalCPFField && modalEmailField) {
      setLoadingModal(true)
      let result
      let data: UserResponse = {
        name: modalNameField,
        email: modalEmailField,
        cpf: modalCPFField
      }

      if (modalPasswordField) {
        if (modalPasswordField === modalPasswordConfirmField) {
          data.password = modalPasswordField
        } else {
          alert('Senha nao confere')
          setLoadingModal(false)
        }
      }
      if (modalId === '') {
        result = await api.addUsers(data)
      } else {
        result = await api.updateUsers(modalId, data)
      }

      setLoadingModal(false)

      if (result.error === '') {
        setShowModal(false)
        getList()
      } else {
        setError(result.error)
      }
    } else {
      setError('Preencha os Campos')
    }
  }

  const handleRemoveButton = async (index: number) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      const result = await api.removeReservation(list[index]['id'])

      if (result.error === '') {
        getList()
      } else {
        alert(result.error)
      }
    }
  }
  return (
    <>
      <CRow>
        <CCol>
          <h2>Usuários Cadastrados</h2>

          <CCard>
            <CCardHeader>
              <CButton color="primary" onClick={handleNewButton}>
                <CIcon name="cil-check" /> Novo Usuário
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={list}
                fields={fields}
                loading={loading}
                noItemsViewSlot=" "
                columnFilter
                sorter
                hover
                striped
                pagination
                itemsPerPage={10}
                scopedSlots={{
                  actions: (item: any, index: number) => (
                    <td>
                      <CButtonGroup key={index}>
                        <CButton
                          color="info"
                          onClick={() => handleEditButton(item.id)}
                        >
                          Editar
                        </CButton>
                        <CButton
                          color="danger"
                          onClick={() => handleRemoveButton(index)}
                        >
                          Excluir
                        </CButton>
                      </CButtonGroup>
                    </td>
                  )
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal show={showModal} onClose={handleloseModal}>
        <CModalHeader closeButton>
          {modalId === '' ? 'Nova ' : 'Editar '}Usuário
        </CModalHeader>
        <CModalBody>
          <CFormGroup>
            <CLabel htmlFor="modal-title">Unidade</CLabel>
            <CSelect
              id="modal-unit"
              onChange={(e: any) => setModalUnitId(e.target.value)}
              value={modalUnitId}
            >
              {modalUnitList.map((item: any, index: any) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </CSelect>
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="modal-title">Área</CLabel>
            <CSelect
              id="modal-area"
              onChange={(e: any) => setModalAreaId(e.target.value)}
              value={modalAreaId}
            >
              {modalAreaList.map((item: any, index: any) => (
                <option key={index} value={item.id}>
                  {item.title}
                </option>
              ))}
            </CSelect>
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="modal-date">Data da Reserva</CLabel>
            <CInput
              type="text"
              id="modal-date"
              value={modalDateField}
              onChange={(e: any) => setModalDateField(e.target.value)}
              disabled={loading}
            />
          </CFormGroup>

          {error !== '' && <CAlert color="danger">{error}</CAlert>}
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleModalSave} disabled={loading}>
            {loadingModal ? 'Salvando' : 'Salvar'}
          </CButton>
          <CButton color="secondary" onClick={handleloseModal}>
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Users
