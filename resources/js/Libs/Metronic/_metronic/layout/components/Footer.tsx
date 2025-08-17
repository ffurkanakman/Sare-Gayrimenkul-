

import {FC} from 'react'
// @ts-ignore
import clsx from 'clsx'
import {useLayout} from '../core'

const Footer: FC = () => {
  const {classes} = useLayout()
  return (
    <div className={'footer py-4 d-flex flex-lg-column'} id='kt_footer'>
      {/*begin::Container*/}
      <div className={clsx(classes.footerContainer, 'd-flex flex-column flex-md-row flex-stack')}>
        {/*begin::Copyright*/}
        <div className='text-gray-900 order-2 order-md-1'>
          <span className='text-gray-500 fw-bold me-1'>Created by</span>
          <a
            href='https://msyyazilim.com'
            target='_blank'
            className='text-muted text-hover-primary fw-bold me-2 fs-6'
          >
            MASA Tech
          </a>
        </div>
        <ul className='menu menu-gray-600 menu-hover-primary fw-bold order-1'>
          <li className='menu-item'>
            <a href='https://msyyazilim.com' target='_blank' className='menu-link px-2'>
              Hakkımızda
            </a>
          </li>

          <li className='menu-item'>
            <a href='https://msyyazilim.com' target='_blank' className='menu-link px-2'>
                Destek
            </a>
          </li>
        </ul>
        {/*end::Menu*/}
      </div>
      {/*end::Container*/}
    </div>
  )
}

export {Footer}
