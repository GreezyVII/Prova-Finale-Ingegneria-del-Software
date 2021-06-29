/*
  Component che comprende la Navbar utilizzata e modulata in tutte le pagine dell'applicativo.
*/

// --------------------------------------------------------
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import jwt from 'jwt-decode'
import { withRouter } from 'react-router-dom';
import AuthenticationService from '../services/AuthenticationService';

import { withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import img from "../../../src/sb_round.png"
import Image from 'react-bootstrap/Image'
// --------------------------------------------------------

// Hook per stili Primereact | Material UI.
const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

class AppNavbar extends Component {
  // Costruttore.
  constructor(props) {
    super(props);

    // Definisco state.
    this.state = {
      showUser: false,
      showPM: false,
      username: undefined,
      login: false
    };
  }

  // E' invocato dopo che il componente è montato, qui effettuo le richieste 
  // all'endpoint BE.
  componentDidMount() {
    // Ottengo token utente loggato.
    const user = AuthenticationService.getCurrentUser();
    
    // Verifico se è diverso da null, 
    if (user) {
      // Ottengo ruoli e nome dell'utente loggato.
      const roles = user.ruoli
      const nome = (jwt(user.accessToken)).sub

      // Imposto nome e permessi dell'utente loggato nello state.
      this.setState({
        showUser: true,
        showPM: roles.includes("ROLE_PM"),
        login: true,
        username: nome
      });
    }
  }

  // Metodo che mi permette di effettuare il logout dell'utente dalla sessione.
  signOut = () => {
    AuthenticationService.signOut();
    this.props.history.push('/home');
    window.location.reload();
  }

  render() {
    const {classes} = this.props

    return(
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <Link to ="/home" style={{color: "#fff", textDecoration: "none"}}>
            <Button color="inherit" style={{fontSize:"18px"}}>
              <Image src={img} style={{width: "70px", height: "auto", borderRadius: "50%"}}></Image>
            </Button>
          </Link>
          <Link to ="/home" style={{color: "#fff", textDecoration: "none"}}><Button color="inherit"><HomeIcon/></Button></Link>
            {
              // Verifico se devo mostrare pagina utente.
              this.state.showUser && 
              <Link to="/user" style ={{color: "#fff", textDecoration: "none", paddingLeft: "10px"}}>
                <Button color="inherit">Prenotazioni</Button>
              </Link>
            }
            {
              // Verifico se devo mostrare pagina parrucchiere.
              this.state.showPM && 
              <Link to="/pm" style ={{color: "#fff", textDecoration: "none", paddingLeft: "10px"}}>
                <Button color="inherit">Parrucchiere</Button>
              </Link>
            }
        </Typography>
        {
          // Se l'utente è loggato, mostro i link al profilo ed al logout, altrimenti, mostro quelli
          // per accedere o registrarsi.
          this.state.login ? (
              <Typography variant="h6">
                <Link to = "/profile" style = {{color: "#fff", textDecoration: "none"}}> <Button color="inherit" style={{color: "#fff"}}> <AccountCircleIcon/> {this.state.username}</Button></Link>
                <Link to = "/#" style = {{color: "#fff", textDecoration: "none"}}> <Button variant = "contained" color="secondary" style={{color: "#fff"}} onClick={this.signOut}> <ExitToAppIcon/></Button></Link>            
              </Typography>
          ) : (
            <div>
              <Link to="/signin" style={{textDecoration: "none"}}>
                <Button variant = "contained" color="secondary" > Accedi</Button>
              </Link>
              <Link to="/signup">
                <Button color="inherit" style={{color: "#fff"}}>Registrati</Button>
              </Link>
            </div>
          )
        }
      </Toolbar>
    </AppBar>
    )
  }
}

export default withRouter(withStyles(useStyles)(AppNavbar));


