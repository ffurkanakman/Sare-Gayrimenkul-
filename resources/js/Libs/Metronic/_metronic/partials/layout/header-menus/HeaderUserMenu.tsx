import { FC, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../../../ServerSide/Hooks/Auth/useAuth'
import Swal from 'sweetalert2'
import { toAbsoluteUrl } from '../../../helpers'
import { apiService } from '@/ServerSide/Load.jsx'
import { ROUTES } from '../../../../../../Libs/Routes/config.jsx';

const joinAbs = (base: string, rel?: string | null) => {
    if (!rel) return ''
    if (/^https?:\/\//i.test(rel)) return rel
    const b = base.replace(/\/+$/, '')
    const p = String(rel).replace(/^\/+/, '')
    return `${b}/${p}`
}

const getApiBase = () =>
    (import.meta as any).env?.VITE_API_URL ||
    (import.meta as any).env?.VITE_BACKEND_URL ||
    window.location.origin

const HeaderUserMenu: FC = () => {
    const { user, logout } = useAuth()
    const [resolvedAvatar, setResolvedAvatar] = useState<string>(toAbsoluteUrl('media/avatars/blank.png'))
    const API_BASE = useMemo(() => getApiBase(), [])

    // 1) Local adayları dene
    useEffect(() => {
        if (!user) return

        const localCandidates = [
            user?.avatar_url,                           // tam url
            joinAbs(API_BASE, user?.pic),               // /storage/...
            joinAbs(API_BASE, user?.photo),
            joinAbs(API_BASE, user?.photo_url),
        ].filter(Boolean) as string[]

        if (localCandidates.length) {
            setResolvedAvatar(localCandidates[0]!)
            return
        }

        // 2) Alan yoksa tek istekle user detayını çek (hem /api/v1/users hem /api/users dener)
        const fetchDetails = async () => {
            if (!user?.id) return

            const endpoints = [
                `/api/v1/users/${user.id}`,
                `/api/users/${user.id}`,
            ]

            for (const ep of endpoints) {
                try {
                    const res = await apiService.get(ep, { withCredentials: true })
                    const data = res?.data?.data ?? res?.data ?? null
                    if (!data) continue

                    const fromDetail =
                        data.avatar_url ||
                        joinAbs(API_BASE, data.pic) ||
                        joinAbs(API_BASE, data.photo) ||
                        joinAbs(API_BASE, data.photo_url)

                    if (fromDetail) {
                        setResolvedAvatar(fromDetail)
                        return
                    }
                } catch {
                    // sonraki endpoint'i dene
                }
            }
        }

        fetchDetails()
    }, [user, API_BASE])

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault()
        const ok = await Swal.fire({
            title: 'Emin misiniz?',
            text: 'Çıkış yapmak istediğinize emin misiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, çıkış yap',
            cancelButtonText: 'Hayır',
            reverseButtons: true,
        })
        if (ok.isConfirmed) await logout()
    }

    const role = String(user?.role || 'user').toLowerCase()
    const roleLabel =
        role === 'super_admin' || role === 'owner' ? 'Owner'
            : role === 'admin' ? 'Admin'
                : role.charAt(0).toUpperCase() + role.slice(1)
    const roleBadgeClass =
        role === 'admin' ? 'badge-light-danger'
            : role === 'super_admin' || role === 'owner' ? 'badge-light-dark'
                : 'badge-light-success'

    return (
        <div
            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-fsh-primary fw-bold py-4 fs-6 w-275px'
            data-kt-menu='true'
        >
            {/* HEADER */}
            <div className='menu-item px-3'>
                <div className='menu-content d-flex align-items-center px-3'>
                    <div className='symbol symbol-50px me-5'>
                        <img
                            alt='User avatar'
                            src={resolvedAvatar}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = toAbsoluteUrl('media/avatars/blank.png') }}
                            style={{ objectFit: 'cover', width: 50, height: 50, borderRadius: '50%' }}
                        />
                    </div>

                    <div className='d-flex flex-column'>
                        <div className='fw-bolder d-flex align-items-center fs-5 text-capitalize'>
                            {(user?.name || '')} {(user?.surname || '')}
                            <span className={`badge ${roleBadgeClass} fw-bolder fs-8 px-2 py-1 ms-2`}>{roleLabel}</span>
                        </div>
                        {user?.email && (
                            <a href={`mailto:${user.email}`} className='fw-bold text-muted text-hover-primary fs-7'>
                                {user.email}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className='separator my-2' />

            <div className='menu-item px-5 my-1'>
                <Link to={ROUTES.UI.ACCOUNT_SETTINGS} className='menu-link px-5'>
                    Hesap Ayarları
                </Link>
            </div>

            <div className='menu-item px-5'>
                <a href='#' onClick={handleLogout} className='menu-link px-5'>
                    Çıkış Yap
                </a>
            </div>
        </div>
    )
}

export { HeaderUserMenu }
