/*
    Component che gestisce pagina relativa al profilo di un utente.
*/

// --------------------------------------------------------
import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import {Container } from 'reactstrap';
import { Alert } from "react-bootstrap"
import jwt from 'jwt-decode'
import {Row, Col } from 'reactstrap';
import AuthenticationService from '../services/AuthenticationService';
import CardPrenotazioniUtente from '../components/CardPrenotazioniUtente'
import UserInfoCard from "../components/UserInfoCard"
import {Helmet} from "react-helmet"
// --------------------------------------------------------

class Profile extends Component {
  // Costruttore.
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      roles: undefined
    };
  }

  // Metodo per cambiare ed impostare valori selezionati.
  componentDidMount() {
    // Ottengo token JWT.
    let user = AuthenticationService.getCurrentUser()
    if (user != null){
        // Imposto utente e relativi ruoli.
        this.setState({user: user});
        this.setState({roles:user.ruoli})
    }
  }

  render() {
    let userInfo = "";
    const user = this.state.user;
    let un=""
    if (user){
      un = (jwt(user.accessToken)).sub
    }
    if (user && user.accessToken) {
      userInfo = (
                <Container fluid>
                  <Row style = {{justifyContent: "center", marginTop: "40px"}}> 
                    <Col xs ="12" xl="4">
                        <UserInfoCard></UserInfoCard>
                    </Col>
                    <Col xs ="12" xl="8">
                      <CardPrenotazioniUtente></CardPrenotazioniUtente> 
                    </Col>
                  </Row>
                </Container>
              );
    } else { 
      userInfo = <div>
                  <Alert variant="info">
                      <h2>Non sei autorizzato a visualizzare questa pagina. Effettua il login oppure registrati.</h2>
                  </Alert>
                  </div>
    }

    return (
      <div>
        <AppNavbar/>
          <Helmet>
            <title>
            {un} | SmartBooking
            </title>
          </Helmet>
        <Container fluid>
        {userInfo}
        </Container>
      </div>
    );
  }
}

export default Profile;