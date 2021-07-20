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
  CSwitch,
  CInputCheckbox
} from '@coreui/react'
import { useEffect, useState } from 'react'
import useApi from '../../services/api'
const fields = [
  {
    label: 'Ativo',
    key: 'allowed',
    sorter: true,
    filter: true
  },
  { label: 'Capa', key: 'cover', sorter: false, filter: false },
  {
    label: 'Título',
    key: 'title',
    sorter: true,
    filter: true
  },

  {
    label: 'Dias de Funcionamento',
    key: 'days',
    sorter: true,
    filter: true
  },
  {
    label: 'Horário de Início',
    key: 'start_time',
    sorter: true,
    filter: true
  },
  {
    label: 'Horário de fim',
    key: 'end_time',
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

export type CommonsAreaRequest = {
  allowed: number
  cover?: string
  days: string
  end_time: string
  id?: string
  start_time: string
  title: string
}

function CommonAreas() {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<CommonsAreaRequest[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalId, setModalId] = useState('')
  const [error, setError] = useState('')

  const [modalAllowedField, setModalAllowedField] = useState(1)
  const [modalTitleField, setModalTitleField] = useState('')
  const [modalCoverField, setModalCoverField] = useState('')
  const [modalDaysField, setModalDaysField] = useState([])
  const [modalStartTimeField, setModalStartTimeField] = useState('')
  const [modalEndTimeField, setModalEndTimeField] = useState('')

  const [loadingModal, setLoadingModal] = useState(false)

  const getList = async () => {
    setLoading(true)
    const result = await api.getAreas()
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
    setModalAllowedField(1)
    setModalTitleField('')
    setModalCoverField('')
    setModalDaysField([])
    setModalStartTimeField('')
    setModalEndTimeField('')
    setShowModal(true)
  }

  const handleEditButton = (id: string) => {
    let index = list.findIndex((v) => v.id === id)

    setModalId(list[index]['id'])
    setModalAllowedField(list[index]['allowed'])
    setModalTitleField(list[index]['title'])
    setModalCoverField('')
    setModalDaysField(list[index]['days'].split(','))
    setModalStartTimeField(list[index]['start_time'])
    setModalEndTimeField(list[index]['end_time'])
    setShowModal(true)
  }
  console.log(list)

  const handleModalSave = async () => {
    if (modalTitleField && modalStartTimeField && modalEndTimeField) {
      setLoadingModal(true)
      let data: CommonsAreaRequest = {
        allowed: modalAllowedField,
        title: modalTitleField,
        days: modalDaysField.join(','),
        start_time: modalStartTimeField,
        end_time: modalEndTimeField
      }

      if (modalCoverField) {
        data.cover = modalCoverField
      }

      let result

      if (modalId === '') {
        result = await api.addArea(data)
      } else {
        result = await api.updateArea(modalId, data)
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
      const result = await api.removeArea(id)

      if (result.error === '') {
        getList()
      } else {
        alert(result.error)
      }
    }
  }
  async function handleSwitchClick(item: CommonsAreaRequest) {
    setLoading(true)

    const result = await api.updateAreaAllowerd(item.id)
    setLoading(false)

    if (result.error === '') {
      setShowModal(false)
      getList()
    } else {
      alert(result.error)
      setError(result.error)
    }
  }

  function handleModalSwitchClick() {
    setModalAllowedField(1 - modalAllowedField)
  }

  function toogleModalDays(item: string, event: any) {
    let days = [...modalDaysField]

    if (event.target.checked === false) {
      days = days.filter((day) => day !== item)
    } else {
      days.push(item)
    }
    setModalDaysField(days)
  }
  return (
    <>
      <CRow>
        <CCol>
          <h2>Áreas Comuns</h2>

          <CCard>
            <CCardHeader>
              <CButton color="primary" onClick={handleNewButton}>
                <CIcon name="cil-check" /> Nova Área Comum
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
                  allowed: (item: CommonsAreaRequest) => (
                    <td>
                      <CSwitch
                        color="success"
                        checked={Boolean(item.allowed)}
                        onChange={() => handleSwitchClick(item)}
                      />
                    </td>
                  ),
                  cover: (item: CommonsAreaRequest) => (
                    <td>
                      <img src={item.cover} alt="pho Cover" width={100} />
                    </td>
                  ),
                  days: (item: CommonsAreaRequest) => {
                    let daysWords = [
                      'Segunda',
                      'Terça',
                      ' Quarta',
                      'Quinta',
                      'Sexta',
                      'Sábado',
                      'Domingo'
                    ]
                    let days = item.days.split(',')
                    let dayString = []
                    for (let i in days) {
                      if (days[i] && daysWords[Number(days[i])]) {
                        dayString.push(daysWords[Number(days[i])])
                      }
                    }
                    return <td>{dayString.join(', ')}</td>
                  },
                  actions: (item: CommonsAreaRequest, index: number) => (
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
          {modalId === '' ? 'Nova ' : 'Editar '}Área Comum
        </CModalHeader>
        <CModalBody>
          <CFormGroup>
            <CLabel htmlFor="modal-allowed">Ativo</CLabel>
            <br />
            <CSwitch
              color="success"
              checked={Boolean(modalAllowedField)}
              onChange={handleModalSwitchClick}
            />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="modal-title">Título</CLabel>
            <CInput
              type="text"
              id="modal-title"
              name="title"
              value={modalTitleField}
              onChange={(e: any) => setModalTitleField(e.target.value)}
            />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="modal-cover">Capa</CLabel>
            <CInput
              type="file"
              id="modal-cover"
              name="cover"
              onChange={(e: any) => setModalCoverField(e.target.files[0])}
            />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="modal-days">Dias de Funcionamento</CLabel>
            <div style={{ marginLeft: '20px' }}>
              <div>
                <CInputCheckbox
                  id="modal-days-0"
                  name="modal-days"
                  value={0}
                  checked={modalDaysField.includes('0')}
                  onChange={(event) => toogleModalDays('0', event)}
                />
                <CLabel htmlFor="modal-days-0">Segunda-Feira</CLabel>
              </div>

              <div>
                <CInputCheckbox
                  id="modal-days-1"
                  name="modal-days"
                  value={1}
                  checked={modalDaysField.includes('1')}
                  onChange={(event) => toogleModalDays('1', event)}
                />
                <CLabel htmlFor="modal-days-1">Terça-Feira</CLabel>
              </div>

              <div>
                <CInputCheckbox
                  id="modal-days-2"
                  name="modal-days"
                  value={2}
                  checked={modalDaysField.includes('2')}
                  onChange={(event) => toogleModalDays('2', event)}
                />
                <CLabel htmlFor="modal-days-2">Quarta-Feira</CLabel>
              </div>

              <div>
                <CInputCheckbox
                  id="modal-days-3"
                  name="modal-days"
                  value={3}
                  checked={modalDaysField.includes('3')}
                  onChange={(event) => toogleModalDays('3', event)}
                />
                <CLabel htmlFor="modal-days-3">Quinta-Feira</CLabel>
              </div>

              <div>
                <CInputCheckbox
                  id="modal-days-4"
                  name="modal-days"
                  value={4}
                  checked={modalDaysField.includes('4')}
                  onChange={(event) => toogleModalDays('4', event)}
                />
                <CLabel htmlFor="modal-days-4">Sexta-Feira</CLabel>
              </div>

              <div>
                <CInputCheckbox
                  id="modal-days-5"
                  name="modal-days"
                  value={5}
                  checked={modalDaysField.includes('5')}
                  onChange={(event) => toogleModalDays('5', event)}
                />
                <CLabel htmlFor="modal-days-5">Sábado</CLabel>
              </div>

              <div>
                <CInputCheckbox
                  id="modal-days-6"
                  name="modal-days"
                  value={6}
                  checked={modalDaysField.includes('6')}
                  onChange={(event) => toogleModalDays('6', event)}
                />
                <CLabel htmlFor="modal-days-6">Domingo</CLabel>
              </div>
            </div>
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="modal-start-time">Horário Início</CLabel>
            <CInput
              type="time"
              id="modal-start-time"
              name="start_time"
              value={modalStartTimeField}
              onChange={(e: any) => setModalStartTimeField(e.target.value)}
            />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="modal-end-time">Horário Fim</CLabel>
            <CInput
              type="time"
              id="modal-end-time"
              name="end_time"
              value={modalEndTimeField}
              onChange={(e: any) => setModalEndTimeField(e.target.value)}
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

export default CommonAreas
