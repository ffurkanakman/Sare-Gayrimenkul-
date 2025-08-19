// resources/js/Pages/Substations/Modals/SubstationEditModal.jsx
import React, {useEffect, useRef, useState, useMemo} from "react";
import useSubstation from "@/ServerSide/Hooks/useSubstation";

const box = {
    width: 160,
    height: 160,
    borderRadius: 10,
    border: "2px dashed #d1d5db",
    backgroundColor: "#f8fafc",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontSize: 12,
};

const getImageUrl = (row) => {
    const raw = row?.cover_image_url || row?.cover_image || "";
    if (!raw) return "";
    if (raw.startsWith("http") || raw.startsWith("/")) return raw;
    return `/storage/${raw}`;
};
const getDisplayName = (row) => row?.name ?? row?.company_name ?? "";

const SubstationEditModal = ({
                                 open = false,
                                 onClose = () => {},
                                 onSuccess = () => {},
                                 substation = null, // {id, name/company_name, cover_image(_url)}
                             }) => {
    const { updateSubstation, loading } = useSubstation();
    const fileRef = useRef(null);

    // form state
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const initialPreview = useMemo(() => (substation ? getImageUrl(substation) : ""), [substation]);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (open && substation) {
            setName(getDisplayName(substation));
            setFile(null);
            setPreview("");
            if (fileRef.current) fileRef.current.value = "";
        }
    }, [open, substation]);

    if (!open || !substation) return null;

    const shownPreview = preview || initialPreview;

    const openFilePicker = () => fileRef.current?.click();
    const clearPic = () => {
        // sadece yeni seçimi temizle (mevcut görsel durur)
        setFile(null);
        setPreview("");
        if (fileRef.current) fileRef.current.value = "";
    };

    const onPick = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const okTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!okTypes.includes(f.type)) return alert("Sadece JPG/PNG/WEBP yükleyebilirsiniz.");
        if (f.size > 2 * 1024 * 1024) return alert("Dosya 2MB'dan küçük olmalı.");
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const form = new FormData();
        form.append("company_name", name.trim()); // backend bunu bekliyor
        if (file) form.append("cover_image", file); // dosya seçilmişse gönder

        await updateSubstation(substation.id, form);
        onSuccess(); // parent: close + fetchSubstations
    };

    return (
        <div
            className="position-fixed top-0 start-0 end-0 bottom-0"
            style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050, padding: 16 }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3 shadow p-3"
                style={{ width: 600, maxWidth: "100%", margin: "40px auto" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="m-0">Şubeyi Düzenle</h5>
                    <button className="btn btn-sm btn-light" onClick={onClose} disabled={loading}>
                        ✖
                    </button>
                </div>

                <form onSubmit={submit}>
                    {/* Profil Fotoğrafı */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Profil Fotoğrafı</label>
                        <div className="d-flex gap-3 align-items-start">
                            <div
                                style={{
                                    ...box,
                                    backgroundImage: shownPreview ? `url(${shownPreview})` : "none",
                                }}
                            >
                                {!shownPreview && <span>160×160 kare alan</span>}
                            </div>

                            <div className="d-flex flex-column gap-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={openFilePicker}
                                >
                                    <i className="bi bi-upload me-2" />
                                    Fotoğraf Ekle
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-light-danger"
                                    onClick={clearPic}
                                    disabled={!preview} // sadece yeni seçim yapıldıysa aktif
                                >
                                    <i className="bi bi-x-circle me-2" />
                                    Kaldır
                                </button>

                                <small className="text-muted">JPG / PNG / WEBP — max 2MB</small>

                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="d-none"
                                    onChange={onPick}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ad */}
                    <div className="mb-3">
                        <label className="form-label">
                            Ad <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Firma / Şube adı"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={255}
                            required
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-light" onClick={onClose} disabled={loading}>
                            Vazgeç
                        </button>
                        <button type="submit" className="btn btn-success" disabled={loading}>
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubstationEditModal;
