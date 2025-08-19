// resources/js/Pages/Substations/SubstationCreateModal.jsx
import React, { useEffect, useRef, useState } from "react";
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

const SubstationCreateModal = ({ open = false, onClose = () => {}, onSuccess = () => {} }) => {
    const { createSubstation, loading } = useSubstation();
    const fileRef = useRef(null);

    const [name, setName] = useState("");            // input değerini tutuyoruz
    const [file, setFile] = useState(null);
    const [picPreview, setPicPreview] = useState("");

    useEffect(() => {
        if (open) {
            setName("");
            setFile(null);
            setPicPreview("");
            if (fileRef.current) fileRef.current.value = "";
        }
    }, [open]);

    if (!open) return null;

    const openFilePicker = () => fileRef.current?.click();
    const clearPic = () => {
        setFile(null);
        setPicPreview("");
        if (fileRef.current) fileRef.current.value = "";
    };

    const onPick = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const okTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!okTypes.includes(f.type)) return alert("Sadece JPG/PNG/WEBP yükleyebilirsiniz.");
        if (f.size > 2 * 1024 * 1024) return alert("Dosya 2MB'dan küçük olmalı.");
        setFile(f);
        setPicPreview(URL.createObjectURL(f));
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const form = new FormData();
        // 🔴 ÖNEMLİ: backend company_name bekliyor
        form.append("company_name", name.trim());
        if (file) form.append("cover_image", file);

        await createSubstation(form);
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
                    <h5 className="m-0">Yeni Firma Oluştur</h5>
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
                                    backgroundImage: picPreview ? `url(${picPreview})` : "none",
                                }}
                            >
                                {!picPreview && <span>160×160 kare alan</span>}
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
                                    disabled={!picPreview}
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
                            Oluştur
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubstationCreateModal;
