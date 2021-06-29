/*
    Component che comprende un card per verificare se è possibile prenotare ad una 
    determinata data, orario e parrucchiere.
*/

// --------------------------------------------------------
import React, {Component} from 'react';
import { withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import "primeicons/primeicons.css"
import 'primeflex/primeflex.css';
import {Row, Col } from 'reactstrap';
import UtilityService from '../services/UtilityService'
import Swal from 'sweetalert2'
import Select from '@material-ui/core/Select';
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
            dataSelezionata: new Date(), // Memorizza data selezionata
            oraSelezionata: "", // Memorizza orario selezionato
            hairstyler: "", // Memorizza parrucchiere selezionato
            stylists: [] // Memorizza lista di parrucchieri
        }

        // Array con tutti gli orari selezionabili.
        this.orari = [
            {name: "8:30",  code: "8"},
            {name: "9:30",  code: "9"},
            {name: "10:30", code: "10"},
            {name: "11:30", code: "11"},
            {name: "13:30", code: "13"},
            {name: "14:30", code: "14"},
            {name: "15:30", code: "15"},
            {name: "16:30", code: "16"},
            {name: "17:30", code: "17"},
            {name: "18:30", code: "18"},
            {name: "19:30", code: "19"}            
        ];
    }
    
    // Metodo per cambiare ed impostare valori selezionati.
    changeHandler =(event) =>{  
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    // E' invocato dopo che il componente è montato, qui effettuo le richieste 
    // all'endpoint BE.  
    componentDidMount() {
        // Invoco backend remoto per salvare i parrucchieri presenti.
        UtilityService.getStylists().then(response => 
            {      
                this.setState({stylists: response})
            }, (error) => {
                console.log(error)
        })
    }

    // Metodo per verificare disponibilità.
    verificaDisponibilita = async(e) =>{
        e.preventDefault(); // Evito che la richiesta venga fatta più di una volta.

        // Verifico che i siano stati compilati i campi.
        if (this.state.dataSelezionata !== null && this.state.oraSelezionata !=="" && this.state.hairstyler !== ""){
                // Invoco endpoint remoto per verifica disponibilità.
                UtilityService
                .isDisponibile (this.state.dataSelezionata, this.state.oraSelezionata, this.state.hairstyler)
                    .then((response)=>{
                    // In base all'esito, comunico
                    if (response === true){
                        Swal.fire({
                            icon: 'success',
                            title: 'Disponibile!',
                            text: "E' possibile prenotare un appuntamento alla data indicata.\n Utilizza l'apposita funzione e prenotati prima che lo faccia qualcun altro!"
                        })
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Non Disponibile',
                            text: "Ci dispiace, ma alla data indicata risulta già presente un'altra prenotazione."
                        })
                    }
                }, error => {
                    console.log(error)
                }
            );
        }else{
            Swal.fire('Compila tutti i campi richiesti.')
        }     
    }

    render (){
        const classes = this.props;
        const st = this.state.stylists
        return (
            <Card className={classes.root} variant="outlined" style={{borderRadius: "20px"}}>
            <CardContent style = {{padding: "20px", textAlign: "center"}}>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                <strong>Ricerca Disponibilità</strong>
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                Inserisci data, orario e parrucchiere per sapere se <br/> è possibile prenotare un taglio.
                </Typography>
                <Row style = {{justifyContent: "center", paddingTop : "20px"}}>
                    <Col >
                        <Calendar id="icon" value = {this.state.dataSelezionata} dateFormat="dd/mm/yy" name = "dataSelezionata" onChange={this.changeHandler} showIcon />
                    </Col>
                    <Col >
                        <Dropdown value = {this.state.oraSelezionata} options ={this.orari.map(orario => orario.name)}
                        name = "oraSelezionata"
                        onChange = {this.changeHandler}
                        placeholder="Seleziona un orario" />
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
                <Button variant="contained" color="primary" size="medium" onClick = {this.verificaDisponibilita}>Verifica disponibilità</Button>
            </CardActions>
            </Card>
        );
    }
}

export default withStyles(useStyles)(CardBox);