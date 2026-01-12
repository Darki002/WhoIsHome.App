import {useState} from "react";

export default function useWihValidation(name: string) {
    const [validators, setValidators] = useState<Validator[]>([]);

    const validator = validators.find(v => v.name === name);
    if (validator) {
        return validator;
    }

    const newValidator = new Validator(name);
    setValidators(prev => [...prev, newValidator]);
    return newValidator;
}

export class Validator {
    name: string;
    fieldErrors: Record<string, boolean> = {};

    constructor(name: string) {
        this.name = name;
    }

    hasAnyValidationError = () => Object.values(this.fieldErrors).some(Boolean);

    handleValidationChange = (name: string, hasError: boolean) => {
        if (!name){
            throw new Error("Validator: 'name' parameter is required in handleValidationChange.");
        }
        this.fieldErrors[name] = hasError;
    }

    registerField = (fieldName: string, validateFn: () => boolean) => {
        if (!this.isRegistered(fieldName)) {
            this.fieldErrors[fieldName] = validateFn();
        }
    }

    isRegistered = (fieldName: string) => Object.keys(this.fieldErrors).includes(fieldName);
}