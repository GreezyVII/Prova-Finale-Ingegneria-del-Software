/*
    Component che comprende un card per conoscere 
    la prima data ed orario disponibili per un determinato parrucchiere.
*/

// --------------------------------------------------------
import React, {Component} from 'react';
import { withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import "primeicons/primeicons.css"
import 'primeflex/primeflex.css';
import {Row, Col } from 'reactstrap';
import Select from '@material-ui/core/Select';
import UtilityService from '../services/UtilityService'
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
});

class CardBox extends Component {
    // Costruttore.
    constructor(props) {
        super (props)

        // Definisco state.
        this.state = {
            firstAvailable : "", // Memorizza la prima prenotazione disponibile ottenuta da endpoint remoto.
            stylists: [], // Memorizza lista di parrucchieri ottenuta da endpoint remoto.
            hairstyler: "" // Memorizza il parrucchiere selezionato
        }
    }

    // Metodo per ottenere la prima prenotazione disponibile per un determinato parrucchiere.
    firstAvailable = async(e) =>{
        e.preventDefault();

        // Verifico che sia stato selezionato un parrucchiere.
        if (this.state.hairstyler !== ""){
            // Invoco endpoint remoto.
            UtilityService
                .firstAvailable (this.state.hairstyler)
                    .then((response)=>{
                        this.setState({firstAvailable: response})
                        
                }, error => {
                    console.log(error)
                }
            );  
        }else{
            Swal.fire('Seleziona un parrucchiere.')
        }
    }

    // E' invocato dopo che il componente è montato, qui effettuo le richieste 
    // all'endpoint BE.
    componentDidMount() {
        // Ottengo parrucchieri memorizzati nel DB tramite invocazione endpoint remoto.
        UtilityService.getStylists().then(response => 
            {      
                this.setState({stylists: response})
            }, (error) => {
                console.log(error)
        })
    }

    // Metodo per cambiare ed impostare valori selezionati.
    changeHandler =(event) =>{  
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    render (){
        const classes = this.props;
        const today = new Date(); // Salvo data odierna.
        const nextWeek = new Date(); // Salvo data tra 7 giorni
        nextWeek.setDate(today.getDate() + 7);
        let dateAndHourRes = ""; 
        const st = this.state.stylists
        
        // Verifico se è stata effettuata ricerca.
        if (this.state.firstAvailable!== ""){
            dateAndHourRes = this.state.firstAvailable.split(" ")
        }        

        return (
            <Card className={classes.root} variant="outlined" style={{borderRadius: "20px"}}>
            <CardContent style = {{padding: "20px", textAlign: "center"}}>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                <strong>Primo Appuntamento Disponibile</strong>
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                Premi il pulsante sottostante per sapere il primo appuntamento<br/>
                disponibile entro la prossima settimana <br/>
                <strong>
                ({today.getDate()} {today.toLocaleString('default', { month: 'long' })} {today.getFullYear()} - {nextWeek.getDate()} {nextWeek.toLocaleString('default', { month: 'long' })} {nextWeek.getFullYear()})
                </strong>
                </Typography>
                <Row style = {{justifyContent: "center", paddingTop : "17px"}}>
                    <Col>
                    {
                        this.state.firstAvailable ? (
                            <Typography className={classes.pos} color="textSecondary">
                                Il primo appuntamento disponibile è il: <strong>{dateAndHourRes[0]} alle {dateAndHourRes[1]}</strong>
                            </Typography>
                        ) : (
                            <Typography className={classes.pos} color="textSecondary">
                                Nessuna ricerca effettuata.
                            </Typography>
                        )
                    }
                    </Col>    
                </Row>
                <Row style = {{justifyContent: "center", paddingTop : "20px"}}>
                    <Col>
                        <Select
                            native
                            value={this.hairstyler}
                            onChange={this.changeHandler}
                            inputProps={{
                                name: 'hairstyler',
                                id: 'hairstyler_id',
                            }}
                            style={{color: "black", backgroundColor: "white", opacity:"80%"}}
                            >
                            {
                                st.map((parrucchiere) =>
                                    parrucchiere ? (
                                        <option value = {parrucchiere.id}>{parrucchiere.nome}</option>
                                    ) : (
                                        <option></option>
                                    )
                                )
                            }
                        </Select>
                    </Col>
                </Row>
            </CardContent>
            <CardActions style = {{justifyContent: "center", paddingBottom: "20px"}}>  
                <Button variant="contained" color="primary" size="medium" onClick = {this.firstAvailable}>Cerca</Button>
            </CardActions>
            </Card>
        );
    }
}

export default withStyles(useStyles)(CardBox);