/*
    Component con card con tutti le informazioni di un utente.
    Potranno essere modificate e dunque aggiornate.
*/

// --------------------------------------------------------
import AppNavbar from './AppNavbar';
import React, { Component } from 'react';
import { Container, Row, Col} from 'reactstrap';
import BackendService from '../services/BackendService';
import { Alert } from "react-bootstrap"
import Card from "./Card"
import Card2 from "./Card2"
import 'primeflex/primeflex.css';
import "primereact/resources/primereact.min.css"
import CardOpenCalendar from "./CardOpenCalendar"
import Helmet from "react-helmet"
// --------------------------------------------------------

class UserPage extends Component {
  // Costruttore
  constructor(props) {
    super(props);

    // Definisco state.
    this.state={
      content: "",
      error: ""
    }
  }

  // Metodo per cambiare ed impostare valori selezionati.
  componentDidMount() {
    BackendService.getUserBoard()
      .then( response => {
        this.setState({content: response.data})
      } , error => {
        console.log(error);
        this.setState({
          error: error.toString()
        }); 
      });
  }

  render() {
    return (
      <div>
        <Helmet>
            <title>
            Prenotazioni | SmartBooking
            </title>
        </Helmet>
         <AppNavbar/>
        {
          this.state.content === ">>> User Contents!" ? (
              <Container fluid style = {{paddingTop: "40px"}}> 
              <Row style = {{justifyContent: "center"}}>
                <Col xs = "12" xl ="5">
                  <CardOpenCalendar/>
                </Col>
              </Row>
              <Row style = {{justifyContent: "center"}}>
                <Col xs = "12" xl ="5" style={{paddingTop: "40px"}}> 
                  <Card/>
                </Col>
                <Col xs = "12" xl ="5" style={{paddingTop: "40px"}}> 
                  <Card2/>
                </Col>
              </Row>         
            </Container>
          ) : (
            <Alert variant="info">
                <h2>Non sei autorizzato a visualizzare questa pagina. Effettua il login oppure registrati.</h2>
            </Alert>
          )
        }
        
      </div>
    );
  }
}

export default UserPage;