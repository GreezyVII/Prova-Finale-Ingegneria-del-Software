/* 
  Component che gestisce la pagina iniziale, accessibile da chiunque.
*/

// --------------------------------------------------------
import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import img from "../../../src/SmARTBOOKING.png"
import Image from 'react-bootstrap/Image'
import {Helmet} from "react-helmet"
import {Container, Row, Col} from 'reactstrap';
import Contatti from "./Contatti";
import AboutUs from "./AboutUs";
import TecnologieUsate from "./TecnologieUsate";
import Copyright from "./Copyright";
// --------------------------------------------------------

class Home extends Component {
  render() {
    return (
      <div>
        <Helmet>
            <title>
                Homapage | SmartBooking
            </title>
        </Helmet>
        <AppNavbar/>
        <Container fluid style = {{marginTop:"50px"}}>
        <Container fluid>
                <Row>
                    <Col style={{border: "1px solid black", borderRadius: "25px", textAlign: "center", backgroundColor: "#e6e6e6"}}>
                        <Image src={img} fluid></Image>
                    </Col>
                </Row>
            
                <Row style={{textAlign: "center", marginTop: "30px" , marginBottom: "30px"}}>
                    <Col>
                        <strong><h1>Smart Booking</h1></strong>
                    </Col>
                </Row>
                <Row>
                    <Col xl = "4" m = "6" xs = "12" style = {{paddingBottom: "20px"}}><Contatti></Contatti></Col>
                    <Col xl = "4" m = "6" xs = "12" style = {{paddingBottom: "20px"}}><AboutUs></AboutUs></Col>
                    <Col xl = "4" m = "6" xs = "12" style = {{paddingBottom: "20px"}}><TecnologieUsate></TecnologieUsate></Col> 
                </Row>
            </Container>

            <Copyright></Copyright>
        </Container>
      </div>
    );
  }
}

export default Home;