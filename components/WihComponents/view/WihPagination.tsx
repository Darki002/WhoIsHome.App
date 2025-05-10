import Swiper from 'react-native-swiper';
import {PropsWithChildren} from "react";

export const WihPagination = ({children}: PropsWithChildren) => {
    return (
        <Swiper>
            { children }
        </Swiper>
    )
}