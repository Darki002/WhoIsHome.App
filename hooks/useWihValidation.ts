import {useState} from "react";

export default function useWihValidation() {
    const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

    const handleValidationChange = (name: string, hasError: boolean) => {
        setFieldErrors(prev => ({...prev, [name]: hasError}));
    };

    const hasAnyValidationError = () => Object.values(fieldErrors).some(Boolean);

    return { handleValidationChange, hasAnyValidationError };
}