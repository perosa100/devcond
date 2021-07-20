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
  CModalHeader,
  CModalBody,
  CFormGroup,
  CLabel,
  CInput,
  CAlert,
  CModalFooter
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'

import useApi from '../../services/api'

const fields = [
  { label: 'Título', key: 'title' },
  { label: 'Ações', key: 'actions', _style: { width: '1px' } }
]

function Reservations() {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalTitleField, setModalTitleField] = useState('')
  const [modalId, setModalId] = useState('')
  const [error, setError] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)
  const [showModalPdf, setShowModalPdf] = useState(false)
  const [urlPDF, setUrlPDF] = useState('')
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [modalFileField, setModalFileField] = useState<File>()

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages)
  }

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
    setShowModalPdf(false)
  }

  const handleNewButton = () => {
    setModalId('')
    setModalFileField(null)
    setModalTitleField('')
    setShowModal(true)
  }

  const handleEditButton = (id: string) => {
    let index = list.findIndex((v) => v.id === id)

    setModalId(list[index]['id'])
    setModalTitleField(list[index]['title'])
    setShowModal(true)
  }

  const handleModalSave = async () => {
    if (modalTitleField) {
      setLoadingModal(true)

      let result
      let data: any = {
        title: modalTitleField
      }

      if (modalId === '') {
        if (modalFileField) {
          data.file = modalFileField
          result = await api.addDocument(data)
        } else {
          alert('Selecione o arquivo')
          setLoadingModal(false)
          return
        }
      } else {
        if (modalFileField) {
          data.file = modalFileField
        }
        result = await api.updateDocument(modalId, data)
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
      const result = await api.removeDocument(id)

      if (result.error === '') {
        getList()
      } else {
        alert(result.error)
      }
    }
  }

  const handleEveButton = (index: number) => {
    setShowModalPdf(true)
    setUrlPDF(list[index]['fileurl'])
  }

  const handleDownloadButton = (id: string) => {
    let index = list.findIndex((v) => v.id === id)
    window.open(list[index]['fileurl'])
  }

  return (
    <>
      <CRow>
        <CCol>
          <h2>Documentos</h2>

          <CCard>
            <CCardHeader>
              <CButton color="primary" onClick={handleNewButton}>
                <CIcon name="cil-check" /> Novo Documento
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
                    <td key={index}>
                      <CButtonGroup>
                        <CButton
                          color="success"
                          onClick={() => handleEveButton(item.id)}
                        >
                          Visualizar
                        </CButton>
                        <CButton
                          color="warning"
                          onClick={() => handleDownloadButton(item.id)}
                          className="d-flex"
                        >
                          <CIcon name="cil-cloud-download" />
                          Baixar
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
          {modalId === '' ? 'Novo ' : 'Editar '}Documento
        </CModalHeader>
        <CModalBody>
          <CFormGroup>
            <CLabel htmlFor="modal-title">Título do documento</CLabel>
            <CInput
              type="text"
              id="modal-title"
              placeholder="Digite um título para o documento"
              value={modalTitleField}
              disabled={loading}
              onChange={(e: any) => setModalTitleField(e.target.value)}
            />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="modal-file">Arquivo (pdf)</CLabel>
            <CInput
              type="file"
              id="modal-file"
              name="file"
              placeholder="Escolha um arquivo"
              disabled={loading}
              onChange={(e: any) => setModalFileField(e.target.files[0])}
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

      <CModal
        show={showModalPdf}
        onClose={handleloseModal}
        size="lg"
        scrollable
        centered
      >
        <CModalHeader closeButton>Visão PDF</CModalHeader>
        <CModalBody>
          <Document
            file={{ url: urlPDF }}
            onLoadSuccess={onDocumentLoadSuccess}
            renderMode="canvas"
            loading={<div>Carregando</div>}
            className="d-flex justify-content-center al-top"
          >
            <p>
              Page {pageNumber} of {numPages}
            </p>
            <Page
              pageNumber={pageNumber}
              onLoadProgress={({ loaded, total }) =>
                alert('Loading a document: ' + (loaded / total) * 100 + '%')
              }
            />
          </Document>
        </CModalBody>
      </CModal>
    </>
  )
}

export default Reservations
