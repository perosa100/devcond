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
    label: 'Recuperado',
    key: 'status',
    filter: true
  },
  { label: 'Local encontrado', key: 'where', filter: true, sort: true },
  {
    label: 'Descrição',
    key: 'description',
    filter: true,
    sort: true
  },
  {
    label: 'Fotos',
    key: 'photo',
    filter: false,
    sorted: false
  },

  {
    label: 'Data',
    key: 'datecreated',
    filter: true,
    sort: true
  }
]

function FoundAndLost() {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [photoUrl, setPhotoUrl] = useState('')

  const getList = async () => {
    setLoading(true)
    const result = await api.getFoundAndLost()
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
    const result = await api.updateFoundAndLost(item.id)
    setLoading(false)

    if (result.error === '') {
      getList()
    } else {
      alert(result.error)
    }
  }

  function showLightBox(photo: string) {
    setPhotoUrl(photo)
  }

  return (
    <>
      <CRow>
        <CCol>
          <h2>Achados e Perdidos</h2>

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
                  photo: (item: any) => (
                    <td>
                      {item.photo && (
                        <CButton
                          color="success"
                          onClick={() => showLightBox(item.photo)}
                        >
                          Ver foto
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
                        checked={item.status === 'recovered'}
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

      {photoUrl && (
        <Lightbox
          mainSrc={photoUrl}
          onCloseRequest={() => setPhotoUrl('')}
          reactModalStyle={{ overlay: { zIndex: 9999 } }}
        />
      )}
    </>
  )
}
export default FoundAndLost
