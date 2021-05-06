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
    key: 'name_unit',
    sorter: false
  },
  { label: 'Área', key: 'name_area', sorter: false },
  {
    label: 'Data da Reserva',
    key: 'reservation_date'
  },

  {
    label: 'Ações',
    key: 'actions',
    _style: { width: '1px' },
    sorter: false,
    filter: false
  }
]

function Wall() {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalId, setModalId] = useState('')
  const [error, setError] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)
  const [modalUnitList, setModalUnitList] = useState([])
  const [modalAreaList, setModalAreaList] = useState([])
  const [modalUnitId, setModalUnitId] = useState(0)
  const [modalAreaId, setModalAreaId] = useState(0)
  const [modalDateField, setModalDateField] = useState('')

  const getList = async () => {
    setLoading(true)
    const result = await api.getReservations()
    setLoading(false)

    if (result.error === '') {
      setList(result.list)
    } else {
      setLoading(false)
      alert(result.error)
    }
  }

  const getUnitList = async () => {
    const result = await api.getUnits()

    if (result.error === '') {
      setModalUnitList(result.list)
    } else {
      alert(result.error)
    }
  }

  const getAreaList = async () => {
    const result = await api.getAreas()

    if (result.error === '') {
      setModalAreaList(result.list)
    } else {
      alert(result.error)
    }
  }
  useEffect(() => {
    getList()
    getUnitList()
    getAreaList()
  }, [])

  const handleloseModal = () => {
    setShowModal(false)
  }

  const handleNewButton = () => {
    setModalId('')
    setModalUnitId(modalUnitList[0]['id'])
    setModalAreaId(modalAreaList[0]['id'])
    setModalDateField('')
    setShowModal(true)
  }

  const handleEditButton = (id: number) => {
    let index = list.findIndex((v) => v.id === id)

    setModalId(list[index]['id'])
    setModalUnitId(list[index]['id_unit'])
    setModalAreaId(list[index]['id_area'])
    setModalDateField(list[index]['reservation_date'])
    setShowModal(true)
  }

  const handleModalSave = async () => {
    if (modalDateField && modalAreaId && modalUnitId) {
      setLoadingModal(true)
      let result
      let data = {
        id_unit: modalUnitId,
        id_area: modalAreaId,
        reservation_date: modalDateField
      }

      if (modalId === '') {
        result = await api.addReservation(data)
      } else {
        result = await api.updateReservation(modalId, data)
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
          <h2>Reservas</h2>

          <CCard>
            <CCardHeader>
              <CButton
                color="primary"
                onClick={handleNewButton}
                disabled={
                  modalUnitList.length === 0 || modalAreaList.length === 0
                }
              >
                <CIcon name="cil-check" /> Nova Reserva
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
                  reservation_data: (item: any) => (
                    <td>{item.reservation_date_formatted}</td>
                  ),
                  actions: (item: any, index: number) => (
                    <td>
                      <CButtonGroup key={index}>
                        <CButton
                          color="info"
                          onClick={() => handleEditButton(item.id)}
                          disabled={
                            modalUnitList.length === 0 ||
                            modalAreaList.length === 0
                          }
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
          {modalId === '' ? 'Nova ' : 'Editar '}Reserva
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
          {/*  */}

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

export default Wall
