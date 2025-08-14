import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {HeaderNotificationsMenu, HeaderUserMenu, QuickLinks} from '../../../partials'
import {Link} from 'react-router-dom'

const AsideFooter = () => {
    return (
        <div
            className='aside-footer d-flex flex-column align-items-center flex-column-auto'
            id='kt_aside_footer'
        >
            {/* Quick links (menü tetikleyici + menü) */}
            <div className='d-flex align-items-center mb-2'>
                {/* Menü tetikleyici */}
                <div
                    className='btn btn-icon btn-active-color-fsh-primary btn-color-gray-500 btn-active-light'
                    data-kt-menu-trigger='click'
                    data-kt-menu-overflow='true'
                    data-kt-menu-placement='top-start'
                    data-bs-toggle='tooltip'
                    data-bs-placement='right'
                    title='Quick links'
                >
                    <KTIcon iconName='element-plus' className='fs-2 text-lg-1' />
                </div>

                {/* Menü içeriği (kendi içinde <a> barındırır, dıştan sarmalama yok) */}
                <QuickLinks backgroundUrl='/media/misc/pattern-1.jpg' />

                {/* İstiyorsan ayrı bir kısa yol butonu */}
                <Link
                    to='/AraclarListesi'
                    className='btn btn-icon btn-color-gray-500 btn-active-color-fsh-primary ms-2'
                    title='Araçlar Listesi'
                >
                    <KTIcon iconName='car' className='fs-2 text-lg-1' />
                </Link>
            </div>

            {/* Activities */}
            <div className='d-flex align-items-center mb-3'>
                <div
                    className='btn btn-icon btn-active-color-fsh-primary btn-color-gray-500 btn-active-light'
                    data-kt-menu-trigger='click'
                    data-kt-menu-overflow='true'
                    data-kt-menu-placement='top-start'
                    data-bs-toggle='tooltip'
                    data-bs-placement='right'
                    title='Activity Logs'
                    id='kt_activities_toggle'
                >
                    <KTIcon iconName='chart-simple' className='fs-2 text-lg-1' />
                </div>
            </div>

            {/* Notifications */}
            <div className='d-flex align-items-center mb-2'>
                <div
                    className='btn btn-icon btn-active-color-fsh-primary btn-color-gray-500 btn-active-light'
                    data-kt-menu-trigger='click'
                    data-kt-menu-overflow='true'
                    data-kt-menu-placement='top-start'
                    data-bs-toggle='tooltip'
                    data-bs-placement='right'
                    title='Notifications'
                >
                    <KTIcon iconName='element-11' className='fs-2 text-lg-1' />
                </div>
                {/* not: prop adı 'backgroundUrl' olmalı (typo vardı) */}
                <HeaderNotificationsMenu backgroundUrl='/media/misc/pattern-1.jpg' />
            </div>

            {/* User */}
            <div className='d-flex align-items-center mb-10' id='kt_header_user_menu_toggle'>
                <div
                    className='cursor-pointer symbol symbol-40px'
                    data-kt-menu-trigger='click'
                    data-kt-menu-overflow='false'
                    data-kt-menu-placement='top-start'
                    title='User profile'
                >
                    <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='avatar' />
                </div>
                <HeaderUserMenu />
            </div>
        </div>
    )
}

export {AsideFooter}
