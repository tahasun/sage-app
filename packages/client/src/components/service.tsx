import styled from "styled-components";
import React from "react";
import {theme, IService} from '../utils';
import { Box, Flex, Grid } from "@chakra-ui/react";

interface IServiceProps {
  service: IService;
  handleOnClick: () => void;
  isActive: boolean;
}

const ServiceWrapper = styled.div`
    background-color: ${theme.colors.cream[100]};
    border: solid 2px;
    width: 100%;
    margin: 10px 0px;
    padding: 10px;
    border-radius: 10px;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
`;

const Service: React.FC<IServiceProps> = ({service, handleOnClick, isActive}) => {
  return (
    <ServiceWrapper
      style={{ borderColor: isActive ? theme.colors.coral[100] : "transparent" }}
      onClick={() => handleOnClick()}
    >
        <Flex justify={"space-between"}>
            <Box>{service.title}</Box>
            <Box>{service.price}</Box>
        </Flex>
    </ServiceWrapper>
  );
};

export default Service;