
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

export const SPECIALTY_TRANSLATION_KEYS = {
    EMERGENCY: 'acil',
    ORAL_AND_DENTAL: 'dis',
    NUTRITION_DIET: 'diyet',
    DERMATOLOGY: 'derma',
    GENERAL_SURGERY: 'cerrahi',
    EYE_HEALTH: 'goz',
    INTERNAL_MEDICINE: 'dahiliye',
    GYNECOLOGY_OBSTETRICS: 'kadin'
};

export const getSpecializationLabel = (key) => {
    return MEDICAL_SPECIALTIES[key] || key;
};

export const getSpecializationOptions = () => {
    return Object.entries(MEDICAL_SPECIALTIES).map(([value, label]) => ({
        value,
        label
    }));
};

export default MEDICAL_SPECIALTIES;
