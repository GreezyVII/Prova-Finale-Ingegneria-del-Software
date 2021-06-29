/*
  Component che gestisce la pagina di registrazione.
*/

// --------------------------------------------------------
import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Alert } from '@material-ui/lab';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from "./Copyright";
import {Helmet} from "react-helmet"
import img from "../../../src/signup.jpg"
import Image from 'react-bootstrap/Image'
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Authentication from '../services/AuthenticationService'
// --------------------------------------------------------

// RegEx per verifica email.
// eslint-disable-next-line
const validEmailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

// Metodo per validare il form con i dati inseriti.
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

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
      backgroundColor: theme.palette.secondary.main,
  },
  form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
  },
  submit: {
      margin: theme.spacing(3, 0, 2),
  },
});

class SignUp extends Component {
  // Costruttore
  constructor(props) {
    super(props);
    // Definisco state
    this.state = {
      firstname: "", // Nome
      lastname: "", // Cognome
      username: "", // Username
      confirmPassword: "", // Conferma password
      checked: false, // Parrucchiere? Y/N
      email: "", // Email
      phone: "", // Telefono
      password: "", // Password
      message: "", // Messaggio di errore

      successful: false, // Registrazione corretta? Y/N
      validForm: true, // Dati validati? Y/N

      // Vettore di errori relativi a ciascun campo.
      errors: {
        firstname: '',
        lastname: '',
        username: '',
        phone: "",
        email: '',
        password: '',
        confirmPassword: ""
      }
    };
  }
  // Metodo per cambiare ed impostare valori selezionati.
  changeHandler = (event) => {
    const { name, value } = event.target;
    let errors = this.state.errors;
  
    // In base al nodo selezionato, verifico che sia valido, altrimenti comunico errore.
    switch (name) {
      case 'firstname':
        errors.firstname = 
          value.length < 3
            ? 'Il nome deve essere lungo almeno 3 caratteri!'
            : '';
        break;
      case 'lastname':
        errors.lastname = 
          value.length < 3
            ? 'Il cognome deve essere lungo almeno 3 caratteri!'
            : '';
        break;
      case 'username':
        errors.username = 
          value.length < 5
            ? 'Lo username deve essere lungo almeno 5 caratteri!'
            : '';
        break;
      case 'email': 
        errors.email = 
          validEmailRegex.test(value)
            ? ''
            : 'Email non valida!';
        break;
      case "phone": 
        errors.phone = 
          value.length !== 10 ? (
            "Il numero di telefono deve essere lungo 10 caratteri!")
            :(
              ""
            );
            break;
      case 'password': 
        errors.password = 
          value.length < 8
            ? 'La password deve essere lunga almeno 8 caratteri!'
            : '';
            break;
      case 'confirmPassword': 
      errors.confirmPassword = 
        value !== this.state.password
          ? 'Le password non coincidono!'
          : '';
          break;
      default:
        break;
    }
  
    this.setState({errors, [name]: value}, ()=> {})  
  }

  // Metodo per salvare check parrucchiere.
  handleChange = (event) => {
    this.setState({checked: event.target.checked});
  };

  // Metodo per effettuare registrazione nel DB.
  signUp = (e) => {
    e.preventDefault(); // Evito che la richiesta venga fatta più di una volta.
    const valid = validateForm(this.state.errors); // Salvo in una costante il booleano per verificare che il form sia valido.
    this.setState({validForm: valid});

    // Se è valido, procedo con la registrazione.
    if(valid){
      // Invoco endpoint e registro utente.
      Authentication.register(
        this.state.firstname,
        this.state.lastname,
        this.state.username,
        this.state.phone,
        this.state.email,
        this.state.password,
        this.state.checked
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
          this.props.history.push('/signin');
        },
        error => {
          console.log("Errore! " + error.toString());
          
          this.setState({
            successful: false,
            message: error.toString()
          });
        }
      );  
    }
  }

  render() {
    const errors = this.state.errors;
    const {classes} = this.props

    return (
      <div>
        <Helmet>
            <title>
            Registrazione | SmartBooking
            </title>
          </Helmet>
        <AppNavbar/>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Image src={img} fluid style={{width:"100px", height: "auto"}}></Image>
                <Typography component="h1" variant="h5">
                    Registrazione
                </Typography>
                <form className={classes.form} onSubmit={this.signUp}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstname"
                                variant="outlined"
                                required
                                fullWidth
                                id="nome"
                                value = {this.state.firstname}
                                label="Nome"
                                autoFocus
                                onChange={this.changeHandler}
                            />

                            {
                              errors.firstname && ( 
                                  <Alert severity="error" style = {{fontSize: "10px"}}>
                                    {errors.firstname}
                                  </Alert>
                                )
                            }
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="cognome"
                                label="Cognome"
                                name="lastname"
                                autoComplete="lname"
                                onChange={this.changeHandler}
                            />
                        </Grid>
                        {
                          errors.lastname && ( 
                              <Alert severity="error" style = {{fontSize: "10px"}}>
                                {errors.lastname}
                              </Alert>
                            )
                        }
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="numeroTelefono"
                                label="Telefono"
                                name="phone"
                                onChange={this.changeHandler}
                            />
                        </Grid>
                        {
                          errors.phone && ( 
                              <Alert severity="error" style = {{fontSize: "10px"}}>
                                {errors.phone}
                              </Alert>
                            )
                        }

                        <Grid item xs={6}>
                        <FormControlLabel
                          control={<Checkbox checked={this.checked} onChange={this.handleChange} 
                          name="checked" />}
                          label="Sei un parrucchiere?"
                        />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                onChange={this.changeHandler}
                            />
                        </Grid>
                        {
                          errors.email && ( 
                              <Alert severity="error" style = {{fontSize: "10px"}}>
                                {errors.email}
                              </Alert>
                            )
                        }
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                onChange={this.changeHandler}
                            />
                        </Grid>
                        {
                          errors.username && ( 
                              <Alert severity="error" style = {{fontSize: "10px"}}>
                                {errors.username}
                              </Alert>
                            )
                        }
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                onChange={this.changeHandler}
                            />
                        </Grid>
                        {
                          errors.password && ( 
                              <Alert severity="error" style = {{fontSize: "10px"}}>
                                {errors.password}
                              </Alert>
                            )
                        }
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Conferma Password"
                                type="password"
                                id="confPassword"
                                onChange={this.changeHandler}
                            />
                        </Grid>
                        {
                          errors.confirmPassword && ( 
                              <Alert severity="error" style = {{fontSize: "10px"}}>
                                {errors.confirmPassword}
                              </Alert>
                            )
                        }
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Registrati
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/signin" variant="body2">
                                Hai già un account? Accedi.
                            </Link>
                        </Grid>
                    </Grid>
                </form>
                {
                  this.state.message !== "" ? (
                  <Alert severity="error" style = {{fontSize: "10px"}}>
                    {this.state.message}
                  </Alert>
                  ):(
                    <div></div>
                  )
                }
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
        
      </div>);
  }
}

export default withStyles(useStyles)(SignUp);