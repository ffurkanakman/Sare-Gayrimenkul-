import React from 'react';
import {Link, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import {ROUTES} from "../../../Libs/Routes/config";

const Navbar = () => {
    const user = useSelector(state => state.auth.user);

    // 🔹 SADECE EKLENDİ: avatar URL'ini hazırla (önce avatar_url → sonra pic → yoksa placeholder)
    const baseUrl   = import.meta.env?.VITE_APP_URL || '';
    const placeholder = "https://keenthemes.com/metronic8/demo7/assets/media/avatars/300-1.jpg";
    const avatarUrl =
        user?.avatar_url
            ? user.avatar_url
            : user?.pic
                ? (String(user.pic).startsWith('http') ? user.pic : `${baseUrl}${user.pic}`)
                : placeholder;

    return (
        <>
            <div className="card mb-6">
                <div className="card-body pt-9 pb-0">
                    <div className="d-flex flex-wrap flex-sm-nowrap">
                        <div className="me-7 mb-4">
                            <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                                {/* 🔹 SADECE DEĞİŞTİ: src artık dinamik */}
                                <img
                                    src={avatarUrl}
                                    alt="image"
                                    style={{objectFit: 'cover'}}
                                    onError={(e)=>{ e.currentTarget.src = placeholder; }}
                                />
                                <div className="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-body h-20px w-20px"></div>
                            </div>
                        </div>

                        {/* 🔻 Aşağısı aynen bıraktım */}
                        <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                                <div className="d-flex flex-column">
                                    <div className="d-flex align-items-center mb-2">
                                        <a href="#" className="text-gray-900 text-hover-primary fs-2 fw-bold me-1"> {user.name} {user.surname} </a>
                                    </div>
                                    <div className="d-flex flex-wrap fw-semibold fs-6 mb-4 pe-2">
                                        <a href="#" className="d-flex align-items-center text-gray-500 text-hover-fsh-primary me-5 mb-2">
                                            <i className="ki-duotone ki-profile-circle fs-4 me-1"><span className="path1"></span><span className="path2"></span><span className="path3"></span></i> {user.role === 'admin' ? 'Yönetici' : 'Satış Temsilcisi'}
                                        </a>
                                        <a href="#" className="d-flex align-items-center text-gray-500 text-hover-fsh-primary me-5 mb-2">
                                            <i className="ki-duotone ki-geolocation fs-4 me-1"><span className="path1"></span><span className="path2"></span></i> Sare Gayrimenkul Ana Ofis
                                        </a>
                                        <a href="#" className="d-flex align-items-center text-gray-500 text-hover-fsh-primary mb-2">
                                            <i className="ki-duotone ki-sms fs-4 me-1"><span className="path1"></span><span className="path2"></span></i> {user.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="d-flex my-4">
                                    <a href="#" className="btn btn-sm btn-fsh-primary me-3" data-bs-toggle="modal"
                                       data-bs-target="#kt_modal_offer_a_deal">Randevu Al</a>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap flex-stack">
                                <div className="d-flex flex-column flex-grow-1 pe-8">
                                    <div className="d-flex flex-wrap">
                                        <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <i className="ki-duotone ki-arrow-up fs-3 text-success me-2"><span className="path1"></span><span className="path2"></span></i>
                                                <div className="fs-2 fw-bold counted" data-kt-countup="true"
                                                     data-kt-countup-value="2300000" data-kt-countup-prefix="$"
                                                     data-kt-initialized="1">₺2.300.000
                                                </div>
                                            </div>
                                            <div className="fw-semibold fs-6 text-gray-500">Aylık Ciro</div>
                                        </div>
                                        <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <i className="ki-duotone ki-arrow-down fs-3 text-danger me-2"><span className="path1"></span><span className="path2"></span></i>
                                                <div className="fs-2 fw-bold counted" data-kt-countup="true"
                                                     data-kt-countup-value="6" data-kt-initialized="1">6
                                                </div>
                                            </div>
                                            <div className="fw-semibold fs-6 text-gray-500">Satılan Arsa</div>
                                        </div>
                                        <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <i className="ki-duotone ki-arrow-up fs-3 text-success me-2"><span className="path1"></span><span className="path2"></span></i>
                                                <div className="fs-2 fw-bold counted" data-kt-countup="true"
                                                     data-kt-countup-value="73" data-kt-countup-prefix="%"
                                                     data-kt-initialized="1">73
                                                </div>
                                            </div>
                                            <div className="fw-semibold fs-6 text-gray-500">Algoritma Puanı</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center w-200px w-sm-300px flex-column mt-3">
                                    <div className="d-flex justify-content-between w-100 mt-auto mb-2">
                                        <span className="fw-semibold fs-6 text-gray-500">Geçen Ayla Kıyas</span>
                                        <span className="fw-bold fs-6">64%</span>
                                    </div>
                                    <div className="h-5px mx-3 w-100 bg-light mb-3">
                                        <div className="bg-success rounded h-5px"
                                             role="progressbar"
                                             style={{width: "64%"}}
                                             aria-valuenow="50"
                                             aria-valuemin="0"
                                             aria-valuemax="100">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">
                        <li className="nav-item mt-2">
                            <Link className="nav-link text-active-fsh-primary ms-0 me-10 py-5 active"
                                  to={ROUTES.UI.MYCLIENTS}>
                                Müşterilerim </Link>
                        </li>
                        <li className="nav-item mt-2">
                            <Link className="nav-link text-active-fsh-primary ms-0 me-10 py-5 "
                                  to="#">
                                Hesap Ayarları </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <Outlet/>
        </>
    )
}

export default Navbar;
