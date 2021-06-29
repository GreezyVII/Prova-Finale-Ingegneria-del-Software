/*
    Component con card con tutti le informazioni di un utente.
    Potranno essere modificate e dunque aggiornate.
*/

// --------------------------------------------------------
import React, {Component} from 'react';
import { withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import "primeicons/primeicons.css"
import 'primeflex/primeflex.css';
import UtilityService from '../services/UtilityService'
import AuthenticationService from '../services/AuthenticationService'
import jwt from "jwt-decode"

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Alert } from '@material-ui/lab';

import Swal from "sweetalert2"
// --------------------------------------------------------

// Hook per stili Primereact | Material UI.
const useStyles = theme =>({
  root: {
    minWidth: 275,
    
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  table: {
    minWidth: 650,
  },
});

// eslint-disable-next-line
const validEmailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

// Metodo per validare form.
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

class CardBox extends Component {
    // Costruttore
    constructor(props) {
        super (props)
        // Definisco state
        this.state = {
            user: "",  // Utente loggato
            roles: "",  // Ruoli utente loggato
            firstname: "", // Nome
            lastname: "", // Cognome
            username: "", // Username
            email: "", // Email
            phone: "", // Telefono
      
            successful: false,
            validForm: true,
      
            errors: {
              firstname: '',
              lastname: '',
              phone: "",
              email: ''
            }
          };
    }
    // Metodo per cambiare ed impostare valori selezionati.
    changeHandler = (event) => {
        const { name, value } = event.target;
        let errors = this.state.errors;
        
        // In base al nodo modificato, effettuo verifica e validazione.
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
          default:
            break;
        }
      
        this.setState({errors, [name]: value}, ()=> {})  
    }
    
    // Metodo per cambiare ed impostare valori selezionati.
    componentDidMount() {
        // Ottengo token JWT.
        let user = AuthenticationService.getCurrentUser()
        if (user != null){  
            this.setState({user: user});
            this.setState({roles:user.ruoli})
            const un = (jwt(user.accessToken)).sub
            // eslint-disable-next-line
            this.state.username = un

            // Ottengo tutte le informazioni dell'utente conoscendo il suo username.
            UtilityService.getInfoByUsername(un).then(
                response => {
                    // eslint-disable-next-line
                    this.state.firstname = response.nome
                    // eslint-disable-next-line
                    this.state.lastname = response.cognome
                    // eslint-disable-next-line
                    this.state.phone = response.telefono
                    this.setState({
                        email:  response.email
                    })
                },error=> {
                    console.log (error)
                }
            )
            
        }
    }

    // Metodo per aggiornare le informazioni dell'utente nel DB
    saveUpdate = (e) => {
        e.preventDefault(); // Evito che la richiesta venga fatta più di una volta.
        const valid = validateForm(this.state.errors); // Verifico che il form sia valido.
        this.setState({validForm: valid});

        if(valid){
            // Invoco endpoint per aggiornare dati dell'utente.
            UtilityService.updateInfo(this.state.username, this.state.firstname, this.state.lastname, this.state.phone, this.state.email).then(
                response => {
                    if (response){
                        // Comunico esito positivo
                        Swal.fire({
                            icon: 'success',
                            title: 'Dati Salvati',
                            text: 'I dati sono stati aggiornati correttamente!',
                          })
                    }else{
                        // Comunico esito negativo
                        Swal.fire({
                            icon: 'error',
                            title: 'Errore',
                            text: 'I dati NON sono stati aggiornati!',
                          })
                    }
                }, error => {
                    console.log(error)
                }
            )
        }
    }

    render (){
        const classes = this.props;
        const errors = this.state.errors
        return (
            <Card className={classes.root} variant="outlined" style={{borderRadius: "20px", marginBottom:"20px"}}>
            <CardContent style = {{padding: "20px", textAlign: "center"}}>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                <strong>Informazioni Personali</strong>
                </Typography>
                
                <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <div className={classes.paper} style = {{marginTop : "20px"}}>
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
                                            value = {this.state.lastname}
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
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="numeroTelefono"
                                            value = {this.state.phone}
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
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email"
                                            value = {this.state.email}
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
                                                                   
                                   
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick = {this.saveUpdate}
                                    style = {{marginTop: "17px"}}
                                >
                                    Salva Modifiche
                                </Button>
                            </form>
                        </div>
                    </Container>

            </CardContent>  
            </Card>
        );
    }
}

export default withStyles(useStyles)(CardBox);