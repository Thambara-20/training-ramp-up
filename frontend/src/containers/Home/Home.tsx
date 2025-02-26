import React, { useEffect } from "react";
import styled from "styled-components";
import Appbar from "../../components/Appbar/Appbar";
import Table from "./Table/Table";
import AutoLogout from "../../components/AutoLogout/AutoLogout";

export const HomeWarpper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
`;

export const ContainerWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  height: auto;
  margin-top: 105px;
  justify-content: center;
  align-items: center;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  width: 100%;
  height: auto;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
`;

export default function Home() {
  return (
    <HomeWarpper>
      <Appbar />
      <ContainerWrapper>
        <Table />
      </ContainerWrapper>
    </HomeWarpper>
  );
}
