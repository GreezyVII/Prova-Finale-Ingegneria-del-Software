/*
    Component che gestisce pagina di login iniziale dell'utente.
*/

// --------------------------------------------------------
import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import {Alert} from "reactstrap";
import AuthenticationService from "../services/AuthenticationService";

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from "./Copyright";
import {Helmet} from "react-helmet"
import img from "../../../src/avatar.png"
import Image from 'react-bootstrap/Image'
// --------------------------------------------------------

// Hook per stili Primereact | Material UI.
const useStyles = (theme) => ({
  paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
  },
  avatar: {
      margin: theme.spacing(1),
  },
  form: {
      width: '100%',
      marginTop: theme.spacing(1),
  },
  submit: {
      margin: theme.spacing(3, 0, 2),
  },
});

class Login extends Component {
  // Costruttore.
  constructor(props) {
    super(props);

    // Definisco state.
    this.state = {
      username: "", // Memorizza username inserito
      password: "", // Memorizza password inserita
      error: "" // Memorizza eventuali errori
    };
  }
  

  // Metodo che mi permette di settare i parametri appena avviene un "aggiornamento".
  changeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  // Metodo per effettuare il login e verificare che esistano le credenziali inserite.
  doLogin = async (event) => {
    event.preventDefault();

    AuthenticationService
        .signin(this.state.username, this.state.password).then(
        () => {
          // Autenticazione andata a buon fine, indirizzo l'utente alla pagina del suo profilo.
          this.props.history.push('/profile');
        },
        error => { // Autenticazione errata. Comunico errore.
          console.log("Login errato: errore = { " + error.toString() + " }");
          this.setState({error: "Login errato! Controlla username/password e riprova."});
        }
    );
  }

  render() {
    const {classes} = this.props
    return ( 
      <div>
        <AppNavbar/>
        <Container component="main" maxWidth="xs">
            <Helmet>
              <title> Login | SmartBooking</title>
              </Helmet> 
            <CssBaseline />
            <div className={classes.paper}>
                <Image src={img} fluid style={{width:"100px", height: "auto"}}></Image>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <form className={classes.form} onSubmit={this.doLogin}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Username"
                        name="username"
                        value = {this.state.username}
                        autoComplete="username"
                        autoFocus
                        onChange={this.changeHandler}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        value = {this.state.password}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={this.changeHandler}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Accedi
                    </Button>
                    {
                      this.state.error && (
                        <Alert color="danger">
                          {this.state.error}
                        </Alert>
                      )
                    }
                    <Grid container>
                        <Grid item xs>
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                {"Non hai un account? Registrati ora!"}
                            </Link>
                        </Grid>
                    </Grid>
                    
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
      </div>);
  }
}

export default withStyles(useStyles)(Login);