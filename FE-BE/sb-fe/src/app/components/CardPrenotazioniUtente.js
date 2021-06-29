/*
    Component con tabella con prenotazioni utente.
*/

// --------------------------------------------------------
import React, {Component} from 'react';
import { withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { Tag } from 'primereact/tag';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import "primeicons/primeicons.css"
import 'primeflex/primeflex.css';
import UtilityService from '../services/UtilityService'
import AuthenticationService from '../services/AuthenticationService'
import jwt from "jwt-decode"

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
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
  chip: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
});

class CardBox extends Component {
    // Costruttore.
    constructor(props) {
        super (props)
        // Definisco state.
        this.state = {
            user: "", // Memorizzo utente loggato.
            roles: "", // Memorizza ruoli utente loggato.
            prenotazioni : [] // Memorizza lista di prenotazioni ricevute da endpoint remoto.
        }
    }
    
    // E' invocato dopo che il componente è montato, qui effettuo le richieste 
    // all'endpoint BE.
    componentDidMount() {
        // Ottengo token JWT.
        let user = AuthenticationService.getCurrentUser()
        if (user != null){
            // Imposto utente e ruoli.
            this.setState({user: user});
            this.setState({roles:user.ruoli})
            
            // Ottengo username da Token JWT.
            const un = (jwt(user.accessToken)).sub

            // Ottengo tutte le prenotazioni di un relativo utente.
            UtilityService.getAllByUsername(un).then(
                response => {
                    // Salvo prenotazioni nel relativo state.
                    this.setState({prenotazioni: response})
                }, error => {
                    console.log(error)
                }
            )
        }
    }

    render (){
        const classes = this.props;
        const prens = this.state.prenotazioni
        let info;
        // Se ci sono prenotazioni, genero le righe della tabella altrimenti comunico che non ce ne sono.
        if (prens.length > 0){
            info = prens.map((el)=>                 
                <TableRow>
                    <TableCell align="center">
                        {(new Date(el.date)).getDate()} {(new Date(el.date)).toLocaleString('default', { month: 'long' })} {(new Date(el.date)).getFullYear()} alle ore {(new Date(el.date)).getHours() - 2}:{(new Date(el.date)).getMinutes()} 
                    </TableCell>
                    <TableCell align ="center">
                        {
                            el.prezzo === 13 ? (
                                <Tag className="p-mr-2" value={"€" + el.prezzo + " | solo taglio" }></Tag>
                            ):(
                                el.prezzo === 15 ? (
                                    <Tag className="p-mr-2" value={"€" + el.prezzo+ " | taglio + shampoo" }></Tag>
                                ): (
                                    <Tag className="p-mr-2" value={"€" + el.prezzo+ " | taglio + barba + shampoo" }></Tag>
                                )
                            )
                        }
                    </TableCell>
                    <TableCell align="center">
                        <Chip
                            avatar={<Avatar>{((el.parrucchiere.split(" "))[0]).charAt(0) + ((el.parrucchiere.split(" "))[1]).charAt(0)}</Avatar>}
                            label={el.parrucchiere}
                            color="primary"
                        />                        
                    </TableCell>
                </TableRow>
            )
        }else{
            info = (
            <TableRow>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">
                        Nessuna prenotazione presente nel nostro database.
                    </TableCell>
                    <TableCell align="center"></TableCell>
            </TableRow>);
        }
        

        return (
            <Card className={classes.root} variant="outlined" style={{borderRadius: "20px", marginBottom:"20px"}}>
            <CardContent style = {{padding: "20px", textAlign: "center"}}>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                <strong>Prenotazioni</strong>
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    Di seguito trovi elencate tutte le tue prenotazioni.
                </Typography>
                <TableContainer component={Paper} style = {{marginTop: "20px"}}>
                    <Table className={classes.table} aria-label="simple table" >
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Data Prenotazione</TableCell>
                                <TableCell align="center">Tipo Taglio</TableCell>
                                <TableCell align="center">Parrucchiere</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {   
                            info
                        }
                        </TableBody>
                    </Table>
            </TableContainer>
            </CardContent>  
            </Card>
        );
    }
}

export default withStyles(useStyles)(CardBox);