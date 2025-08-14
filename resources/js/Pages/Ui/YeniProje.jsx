import React, { useState, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../Libs/Metronic/_metronic/layout/core";
import { ROUTES } from "@/Libs/Routes/config.jsx";
import {
    KTCard,
    KTCardBody,
    KTIcon,
} from "../../Libs/Metronic/_metronic/helpers";
import { StepperComponent } from "../../Libs/Metronic/_metronic/assets/ts/components";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { projectFormSchema, initialValues } from "./YeniProjeWizardHelper";
import { Toolbar } from "../../Libs/Metronic/_metronic/layout/components/toolbar/Toolbar";
import { Content } from "../../Libs/Metronic/_metronic/layout/components/Content";
import { useProject } from "../../ServerSide/Hooks/useProject.jsx";
import { useClient } from "../../ServerSide/Hooks/useClient";
import { toast } from "react-toastify";

const newProjectBreadCrumbs = [
    {
        title: "Ana Sayfa",
        path: ROUTES.UI.LANDING,
        isSeparator: false,
        isActive: false,
    },
    {
        title: "Projeler",
        path: ROUTES.UI.PROJECTS,
        isSeparator: false,
        isActive: false,
    },
    {
        title: "Yeni Proje",
        path: ROUTES.UI.NEW_PROJECT,
        isSeparator: false,
        isActive: true,
    },
];

// Wizard component for new project creation
const ProjectWizard = ({ breadcrumbs, title }) => {
    const stepperRef = useRef(null);
    const [stepper, setStepper] = useState(null);
    const [currentSchema, setCurrentSchema] = useState(projectFormSchema[0]);
    const [isSubmitButton, setSubmitButton] = useState(false);
    const navigate = useNavigate();

    // Servis hook'unu kullan
    const { saveProject, loading: serviceLoading } = useProject();

    // Client hook'unu kullan
    const {
        clients,
        fetchClients,
        createClient,
        loading: clientLoading,
    } = useClient();

    // Combined loading state
    const loading = serviceLoading || clientLoading;

    // Fetch clients when component mounts
    useEffect(() => {
        const loadClients = async () => {
            try {
                await fetchClients();
            } catch (error) {
                console.error("Müşteriler yüklenirken hata oluştu:", error);
            }
        };

        loadClients();
    }, []);

    // Calculate total price
    const calculateTotal = (values) => {
        let total = parseFloat(values.laborCost || 0);
        values.parts.forEach((part) => {
            total += parseFloat(part.totalPrice || 0);
        });
        // Add debt to the total
        total += parseFloat(values.debt || 0);
        return total - parseFloat(values.discount || 0);
    };

    // Load stepper component
    const loadStepper = () => {
        setStepper(StepperComponent.createInsance(stepperRef.current));
    };

    // Navigate to previous step
    const prevStep = () => {
        if (!stepper) {
            return;
        }

        stepper.goPrev();
        setCurrentSchema(projectFormSchema[stepper.currentStepIndex - 1]);
        setSubmitButton(stepper.currentStepIndex === stepper.totalStepsNumber);
    };

    // Handle form submission for each step
    const submitStep = async (values, actions) => {
        if (!stepper) {
            return;
        }

        if (stepper.currentStepIndex !== stepper.totalStepsNumber) {
            stepper.goNext();
        } else {
            try {
                let clientId = null;

                // If this is a new customer, create a client record first
                if (values.isNewCustomer) {
                    const clientData = {
                        company_name: values.companyName,
                        authorized_person: values.authorizedPerson,
                        phone: values.phoneNumber,
                        email: values.email,
                    };

                    try {
                        const newClient = await createClient(clientData);
                        if (newClient && newClient.id) {
                            clientId = newClient.id;
                            toast.success("Müşteri başarıyla oluşturuldu");
                        }
                    } catch (clientError) {
                        console.error(
                            "Müşteri kaydedilirken hata oluştu:",
                            clientError
                        );
                        // Continue with service creation even if client creation fails
                    }
                } else if (
                    values.customerType &&
                    values.customerType !== "new"
                ) {
                    // If an existing client is selected, use its ID
                    clientId = values.customerType;
                }

                // Map form fields to the required fields for the ProjectRequest
                const projectData = {
                    // Required fields
                    company_name: values.companyName,
                    authorized_person: values.authorizedPerson,
                    machine_info: `${values.brand} ${values.model}`,
                    project_type: "service", // Default project type

                    // Optional fields
                    description: values.extraNotes,
                    price: calculateTotal(values),
                    notes: values.tasksToBeDone,
                    done_jobs: values.tasksDone,
                    labor_cost: values.laborCost || 0,
                    discount: values.discount || 0,
                    debt: values.debt || 0,

                    // Include vehicle information fields
                    brand: values.brand,
                    model: values.model,
                    serialNumber: values.serialNumber,
                    chassisNumber: values.chassisNumber,
                    hours: values.hours,
                    modelYear: values.modelYear,
                    vehiclePhotos: values.vehiclePhotos,

                    // Include parts data
                    parts: values.parts
                        .filter(
                            (part) =>
                                part.name && part.quantity && part.unitPrice
                        )
                        .map((part) => ({
                            name: part.name,
                            quantity: part.quantity,
                            unit_price: part.unitPrice,
                            total_price: part.totalPrice,
                        })),
                };

                // Add client_id if available
                if (clientId) {
                    projectData.client_id = clientId;
                }

                // Form is complete, submit the data using the hook
                const savedProject = await saveProject(projectData);

                // Display success message
                toast.success("Servis başarıyla oluşturuldu");

                // Short delay to ensure toast is visible before navigation
                setTimeout(() => {
                    // Başarılı kayıt sonrası projeler sayfasına yönlendir
                    navigate(ROUTES.UI.PROJECTS);
                }, 1000);
                return;
            } catch (error) {
                console.error("Proje kaydedilirken hata oluştu:", error);
                // Hata durumunda form işlemini devam ettir
                actions.setSubmitting(false);
            }
        }

        setSubmitButton(stepper.currentStepIndex === stepper.totalStepsNumber);
        setCurrentSchema(projectFormSchema[stepper.currentStepIndex - 1]);
    };

    // Handle customer type change
    const handleCustomerTypeChange = (e, setFieldValue, values) => {
        const selectedValue = e.target.value;
        const isNewCustomer = selectedValue === "new";
        setFieldValue("customerType", selectedValue);
        setFieldValue("isNewCustomer", isNewCustomer);

        // If an existing client is selected, populate the form with client data
        if (!isNewCustomer && selectedValue !== "") {
            const selectedClient = clients.find(
                (client) => client.id.toString() === selectedValue.toString()
            );
            if (selectedClient) {
                // Populate form fields with client data
                setFieldValue("companyName", selectedClient.company_name || "");
                setFieldValue(
                    "authorizedPerson",
                    selectedClient.authorized_person ||
                        selectedClient.name ||
                        ""
                );
                setFieldValue("phoneNumber", selectedClient.phone || "");
                setFieldValue("email", selectedClient.email || "");
            }
        }
    };

    // Handle part field changes
    const handlePartChange = (index, e, values, setFieldValue) => {
        const { name, value } = e.target;
        const updatedParts = [...values.parts];
        updatedParts[index] = {
            ...updatedParts[index],
            [name]: value,
        };

        // Calculate total price if quantity or unit price changes
        if (name === "quantity" || name === "unitPrice") {
            const quantity =
                name === "quantity" ? value : updatedParts[index].quantity;
            const unitPrice =
                name === "unitPrice" ? value : updatedParts[index].unitPrice;

            if (quantity && unitPrice) {
                updatedParts[index].totalPrice = (
                    parseFloat(quantity) * parseFloat(unitPrice)
                ).toFixed(2);
            }
        }

        setFieldValue("parts", updatedParts);
    };

    // Add new part row
    const addPart = (values, setFieldValue) => {
        setFieldValue("parts", [
            ...values.parts,
            { name: "", quantity: "", unitPrice: "", totalPrice: "" },
        ]);
    };

    // Remove part row
    const removePart = (index, values, setFieldValue) => {
        const updatedParts = [...values.parts];
        updatedParts.splice(index, 1);
        setFieldValue("parts", updatedParts);
    };

    // Handle file uploads for vehicle photos
    const handleFileUpload = (e, values, setFieldValue) => {
        const files = Array.from(e.target.files);
        setFieldValue("vehiclePhotos", [...values.vehiclePhotos, ...files]);
    };

    // Remove uploaded photo
    const removePhoto = (index, values, setFieldValue) => {
        const updatedPhotos = [...values.vehiclePhotos];
        updatedPhotos.splice(index, 1);
        setFieldValue("vehiclePhotos", updatedPhotos);
    };

    // Initialize stepper when component mounts
    useEffect(() => {
        if (!stepperRef.current) {
            return;
        }

        loadStepper();
    }, [stepperRef]);

    return (
        <>
            <PageTitle breadcrumbs={breadcrumbs}>{title}</PageTitle>
            <Content>
                <div
                    ref={stepperRef}
                    className="stepper stepper-links d-flex flex-column pt-15"
                    id="kt_create_project_stepper"
                >
                    <div className="stepper-nav mb-5">
                        <div
                            className="stepper-item current"
                            data-kt-stepper-element="nav"
                        >
                            <h3 className="stepper-title">Servis Bilgileri</h3>
                        </div>

                        <div
                            className="stepper-item"
                            data-kt-stepper-element="nav"
                        >
                            <h3 className="stepper-title">
                                Müşteri ve Araç Bilgileri
                            </h3>
                        </div>

                        <div
                            className="stepper-item"
                            data-kt-stepper-element="nav"
                        >
                            <h3 className="stepper-title">
                                Malzeme Bilgileri ve Fiyatlandırma
                            </h3>
                        </div>

                        <div
                            className="stepper-item"
                            data-kt-stepper-element="nav"
                        >
                            <h3 className="stepper-title">Önizleme</h3>
                        </div>
                    </div>

                    <Formik
                        validationSchema={currentSchema}
                        initialValues={initialValues}
                        onSubmit={submitStep}
                    >
                        {({ values, setFieldValue, errors, touched }) => (
                            <Form
                                className="pt-15 pb-10 form-wrapper"
                                id="kt_create_project_form"
                            >
                                <div
                                    className="current"
                                    data-kt-stepper-element="content"
                                >
                                    <div className="step-content">
                                        <div className="mb-10">
                                            <label className="form-label required">
                                                Yapılacak İşlemler
                                            </label>
                                            <Field
                                                as="textarea"
                                                className="form-control"
                                                name="tasksToBeDone"
                                                rows="4"
                                            />
                                            <div className="text-danger mt-2">
                                                <ErrorMessage name="tasksToBeDone" />
                                            </div>
                                        </div>
                                        <div className="mb-10">
                                            <label className="form-label required">
                                                Yapılan İşlemler
                                            </label>
                                            <Field
                                                as="textarea"
                                                className="form-control"
                                                name="tasksDone"
                                                rows="4"
                                            />
                                            <div className="text-danger mt-2">
                                                <ErrorMessage name="tasksDone" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Step 2: Customer and Vehicle Information */}
                                <div data-kt-stepper-element="content">
                                    <div className="step-content">
                                        <h3 className="mb-5">
                                            Müşteri ve Araç Bilgileri
                                        </h3>
                                        {/* Customer Information */}
                                        <div className="mb-10">
                                            <label className="form-label required">
                                                Müşteri
                                            </label>
                                            <Field
                                                as="select"
                                                className="form-select w-100"
                                                name="customerType"
                                                onChange={(e) =>
                                                    handleCustomerTypeChange(
                                                        e,
                                                        setFieldValue,
                                                        values
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Müşteri Seçiniz
                                                </option>
                                                <option value="1">
                                                    Müşteri Seçiniz1
                                                </option>
                                                <option value="new">
                                                    Yeni Müşteri
                                                </option>
                                                {clients &&
                                                    clients.map((client) => (
                                                        <option
                                                            key={client.id}
                                                            value={client.id}
                                                        >
                                                            {client.company_name ||
                                                                client.name}
                                                        </option>
                                                    ))}
                                            </Field>
                                            <div className="text-danger mt-2">
                                                <ErrorMessage name="customerType" />
                                            </div>
                                        </div>

                                        {/* Conditional fields for new customer */}
                                        {values.isNewCustomer && (
                                            <div className="new-customer-fields">
                                                <div className="mb-10">
                                                    <label className="form-label required">
                                                        Firma Adı
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        className="form-control w-100"
                                                        name="companyName"
                                                    />
                                                    <div className="text-danger mt-2">
                                                        <ErrorMessage name="companyName" />
                                                    </div>
                                                </div>
                                                <div className="mb-10">
                                                    <label className="form-label required">
                                                        Yetkili Adı Soyadı
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        className="form-control w-100"
                                                        name="authorizedPerson"
                                                    />
                                                    <div className="text-danger mt-2">
                                                        <ErrorMessage name="authorizedPerson" />
                                                    </div>
                                                </div>
                                                <div className="mb-10">
                                                    <label className="form-label required">
                                                        Telefon Numarası
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="bi bi-telephone"></i>
                                                        </span>
                                                        <Field
                                                            type="text"
                                                            className="form-control w-100"
                                                            name="phoneNumber"
                                                            placeholder="0 (___) ___ __ __"
                                                        />
                                                    </div>
                                                    <div className="text-danger mt-2">
                                                        <ErrorMessage name="phoneNumber" />
                                                    </div>
                                                </div>
                                                <div className="mb-10">
                                                    <label className="form-label required">
                                                        E-Posta
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="bi bi-envelope"></i>
                                                        </span>
                                                        <Field
                                                            type="email"
                                                            className="form-control w-100"
                                                            name="email"
                                                        />
                                                    </div>
                                                    <div className="text-danger mt-2">
                                                        <ErrorMessage name="email" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Vehicle Information */}
                                        <h4 className="mt-10 mb-5">
                                            Araç Bilgileri
                                        </h4>
                                        <div className="row">
                                            <div className="col-md-6 mb-10">
                                                <label className="form-label required">
                                                    Marka
                                                </label>
                                                <Field
                                                    type="text"
                                                    className="form-control w-100"
                                                    name="brand"
                                                />
                                                <div className="text-danger mt-2">
                                                    <ErrorMessage name="brand" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-10">
                                                <label className="form-label required">
                                                    Model
                                                </label>
                                                <Field
                                                    type="text"
                                                    className="form-control w-100"
                                                    name="model"
                                                />
                                                <div className="text-danger mt-2">
                                                    <ErrorMessage name="model" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-10">
                                                <label className="form-label">
                                                    Seri No
                                                </label>
                                                <Field
                                                    type="text"
                                                    className="form-control w-100"
                                                    name="serialNumber"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-10">
                                                <label className="form-label">
                                                    Şasi No
                                                </label>
                                                <Field
                                                    type="text"
                                                    className="form-control w-100"
                                                    name="chassisNumber"
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-10">
                                                <label className="form-label">
                                                    Saat
                                                </label>
                                                <Field
                                                    type="number"
                                                    className="form-control w-100"
                                                    name="hours"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-10">
                                                <label className="form-label">
                                                    Model Yılı
                                                </label>
                                                <Field
                                                    type="number"
                                                    className="form-control w-100"
                                                    name="modelYear"
                                                />
                                            </div>
                                        </div>

                                        {/* Vehicle Photos */}
                                        <div className="mb-10">
                                            <label className="form-label">
                                                Araç Fotoğrafları
                                            </label>
                                            <div className="dropzone-container border rounded p-4">
                                                <div className="dz-message needsclick text-center mb-3">
                                                    <i className="bi bi-file-earmark-image fs-3x text-fsh-primary"></i>
                                                    <div className="ms-4">
                                                        <h3 className="fs-5 fw-bold text-gray-900 mb-1">
                                                            Fotoğrafları buraya
                                                            sürükleyin veya
                                                            tıklayın
                                                        </h3>
                                                        <span className="fs-7 fw-semibold text-gray-400">
                                                            En fazla 10 fotoğraf
                                                            yükleyebilirsiniz
                                                        </span>
                                                    </div>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="form-control w-100 picture-select"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        handleFileUpload(
                                                            e,
                                                            values,
                                                            setFieldValue
                                                        )
                                                    }
                                                />
                                            </div>

                                            {/* Display uploaded photos */}
                                            {values.vehiclePhotos.length >
                                                0 && (
                                                <div className="mt-5">
                                                    <h6>
                                                        Yüklenen Fotoğraflar
                                                    </h6>
                                                    <div className="d-flex flex-wrap gap-3 mt-3">
                                                        {values.vehiclePhotos.map(
                                                            (photo, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="position-relative"
                                                                >
                                                                    <img
                                                                        src={URL.createObjectURL(
                                                                            photo
                                                                        )}
                                                                        alt={`Vehicle photo ${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                        className="img-thumbnail"
                                                                        style={{
                                                                            width: "100px",
                                                                            height: "100px",
                                                                            objectFit:
                                                                                "cover",
                                                                        }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-icon btn-sm btn-danger position-absolute top-0 end-0"
                                                                        onClick={() =>
                                                                            removePhoto(
                                                                                index,
                                                                                values,
                                                                                setFieldValue
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="bi bi-x"></i>
                                                                    </button>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3: Material Information and Pricing */}
                                <div data-kt-stepper-element="content">
                                    <div className="step-content">
                                        <h3 className="mb-5">
                                            Malzeme Bilgileri ve Fiyatlandırma
                                        </h3>

                                        <div className="mb-10">
                                            <label className="form-label">
                                                Ekstra Not
                                            </label>
                                            <Field
                                                as="textarea"
                                                className="form-control w-100"
                                                name="extraNotes"
                                                rows="3"
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 mb-10">
                                                <label className="form-label required">
                                                    İşçilik Tutarı
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        ₺
                                                    </span>
                                                    <Field
                                                        type="number"
                                                        className="form-control w-100"
                                                        name="laborCost"
                                                        step="0.01"
                                                    />
                                                </div>
                                                <div className="text-danger mt-2">
                                                    <ErrorMessage name="laborCost" />
                                                </div>
                                            </div>
                                            <div className="col-md-4 mb-10">
                                                <label className="form-label">
                                                    İskonto
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        ₺
                                                    </span>
                                                    <Field
                                                        type="number"
                                                        className="form-control w-100"
                                                        name="discount"
                                                        step="0.01"
                                                    />
                                                </div>
                                                <div className="text-danger mt-2">
                                                    <ErrorMessage name="discount" />
                                                </div>
                                            </div>
                                            <div className="col-md-4 mb-10">
                                                <label className="form-label">
                                                    Borç
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        ₺
                                                    </span>
                                                    <Field
                                                        type="number"
                                                        className="form-control w-100"
                                                        name="debt"
                                                        step="0.01"
                                                    />
                                                </div>
                                                <div className="text-danger mt-2">
                                                    <ErrorMessage name="debt" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Parts Repeater */}
                                        <div className="parts-repeater mt-5">
                                            <div className="d-flex justify-content-between align-items-center mb-5">
                                                <h4 className="mb-0">
                                                    Parça Bilgileri
                                                </h4>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-light-primary"
                                                    onClick={() =>
                                                        addPart(
                                                            values,
                                                            setFieldValue
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-plus"></i>{" "}
                                                    Parça Ekle
                                                </button>
                                            </div>

                                            {values.parts.map((part, index) => (
                                                <div
                                                    key={index}
                                                    className="part-item card mb-5 p-6"
                                                >
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <h5 className="card-title">
                                                            Parça #{index + 1}
                                                        </h5>
                                                        {index > 0 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-icon btn-light-danger"
                                                                onClick={() =>
                                                                    removePart(
                                                                        index,
                                                                        values,
                                                                        setFieldValue
                                                                    )
                                                                }
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6 mb-3">
                                                            <label className="form-label required">
                                                                Parça Adı
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control w-100"
                                                                name="name"
                                                                value={
                                                                    part.name
                                                                }
                                                                onChange={(e) =>
                                                                    handlePartChange(
                                                                        index,
                                                                        e,
                                                                        values,
                                                                        setFieldValue
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-md-2 mb-3">
                                                            <label className="form-label required">
                                                                Adet
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="form-control w-100"
                                                                name="quantity"
                                                                value={
                                                                    part.quantity
                                                                }
                                                                onChange={(e) =>
                                                                    handlePartChange(
                                                                        index,
                                                                        e,
                                                                        values,
                                                                        setFieldValue
                                                                    )
                                                                }
                                                                step="0.01"
                                                            />
                                                        </div>
                                                        <div className="col-md-2 mb-3">
                                                            <label className="form-label required">
                                                                Birim Fiyat
                                                            </label>
                                                            <div className="input-group">
                                                                <span className="input-group-text">
                                                                    ₺
                                                                </span>
                                                                <input
                                                                    type="number"
                                                                    className="form-control w-100"
                                                                    name="unitPrice"
                                                                    value={
                                                                        part.unitPrice
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handlePartChange(
                                                                            index,
                                                                            e,
                                                                            values,
                                                                            setFieldValue
                                                                        )
                                                                    }
                                                                    step="0.01"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-2 mb-3">
                                                            <label className="form-label">
                                                                Toplam
                                                            </label>
                                                            <div className="input-group">
                                                                <span className="input-group-text">
                                                                    ₺
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-control w-100"
                                                                    value={
                                                                        part.totalPrice ||
                                                                        "0.00"
                                                                    }
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total */}
                                        <div className="d-flex justify-content-end mt-5">
                                            <div
                                                className="border rounded p-6"
                                                style={{ width: "300px" }}
                                            >
                                                <div className="d-flex justify-content-between mb-3">
                                                    <span className="fw-bold">
                                                        İşçilik:
                                                    </span>
                                                    <span>
                                                        ₺
                                                        {parseFloat(
                                                            values.laborCost ||
                                                                0
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-3">
                                                    <span className="fw-bold">
                                                        Parçalar:
                                                    </span>
                                                    <span>
                                                        ₺
                                                        {values.parts
                                                            .reduce(
                                                                (sum, part) =>
                                                                    sum +
                                                                    parseFloat(
                                                                        part.totalPrice ||
                                                                            0
                                                                    ),
                                                                0
                                                            )
                                                            .toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-3">
                                                    <span className="fw-bold">
                                                        İskonto:
                                                    </span>
                                                    <span>
                                                        ₺
                                                        {parseFloat(
                                                            values.discount || 0
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="separator my-3"></div>
                                                <div className="d-flex justify-content-between">
                                                    <span className="fw-bolder fs-5">
                                                        TOPLAM:
                                                    </span>
                                                    <span className="fw-bolder fs-5 text-fsh-primary">
                                                        ₺
                                                        {calculateTotal(
                                                            values
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 4: Preview */}
                                <div data-kt-stepper-element="content">
                                    <div className="step-content">
                                        <h3 className="mb-5">Önizleme</h3>

                                        <div className="card mb-5">
                                            <div className="card-header">
                                                <h4 className="card-title">
                                                    Servis Bilgileri
                                                </h4>
                                            </div>
                                            <div className="card-body">
                                                <div className="mb-5">
                                                    <h5 className="text-gray-800">
                                                        Yapılacak İşlemler
                                                    </h5>
                                                    <p className="text-gray-600">
                                                        {values.tasksToBeDone ||
                                                            "Belirtilmedi"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h5 className="text-gray-800">
                                                        Yapılan İşlemler
                                                    </h5>
                                                    <p className="text-gray-600">
                                                        {values.tasksDone ||
                                                            "Belirtilmedi"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card mb-5">
                                            <div className="card-header">
                                                <h4 className="card-title">
                                                    Müşteri Bilgileri
                                                </h4>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <h5 className="text-gray-800">
                                                            Firma Adı
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            {values.companyName ||
                                                                "Belirtilmedi"}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <h5 className="text-gray-800">
                                                            Yetkili Adı Soyadı
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            {values.authorizedPerson ||
                                                                "Belirtilmedi"}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <h5 className="text-gray-800">
                                                            Telefon Numarası
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            {values.phoneNumber ||
                                                                "Belirtilmedi"}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <h5 className="text-gray-800">
                                                            E-Posta
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            {values.email ||
                                                                "Belirtilmedi"}
                                                        </p>
                                                    </div>
                                                    {!values.isNewCustomer &&
                                                        values.customerType &&
                                                        values.customerType !==
                                                            "new" && (
                                                            <div className="col-12">
                                                                <div className="alert alert-info mb-0">
                                                                    <i className="bi bi-info-circle me-2"></i>
                                                                    Mevcut
                                                                    müşteri
                                                                    seçildi:{" "}
                                                                    {(clients &&
                                                                        clients.find(
                                                                            (
                                                                                client
                                                                            ) =>
                                                                                client.id.toString() ===
                                                                                values.customerType
                                                                        )
                                                                            ?.company_name) ||
                                                                        clients.find(
                                                                            (
                                                                                client
                                                                            ) =>
                                                                                client.id.toString() ===
                                                                                values.customerType
                                                                        )
                                                                            ?.name ||
                                                                        "Müşteri bulunamadı"}
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card mb-5">
                                            <div className="card-header">
                                                <h4 className="card-title">
                                                    Araç Bilgileri
                                                </h4>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-3 mb-3">
                                                        <h5 className="text-gray-800">
                                                            Marka
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            {values.brand ||
                                                                "Belirtilmedi"}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <h5 className="text-gray-800">
                                                            Model
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            {values.model ||
                                                                "Belirtilmedi"}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <h5 className="text-gray-800">
                                                            Seri No
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            {values.serialNumber ||
                                                                "Belirtilmedi"}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <h5 className="text-gray-800">
                                                            Şasi No
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            {values.chassisNumber ||
                                                                "Belirtilmedi"}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <h5 className="text-gray-800">
                                                            Saat
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            {values.hours ||
                                                                "Belirtilmedi"}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <h5 className="text-gray-800">
                                                            Model Yılı
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            {values.modelYear ||
                                                                "Belirtilmedi"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {values.vehiclePhotos.length >
                                                    0 && (
                                                    <div className="mt-3">
                                                        <h5 className="text-gray-800">
                                                            Araç Fotoğrafları
                                                        </h5>
                                                        <div className="d-flex flex-wrap gap-3 mt-3">
                                                            {values.vehiclePhotos.map(
                                                                (
                                                                    photo,
                                                                    index
                                                                ) => (
                                                                    <img
                                                                        key={
                                                                            index
                                                                        }
                                                                        src={URL.createObjectURL(
                                                                            photo
                                                                        )}
                                                                        alt={`Vehicle photo ${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                        className="img-thumbnail"
                                                                        style={{
                                                                            width: "100px",
                                                                            height: "100px",
                                                                            objectFit:
                                                                                "cover",
                                                                        }}
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="card mb-5">
                                            <div className="card-header">
                                                <h4 className="card-title">
                                                    Malzeme Bilgileri ve
                                                    Fiyatlandırma
                                                </h4>
                                            </div>
                                            <div className="card-body">
                                                {values.extraNotes && (
                                                    <div className="mb-5">
                                                        <h5 className="text-gray-800">
                                                            Ekstra Not
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            {values.extraNotes}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="row mb-5">
                                                    <div className="col-md-4">
                                                        <h5 className="text-gray-800">
                                                            İşçilik Tutarı
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            ₺
                                                            {parseFloat(
                                                                values.laborCost ||
                                                                    0
                                                            ).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <h5 className="text-gray-800">
                                                            İskonto
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            ₺
                                                            {parseFloat(
                                                                values.discount ||
                                                                    0
                                                            ).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <h5 className="text-gray-800">
                                                            Borç
                                                        </h5>
                                                        <p className="text-gray-600">
                                                            ₺
                                                            {parseFloat(
                                                                values.debt || 0
                                                            ).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <h5 className="text-gray-800 mb-3">
                                                    Parça Listesi
                                                </h5>
                                                <div className="table-responsive">
                                                    <table className="table table-row-bordered table-row-gray-100">
                                                        <thead>
                                                            <tr className="fw-bold text-gray-800">
                                                                <th>
                                                                    Parça Adı
                                                                </th>
                                                                <th>Adet</th>
                                                                <th>
                                                                    Birim Fiyat
                                                                </th>
                                                                <th>Toplam</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {values.parts.map(
                                                                (
                                                                    part,
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <td>
                                                                            {part.name ||
                                                                                "-"}
                                                                        </td>
                                                                        <td>
                                                                            {part.quantity ||
                                                                                "0"}
                                                                        </td>
                                                                        <td>
                                                                            ₺
                                                                            {parseFloat(
                                                                                part.unitPrice ||
                                                                                    0
                                                                            ).toFixed(
                                                                                2
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            ₺
                                                                            {parseFloat(
                                                                                part.totalPrice ||
                                                                                    0
                                                                            ).toFixed(
                                                                                2
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="d-flex justify-content-end mt-5">
                                                    <div
                                                        className="border rounded p-6"
                                                        style={{
                                                            width: "300px",
                                                        }}
                                                    >
                                                        <div className="d-flex justify-content-between mb-3">
                                                            <span className="fw-bold">
                                                                İşçilik:
                                                            </span>
                                                            <span>
                                                                ₺
                                                                {parseFloat(
                                                                    values.laborCost ||
                                                                        0
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-3">
                                                            <span className="fw-bold">
                                                                Parçalar:
                                                            </span>
                                                            <span>
                                                                ₺
                                                                {values.parts
                                                                    .reduce(
                                                                        (
                                                                            sum,
                                                                            part
                                                                        ) =>
                                                                            sum +
                                                                            parseFloat(
                                                                                part.totalPrice ||
                                                                                    0
                                                                            ),
                                                                        0
                                                                    )
                                                                    .toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-3">
                                                            <span className="fw-bold">
                                                                İskonto:
                                                            </span>
                                                            <span>
                                                                ₺
                                                                {parseFloat(
                                                                    values.discount ||
                                                                        0
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="separator my-3"></div>
                                                        <div className="d-flex justify-content-between">
                                                            <span className="fw-bolder fs-5">
                                                                TOPLAM:
                                                            </span>
                                                            <span className="fw-bolder fs-5 text-fsh-primary">
                                                                ₺
                                                                {calculateTotal(
                                                                    values
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex flex-stack pt-15">
                                    <div className="mr-2">
                                        <button
                                            onClick={prevStep}
                                            type="button"
                                            className="btn btn-lg btn-light-primary me-3"
                                            data-kt-stepper-action="previous"
                                        >
                                            <KTIcon
                                                iconName="arrow-left"
                                                className="fs-4 me-1"
                                            />
                                            Geri
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="btn btn-lg btn-primary me-3"
                                            disabled={loading}
                                        >
                                            {!loading && (
                                                <span className="indicator-label">
                                                    {!isSubmitButton && "İleri"}
                                                    {isSubmitButton && "Kaydet"}
                                                    <KTIcon
                                                        iconName="arrow-right"
                                                        className="fs-3 ms-2 me-0"
                                                    />
                                                </span>
                                            )}
                                            {loading && (
                                                <span className="indicator-progress">
                                                    Lütfen bekleyin...
                                                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Content>
        </>
    );
};

const YeniProje = () => {
    const intl = useIntl();
    return (
        <>
            <ProjectWizard
                breadcrumbs={newProjectBreadCrumbs}
                title="Yeni Proje Ekle"
            />
        </>
    );
};

export { YeniProje };
export default YeniProje;
