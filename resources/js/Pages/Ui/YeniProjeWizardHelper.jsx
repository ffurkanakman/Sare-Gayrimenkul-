import * as Yup from 'yup';

export const projectFormSchema = [
  // Step 1: Service Information
  Yup.object({
    tasksToBeDone: Yup.string().required('Yapılacak İşlemler alanı zorunludur'),
    tasksDone: Yup.string().required('Yapılan İşlemler alanı zorunludur'),
  }),

  // Step 2: Customer and Vehicle Information
  Yup.object({
    // Customer fields
    customerType: Yup.string().required('Müşteri seçimi zorunludur'),
    // Conditional validation for new customer
    companyName: Yup.string().when(['isNewCustomer'], {
      is: (isNewCustomer) => isNewCustomer === true,
      then: () => Yup.string().required('Firma Adı zorunludur'),
      otherwise: () => Yup.string(),
    }),
    authorizedPerson: Yup.string().when(['isNewCustomer'], {
      is: (isNewCustomer) => isNewCustomer === true,
      then: () => Yup.string().required('Yetkili Adı Soyadı zorunludur'),
      otherwise: () => Yup.string(),
    }),
    phoneNumber: Yup.string().when(['isNewCustomer'], {
      is: (isNewCustomer) => isNewCustomer === true,
      then: () => Yup.string().required('Telefon Numarası zorunludur'),
      otherwise: () => Yup.string(),
    }),
    email: Yup.string().when(['isNewCustomer'], {
      is: (isNewCustomer) => isNewCustomer === true,
      then: () => Yup.string().email('Geçerli bir e-posta adresi giriniz').required('E-Posta zorunludur'),
      otherwise: () => Yup.string().email('Geçerli bir e-posta adresi giriniz'),
    }),

    // Vehicle fields
    brand: Yup.string().required('Marka zorunludur'),
    model: Yup.string().required('Model zorunludur'),
  }),

  // Step 3: Material Information and Pricing
  Yup.object({
    laborCost: Yup.number().required('İşçilik Tutarı zorunludur').min(0, 'İşçilik Tutarı 0 veya daha büyük olmalıdır'),
    discount: Yup.number().min(0, 'İskonto 0 veya daha büyük olmalıdır'),
    debt: Yup.number().min(0, 'Borç 0 veya daha büyük olmalıdır'),
    parts: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Parça Adı zorunludur'),
        quantity: Yup.number().required('Adet zorunludur').min(0, 'Adet 0 veya daha büyük olmalıdır'),
        unitPrice: Yup.number().required('Birim Fiyat zorunludur').min(0, 'Birim Fiyat 0 veya daha büyük olmalıdır'),
      })
    ),
  }),

  // Step 4: Preview (no validation needed)
  Yup.object({}),
];

export const initialValues = {
  // Step 1: Service Information
  tasksToBeDone: '',
  tasksDone: '',

  // Step 2: Customer and Vehicle Information
  customerType: '',
  isNewCustomer: false,
  companyName: '',
  authorizedPerson: '',
  phoneNumber: '',
  email: '',

  // Vehicle Information
  brand: '',
  model: '',
  serialNumber: '',
  chassisNumber: '',
  hours: '',
  modelYear: '',
  vehiclePhotos: [],

  // Step 3: Material Information and Pricing
  extraNotes: '',
  laborCost: '',
  discount: '',
  debt: '',
  parts: [{ name: '', quantity: '', unitPrice: '', totalPrice: '' }]
};
