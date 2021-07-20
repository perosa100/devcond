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
  CTextarea,
  CAlert
} from '@coreui/react'
import { useEffect, useState } from 'react'
import useApi from '../../services/api'
const fields = [
  { label: 'Título', key: 'title', _style: { width: '70%' } },
  { label: 'Data de criação', key: 'datecreated' },
  { label: 'Ações', key: 'actions', _style: { width: '1px' } }
]

function Wall() {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalTitleField, setModalTitleField] = useState('')
  const [modalBodyField, setModalBodyField] = useState('')
  const [modalId, setModalId] = useState('')
  const [error, setError] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)

  const getList = async () => {
    setLoading(true)
    const result = await api.getDocuments()
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
    setModalBodyField('')
    setModalTitleField('')
    setShowModal(true)
  }

  const handleEditButton = (id: string) => {
    let index = list.findIndex((v) => v.id === id)
    setModalId(list[index]['id'])
    setModalTitleField(list[index]['title'])
    setModalBodyField(list[index]['body'])
    setShowModal(true)
  }

  const handleModalSave = async () => {
    if (modalTitleField && modalBodyField) {
      setLoadingModal(true)

      let result
      let data = {
        title: modalTitleField,
        body: modalBodyField
      }

      if (modalId === '') {
        result = await api.addWall(data)
      } else {
        result = await api.updateWall(modalId, data)
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
      const result = await api.removeWall(id)

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
          <h2>Mural de Avisos</h2>

          <CCard>
            <CCardHeader>
              <CButton color="primary" onClick={handleNewButton}>
                <CIcon name="cil-check" /> Novo aviso
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={list}
                fields={fields}
                loading={loading}
                noItemsViewSlot=" "
                hover
                striped
                pagination
                itemsPerPage={2}
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
          {modalId === '' ? 'Novo ' : 'Editar '}Aviso
        </CModalHeader>
        <CModalBody>
          <CFormGroup>
            <CLabel htmlFor="modal-title">Título do aviso</CLabel>
            <CInput
              type="text"
              id="modal-title"
              placeholder="Digite um título para o aviso"
              value={modalTitleField}
              disabled={loading}
              onChange={(e: any) => setModalTitleField(e.target.value)}
            />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="modal-title">Corpo do aviso</CLabel>
            <CTextarea
              id="modal-body"
              placeholder="Digite um conteúdo do aviso"
              value={modalBodyField}
              disabled={loading}
              onChange={(e: any) => setModalBodyField(e.target.value)}
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
