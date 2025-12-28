/**
 * Medical Specializations Enum Mapping
 * These keys must match the backend Prisma enum values exactly
 */

export const MEDICAL_SPECIALTIES = {
    EMERGENCY: "Acil Servis",
    ORAL_AND_DENTAL: "Ağız ve Diş Sağlığı",
    NUTRITION_DIET: "Beslenme ve Diyetetik",
    DERMATOLOGY: "Cildiye (Dermatoloji)",
    GENERAL_SURGERY: "Genel Cerrahi",
    EYE_HEALTH: "Göz Sağlığı ve Hastalıkları",
    INTERNAL_MEDICINE: "İç Hastalıkları (Dahiliye)",
    GYNECOLOGY_OBSTETRICS: "Kadın Hastalıkları ve Doğum"
};

// Mapping from API enum keys to translation keys for i18n
export const SPECIALTY_TRANSLATION_KEYS = {
    EMERGENCY: 'acil',
    ORAL_AND_DENTAL: 'dis',
    NUTRITION_DIET: 'diyet',
    DERMATOLOGY: 'derma',
    GENERAL_SURGERY: 'cerrahi',
    EYE_HEALTH: 'goz',
    INTERNAL_MEDICINE: 'dahiliye',
    GYNECOLOGY_OBSTETRICS: 'kadin',
    CARDIOLOGY: 'kardiyoloji',
    NEUROLOGY: 'noroloji',
    ORTHOPEDICS: 'ortopedi',
    PEDIATRICS: 'pediatri',

    // Support Turkish strings directly if backend sends them
    'Dermatoloji': 'derma',
    'Cildiye': 'derma',
    'Cildiye (Dermatoloji)': 'derma',
    'Dahiliye': 'dahiliye',
    'İç Hastalıkları': 'dahiliye',
    'İç Hastalıkları (Dahiliye)': 'dahiliye',
    'İç Hastalıklar': 'dahiliye',
    'Kardiyoloji': 'kardiyoloji',
    'Nöroloji': 'noroloji',
    'Ortopedi': 'ortopedi',
    'Pediatri': 'pediatri',
    'Göz Hastalıkları': 'goz',
    'Göz Sağlığı ve Hastalıkları': 'goz',
    'Acil Servis': 'acil',
    'Acil': 'acil',
    'Ağız ve Diş Sağlığı': 'dis',
    'Beslenme ve Diyetetik': 'diyet',
    'Genel Cerrahi': 'cerrahi',
    'Kadın Hastalıkları ve Doğum': 'kadin'
};

// Get specialization label (for components without i18n)
export const getSpecializationLabel = (key) => {
    return MEDICAL_SPECIALTIES[key] || key;
};

// Generate options for select dropdowns
export const getSpecializationOptions = () => {
    return Object.entries(MEDICAL_SPECIALTIES).map(([value, label]) => ({
        value,
        label
    }));
};

export default MEDICAL_SPECIALTIES;
