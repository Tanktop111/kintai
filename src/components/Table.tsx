import styled from "styled-components";


const Table = styled.tr`
  list-style: none;
  font-size: 18px;
  color: black;
  justify-content: space-between;
  &:nth-child(2n){
  background-color: #f9f9f9;
  border: solid .5px black;
}

  @media screen and (max-width: 780px){
    font-size: 10px;
  }
`

export default Table;