import { Link } from "react-router-dom";
import styled from "styled-components";
import React from "react";

interface HeaderProps {
  children: React.ReactNode;
}

const Head: React.FC<HeaderProps> = ({children}) => {


  return(
<Header>
  {children}
  <nav style={{width: "50%"}}>
    <Ul>
      <li><Link to={`/button`}>打刻</Link></li>
      <li><Link to={`/timestamp`}>履歴</Link></li>
      <li><Link to={`/summary`}>エクスポート</Link></li>
    </Ul>
  </nav>
</Header>
)
}

const Header = styled.header`
  height: 70px;
border-bottom: solid 1px skyblue;
box-shadow: 0px 0px 1px 0px black;
display: flex;
background-color: #7ac8c4;
top: 0;
align-items: center;
width: 100%;
justify-content: space-between;
color: white;
font-weight: bold;
padding: 10px;
`

const Ul = styled.ul`
  display: flex;
  list-style: none;
  width: 90%;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  color: aliceblue;
`


export default Head;