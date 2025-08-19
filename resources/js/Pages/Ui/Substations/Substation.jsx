// resources/js/Pages/Substations/Substation.jsx
import React, {useEffect, useState} from "react";
import {PageTitle} from "@/Libs/Metronic/_metronic/layout/core";
import {ROUTES} from "@/Libs/Routes/config.jsx";
import {KTCard, KTCardBody} from "@/Libs/Metronic/_metronic/helpers";
import useSubstation from "@/ServerSide/Hooks/useSubstation";
import SubstationCreateModal from "../Substations/Modals/SubstationCreateModal";
import SubstationEditModal from "../Substations/Modals/SubstationEditModal"; // 🔹 EKLENDİ
import {Spinner} from "react-bootstrap";
import Swal from "sweetalert2";

const usersBreadCrumbs = [
    { title: "Ana Sayfa", path: ROUTES.UI.LANDING, isSeparator: false, isActive: false },
];

const getImageUrl = (row) => {
    const raw = row?.cover_image_url || row?.cover_image || "";
    if (!raw) return "";
    if (raw.startsWith("http") || raw.startsWith("/")) return raw;
    return `/storage/${raw}`;
};
const displayName = (row) => row?.name ?? row?.company_name ?? "";

const Content = () => {
    const { substations, loading, error, fetchSubstations, deleteSubstation } = useSubstation();

    const [createOpen, setCreateOpen] = useState(false);

    // 🔹 Edit modal state
    const [editOpen, setEditOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);

    useEffect(() => { fetchSubstations(); }, []);

    // SweetAlert'li silme
    const onDelete = async (id) => {
        const result = await Swal.fire({
            title: "Emin misiniz?",
            text: "Bu şubeyi silmek istediğinize emin misiniz?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Evet, sil!",
            cancelButtonText: "İptal",
        });

        if (result.isConfirmed) {
            try {
                await deleteSubstation(id);
                await fetchSubstations();
                await Swal.fire("Silindi!", "Şube başarıyla silindi.", "success");
            } catch (e) {
                await Swal.fire("Hata", "Şube silinirken bir hata oluştu.", "error");
            }
        }
    };

    // 🔹 Edit aç/kapat
    const openEdit = (row) => {
        setEditingRow(row);
        setEditOpen(true);
    };
    const closeEdit = () => {
        setEditOpen(false);
        setEditingRow(null);
    };

    return (
        <KTCard className="mb-5 mb-xl-10">
            {/* Header */}
            <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bold fs-3 mb-1">Şube Listesi</span>
                    <span className="text-muted mt-1 fw-semibold fs-7">
            Toplam {substations?.length ?? 0} şube
          </span>
                </h3>
                <div className="card-toolbar">
                    <button className="btn btn-sm btn-fsh-primary" onClick={() => setCreateOpen(true)}>
                        <i className="bi bi-plus-lg me-2" />
                        Yeni Firma Oluştur
                    </button>
                </div>
            </div>

            {/* Create Modal */}
            <SubstationCreateModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={() => { setCreateOpen(false); fetchSubstations(); }}
            />

            {/* Edit Modal 🔹 */}
            <SubstationEditModal
                open={editOpen}
                substation={editingRow}
                onClose={closeEdit}
                onSuccess={() => { closeEdit(); fetchSubstations(); }}
            />

            <KTCardBody>
                {error && <div className="alert alert-danger">{error}</div>}

                {loading && (!substations || substations.length === 0) ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="fsh-primary" />
                        <p className="mt-3">Şubeler yükleniyor...</p>
                    </div>
                ) : (!substations || substations.length === 0) ? (
                    <div className="text-center py-5 text-muted">Henüz şube yok.</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                            <thead>
                            <tr className="fw-bold text-muted">
                                <th className="min-w-50px">Sıra</th>
                                <th className="min-w-120px">Görsel</th>
                                <th className="min-w-200px">Ad</th>
                                <th className="min-w-100px text-end">İşlem</th>
                            </tr>
                            </thead>
                            <tbody>
                            {substations.map((row, i) => (
                                <tr key={row.id}>
                                    <td><span className="text-dark fw-bold d-block fs-6">{i + 1}</span></td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="symbol symbol-45px me-3">
                                                {getImageUrl(row) ? (
                                                    <img src={getImageUrl(row)} alt="logo" />
                                                ) : (
                                                    <div className="symbol-label bg-light"></div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="text-dark fw-bold fs-6">{displayName(row)}</span></td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end">
                                            <button
                                                className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                                                title="Düzenle"
                                                onClick={() => openEdit(row)}   // 🔹 BAĞLANDI
                                            >
                                                <i className="bi bi-pencil fs-4"></i>
                                            </button>
                                            <button
                                                className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                                                title="Sil"
                                                onClick={() => onDelete(row.id)}
                                            >
                                                <i className="bi bi-trash fs-4"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </KTCardBody>
        </KTCard>
    );
};

const Substations = () => (
    <>
        <PageTitle breadcrumbs={usersBreadCrumbs}>Şubeler</PageTitle>
        <Content />
    </>
);

export default Substations;
