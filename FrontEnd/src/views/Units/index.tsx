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

const fields = [
  {
    label: 'Unidade',
    key: 'name',
    sorter: true,
    filter: true
  },
  { label: 'Proprietário', key: 'name_owner', sorter: true, filter: true },
  {
    label: 'Ações',
    key: 'actions',
    _style: { width: '1px' },
    sorter: false,
    filter: false
  }
]

let timer: NodeJS.Timeout
function Units() {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loadingModal, setLoadingModal] = useState(false)

  const [modalId, setModalId] = useState('')
  const [error, setError] = useState('')
  const [modalNameField, setModalNameField] = useState('')
  const [modalOwnerSearchField, setModalOwnerSearchField] = useState('')
  const [modalOwnerList, setModalOwnerList] = useState([])
  const [modalOwnerField, setModalOwnerField] = useState(null)

  const getList = async () => {
    setLoading(true)
    const result = await api.getUnits()
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

  const searchUser = async () => {
    if (modalOwnerSearchField !== '') {
      const result = await api.searchQuery(modalOwnerSearchField)

      if (result.error === '') {
        setModalOwnerList(result.list)
      } else {
        alert(result.error)
      }
    }
  }

  useEffect(() => {
    if (modalOwnerSearchField !== '') {
      clearTimeout(timer)
      timer = setTimeout(searchUser, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOwnerSearchField])

  const handleloseModal = () => {
    setShowModal(false)
  }

  const handleNewButton = () => {
    setModalId('')
    setModalNameField('')
    setModalOwnerField(null)
    setModalOwnerList([])
    setModalOwnerSearchField('')
    setShowModal(true)
  }

  const handleEditButton = (id: number) => {
    let index = list.findIndex((v) => v.id === id)

    setModalId(list[index]['id'])
    setModalNameField(list[index]['name'])
    setModalOwnerField([])
    setModalOwnerField(list[index]['id'])
    setModalOwnerSearchField('')
    if (list[index]['name_owner']) {
      setModalOwnerField({
        name: list[index]['name_owner'],
        id: list[index]['id_owner']
      })
    } else {
      setModalOwnerField(null)
    }

    setShowModal(true)
  }

  const handleModalSave = async () => {
    if (modalNameField) {
      setLoadingModal(true)
      let result
      let data = {
        name: modalNameField,
        id_owner: modalOwnerField.id
      }

      if (modalId === '') {
        result = await api.addUnit(data)
      } else {
        result = await api.updateUnit(modalId, data)
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

  const handleRemoveButton = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      const result = await api.removeUnit(id)

      if (result.error === '') {
        getList()
      } else {
        alert(result.error)
      }
    }
  }

  const selectModalOwnerField = (id: number) => {
    // eslint-disable-next-line eqeqeq
    let item = modalOwnerList.find((item) => item.id == id)

    setModalOwnerField(item)
    setModalOwnerList([])
    setModalOwnerSearchField('')
  }

  return (
    <>
      <CRow>
        <CCol>
          <h2>Unidades</h2>

          <CCard>
            <CCardHeader>
              <CButton color="primary" onClick={handleNewButton}>
                <CIcon name="cil-check" /> Nova Unidade
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
                  name_owner: (item: any) => <td>{item.name_owner ?? ''}</td>,
                  actions: (item: any, index: number) => (
                    <td>
                      <CButtonGroup key={index}>
                        <CButton color="success" onClick={null}>
                          Detalhes
                        </CButton>
                        <CButton
                          color="info"
                          onClick={() => handleEditButton(item.id)}
                        >
                          Editar
                        </CButton>
                        <CButton
                          color="danger"
                          onClick={() => handleRemoveButton(item.id)}
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
          {modalId === '' ? 'Nova ' : 'Editar '}Unidade
        </CModalHeader>
        <CModalBody>
          <CFormGroup>
            <CLabel htmlFor="modal-name">Nome da Unidade</CLabel>
            <CInput
              type="text"
              id="modal-name"
              value={modalNameField}
              onChange={(e: any) => setModalNameField(e.target.value)}
              disabled={loading}
            />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="modal-owner">
              Proprietário(Nome,cpf ou e-mail)
            </CLabel>
            {modalOwnerField === null && (
              <>
                <CInput
                  type="text"
                  id="modal-owner"
                  value={modalOwnerSearchField}
                  onChange={(e: any) =>
                    setModalOwnerSearchField(e.target.value)
                  }
                  disabled={loading}
                />

                {modalOwnerList.length > 0 && (
                  <CSelect
                    sizeHtml={5}
                    onChange={(e: any) => selectModalOwnerField(e.target.value)}
                  >
                    {modalOwnerList.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </CSelect>
                )}
              </>
            )}

            {modalOwnerField !== null && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'right'
                }}
              >
                <br />
                <CButton
                  size="sm"
                  color="danger"
                  style={{ marginRight: '5px' }}
                  onClick={() => setModalOwnerField(null)}
                >
                  X
                </CButton>
                {modalOwnerField.name}
              </div>
            )}
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

export default Units
