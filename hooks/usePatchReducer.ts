import {DtoPatch} from "@/constants/WihTypes/DtoPatch";
import {useReducer} from "react";

interface PatchState<T> {
    data: T;
    updates: DtoPatch<T>[];
}

export function usePatchReducer<TData>() {
    function reducer(state: PatchState<TData>, action: Partial<TData>){
        const keys = Object.keys(action) as Array<keyof TData>;
        const key = keys[0];
        if (!key) return state;

        const path = `/${String(key)}`;
        const value = action[key];

        const newUpdates = [...state.updates];
        const index = newUpdates.findIndex(u => u.path === path);

        if (value === undefined) {
            if (index !== -1) newUpdates.splice(index, 1);
        } else {
            const newOp: DtoPatch<TData> = { op: "replace", path: path, value: value };
            if (index !== -1) newUpdates[index] = newOp;
            else newUpdates.push(newOp);
        }

        return {
            ...state,
            data: { ...state.data, [key]: value },
            updates: newUpdates
        };
    }

    const [state, dispatch] = useReducer(reducer, {
        data: {} as TData,
        updates: []
    });
    return {state, dispatch};
}