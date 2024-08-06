import styled from "styled-components";




const TimeDisplay = styled.nav`
  display: flex;
    width: 100%;
    max-width: 1600px;
    line-height: 2;
    list-style: none;
    font-size: 18px;
    justify-content: center;
    gap: 50px;
    padding: 0px;
    margin: 0 auto;

@media screen and (max-width: 780px){
  gap: 10px;
  font-size: 12px;
  margin: 10px;

}


  `







export default TimeDisplay;