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

type FieldValidationState = {
    showError: boolean;
    isValid: boolean;
};

type FieldErrors = Record<string, FieldValidationState>;

export class Validator {
    name: string;
    fieldErrors: FieldErrors = {};

    private subscribers: Set<() => void> = new Set();

    constructor(name: string) {
        this.name = name;
    }

    hasAnyValidationError = () => Object.values(this.fieldErrors).some(fe => !fe.isValid);

    hasValidationError = (fieldName: string) => {
        const fieldError = this.fieldErrors[fieldName];
        return fieldError ? fieldError.showError && !fieldError.isValid : false;
    }

    showErrors = () => {
        Object.keys(this.fieldErrors).forEach(fieldName => {
            this.fieldErrors[fieldName].showError = true;
        });
        this.notifySubscribers();
    }

    handleValidationChange = (name: string, hasError: boolean) => {
        if (!name){
            throw new Error("Validator: 'name' parameter is required in handleValidationChange.");
        }
        this.fieldErrors[name] = { showError: true, isValid: !hasError };
        this.notifySubscribers();
    }

    registerField = (fieldName: string, validateFn: () => boolean) => {
        if (!this.isRegistered(fieldName)) {
            this.fieldErrors[fieldName] = { showError: false, isValid: validateFn() };
            this.notifySubscribers();
        }
    }

    subscribe = (cb: () => void) => {
        this.subscribers.add(cb);
    }

    unsubscribe = (cb: () => void) => {
        this.subscribers.delete(cb);
    }

    private notifySubscribers = () => {
        this.subscribers.forEach(cb => {
            try { cb(); } catch (_) { /* ignore subscriber errors */ }
        });
    }

    setFieldValidity = (fieldName: string, isValid: boolean, showError?: boolean) => {
        if (!this.isRegistered(fieldName)) {
            this.fieldErrors[fieldName] = { showError: !!showError, isValid };
        } else {
            const current = this.fieldErrors[fieldName];
            this.fieldErrors[fieldName] = {
                showError: showError !== undefined ? showError : current.showError,
                isValid
            };
        }
        this.notifySubscribers();
    }

    private isRegistered = (fieldName: string) => Object.keys(this.fieldErrors).includes(fieldName);
}