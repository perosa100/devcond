import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CDataTable,
  CSwitch,
  CButton
} from '@coreui/react'
import { useEffect, useState } from 'react'
import useApi from '../../services/api'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

const fields = [
  {
    label: 'Resolvido',
    key: 'status',
    filter: true
  },
  { label: 'Unidade', key: 'name_unit', filter: true },
  {
    label: 'Título',
    key: 'title',
    filter: true
  },

  {
    label: 'Fotos',
    key: 'photos',
    filter: false,
    sorted: false
  },

  {
    label: 'Data',
    key: 'datecreated',
    filter: true
  }
]

function Warnings() {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [photoList, setPhotoList] = useState([])
  const [photoListIndex, setPhotoListIndex] = useState(0)

  const getList = async () => {
    setLoading(true)
    const result = await api.getWarnings()
    setLoading(false)

    if (result.error === '') {
      setList(result.list)
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    getList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSwitchClick(item: any) {
    setLoading(true)
    const result = await api.updateWarning(item.id)
    setLoading(false)

    if (result.error === '') {
      getList()
    } else {
      alert(result.error)
    }
  }

  function showLightBox(photos: string[]) {
    setPhotoListIndex(0)
    setPhotoList(photos)
  }

  return (
    <>
      <CRow>
        <CCol>
          <h2>Ocorrências</h2>

          <CCard>
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
                  photos: (item: any) => (
                    <td>
                      {item.photos.length > 0 && (
                        <CButton
                          color="success"
                          onClick={() => showLightBox(item.photos)}
                        >
                          {item.photos.length} foto
                          {item.photos.length !== 1 ? 's' : ''}
                        </CButton>
                      )}
                    </td>
                  ),
                  datecreated: (item: any) => (
                    <td>{item.datecreated_formatted}</td>
                  ),
                  status: (item: any) => (
                    <td>
                      <CSwitch
                        color="success"
                        checked={item.status === 'RESOLVED'}
                        onChange={() => handleSwitchClick(item)}
                      />
                    </td>
                  )
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {photoList.length > 0 && (
        <Lightbox
          mainSrc={photoList[photoListIndex]}
          nextSrc={photoList[photoListIndex + 1]}
          prevSrc={photoList[photoListIndex - 1]}
          onCloseRequest={() => setPhotoList([])}
          onMovePrevRequest={() => {
            if (photoList[photoListIndex - 1] !== undefined) {
              setPhotoListIndex(photoListIndex - 1)
            }
          }}
          onMoveNextRequest={() => {
            if (photoList[photoListIndex + 1] !== undefined) {
              setPhotoListIndex(photoListIndex + 1)
            }
          }}
          reactModalStyle={{ overlay: { zIndex: 9999 } }}
        />
      )}
    </>
  )
}
export default Warnings
