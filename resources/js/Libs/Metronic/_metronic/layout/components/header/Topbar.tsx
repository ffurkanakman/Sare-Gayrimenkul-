
import {FC} from 'react'
import {KTIcon} from '../../../helpers'
import {ThemeModeSwitcher} from '../../../partials'
import { ROUTES } from '../../../../../Routes/config';
import {Link} from "react-router-dom";

const Topbar: FC = () => (
  <div className='d-flex flex-shrink-0'>
    {/* begin::Invite user */}
    <div className='d-flex ms-3'>
      <Link
        to={ROUTES.UI.NEW_USER}
        className='btn btn-flex flex-center bg-body btn-color-gray-700 btn-active-color-fsh-primary w-40px w-md-auto h-40px px-0 px-md-6'
      >
        <KTIcon iconName='plus' className='fs-2 text-fsh-primary me-0 me-md-2' />
        <span className='d-none d-md-inline'>Yeni Kullanıcı</span>
      </Link>
    </div>
    {/* end::Invite user */}

    {/* begin::Theme mode */}
    <div className='d-flex align-items-center  ms-3'>
      <ThemeModeSwitcher toggleBtnClass=' flex-center bg-body btn-color-gray-600 btn-active-color-fsh-primary h-40px' />
    </div>
    {/* end::Theme mode */}

    {/* CHAT */}
    <div className='d-flex align-items-center ms-3'>
      {/* begin::Menu wrapper */}
      <div
        className='btn btn-icon btn-fsh-primary w-40px h-40px pulse pulse-white'
        id='kt_drawer_chat_toggle'
      >
        <KTIcon iconName='message-text-2' className='fs-2' />
        <span className='pulse-ring' />
      </div>
      {/* end::Menu wrapper */}
    </div>
  </div>
)

export {Topbar}
