import React from 'react';
import styled from "styled-components";
import {theme} from '../utils';

interface IFilterProps {
    title: string;
    handleOnClick: () => void;
    isActive: boolean;
}

const Pill = styled.div`
    font-size: 14px;
    color: white;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: grab;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
`
const Filter: React.FC<IFilterProps> = ({title, handleOnClick, isActive}) => {
    return (
    <Pill 
        style={{backgroundColor: isActive? theme.colors.green[100] : theme.colors.coral[100]}} 
        onClick={handleOnClick}>
            {title}
    </Pill>);
}

export default Filter;