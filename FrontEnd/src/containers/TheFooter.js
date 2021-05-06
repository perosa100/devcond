import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a
          href="https://www.linkedin.com/in/patrick-perosa-4950b434/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Linkedin
        </a>
        <span className="ml-1">&copy; 2021 </span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Powered by</span>
        <a
          href="https://github.com/perosa100"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Patrick Perosa
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
