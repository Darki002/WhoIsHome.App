export interface DtoPatch<T> {
    op: string;
    path: string;
    value: T[keyof T];
}

export type PathDocument = DtoPatch<any>[];