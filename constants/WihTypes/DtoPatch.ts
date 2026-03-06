export interface DtoPatch<T> {
    op: string;
    path: string;
    value: T;
}

export type PathDocument = DtoPatch<any>[];