/*
    Component che gestisce pagina relativa al parrucchiere.
*/

// --------------------------------------------------------
import AppNavbar from './AppNavbar';
import React, { Component } from 'react';
import { Container} from 'reactstrap';
import { Alert } from "reactstrap";
import BackendService from '../services/BackendService';
import Helmet from "react-helmet"
import Grafico from "./Grafico"
// --------------------------------------------------------

class Hairstylist extends Component {
  // Costruttore.
  constructor(props) {
    super(props);
    this.state={
      content: "",
      error: "",
    }
  }

  // Metodo per cambiare ed impostare valori selezionati.
  componentDidMount() {
      // Verifico permessi pagina.
      BackendService.getPmBoard()
      .then( response => {
          this.setState({
          content: response.data
        })
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
        <AppNavbar/>
        <Helmet>
            <title>
                Parrucchiere | SmartBooking
            </title>
        </Helmet>
        <Container fluid>
          {
            this.state.content ? (
              <Grafico></Grafico>
            ) : (
              <div style={{marginTop: "20px"}}>
                <Alert color="danger">
                  {this.state.error}
                </Alert>
              </div>
            )
          }
        </Container>
      </div>
    );
  }
}

export default (Hairstylist);