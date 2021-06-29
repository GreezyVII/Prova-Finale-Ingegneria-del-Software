/*
    Component che gestisce il calendario delle prenotazioni di tutti i parrucchieri 
    inseriti nel sistema. 
*/

// --------------------------------------------------------
import AppNavbar from './AppNavbar';
import React, { Component } from 'react';
import { withStyles} from '@material-ui/core/styles';
import { Container, Row, Col} from 'reactstrap';
import BackendService from '../services/BackendService';
import { Alert } from "react-bootstrap"
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Calendar } from 'primereact/calendar';

import DeleteIcon from  '@material-ui/icons/Delete';
import Table from '@material-ui/core/Table';
import FormControl from '@material-ui/core/FormControl';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Tag } from 'primereact/tag';
import 'primeflex/primeflex.css';
import "primereact/resources/primereact.min.css"
import jwt from "jwt-decode"
import Swal from "sweetalert2"
import SaveIcon from '@material-ui/icons/Save';
import Select from '@material-ui/core/Select';

import UtilityService from '../services/UtilityService'
import AuthenticationService from "../services/AuthenticationService"
// --------------------------------------------------------

// Hook per stili Primereact | Material UI.
const useStyles = theme => ({
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
    button: {
        margin: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
});

class CalendarPage extends Component {
    // Costruttore.
    constructor(props) {
        super(props);

        // Definisco state.
        this.state={
            username: "", // Username utente 
            content: "", // Contenuto in base ai permessi
            hairstyler: "", // Parrucchiere selezionato
            hsId: "", // Id parruccchiere loggato
            error: "", // Eventuali errori
            ruoli: [], // Ruolo utente loggato
            dataSelezionata: new Date(), // Data di ricerca selezionata.
            rows : [], // Lista di prenotazioni ottenuto da Endpoint in base a data e parrucchiere selezionato
            stylists: [], // Lista di parrucchieri ottenuta da Endpoint.
        }   
  }

// Metodo per aggiornare una giornata di prenotazioni.
updateGiorno = async() =>{
    // Verifico che la data ricercata sia successiva a quella odierna.
    if(this.state.dataSelezionata.getDate() < (new Date()).getDate()){
        // Comunico che bisogna cercare solo date successive ad oggi
        Swal.fire({
            icon: 'error',
            title: 'Data errata',
            text: 'La ricerca è disponibile solo per le date successive ad oggi!',
          }).then(() =>{
                // Reimposto data a quella odierna ed effettuo refresh della pagina.
                this.state.dataSelezionata = new Date()
                this.updateGiorno()
          })
    }else{
        // Verifico che il parrucchiere sia stato selezionato.
        if (this.state.hairstyler !== ""){
            // Ottengo prenotazioni in base a parrucchiere e giorno selezionato da endpoint remoto.
            UtilityService
            .getPrenotationsByDayAndHairstyler (this.state.dataSelezionata, this.state.hairstyler).then (
                response => {
                    // Salvo la risposto nell'apposito state.
                    this.setState({rows : response})
            },error => {
                // Comunico errore a console.
                console.log(error)
            })
        }else{
            // Comunico che bisogna scegliere un parrucchiere prima di procedere.
            Swal.fire({
                icon: 'warning',
                title: 'Seleziona un parrucchiere per caricare le relative date disponibili.'
            })
        }
    }
}

// Metodo per settare data selezionata ed effettuare refresh della pagina
// (non uso setState perchè voglio aggiornare con updateGiorno())
changeHandler = (event) =>{  
    let val = event.target.value;
    // eslint-disable-next-line
    this.state.dataSelezionata = val
    this.updateGiorno()       
}

// Metodo per settare parrucchiere selezionato ed effettuare refresh della pagina
// (non uso setState perchè voglio aggiornare con updateGiorno())
handleChange = (event) => {
    const val = event.target.value;
    // eslint-disable-next-line
    this.state.hairstyler = val;
    this.updateGiorno()      
};

// E' invocato dopo che il componente è montato, qui effettuo le richieste 
// all'endpoint BE.
componentDidMount() {
    // Ottengo token JWT.
    const user = AuthenticationService.getCurrentUser();
    if (user){
        // eslint-disable-next-line
        this.state.ruoli = user.ruoli // Ottengo ruoli in base a utente loggato
        const nome = (jwt(user.accessToken)).sub // Ottengo username in base a utente loggato

        // Chiamata endpoint per ottenere id utente conoscendo username.
        UtilityService.getIdByUsername(nome).then(response => 
        {      
            // Setto lo state relativo con la risposta ricevuta dall'endpoint.
            this.setState({hsId: response})
        }, (error) => {
            console.log(error)
        })

        // Setto state per username utente.
        this.setState({username: nome})

        // Chiamata endpoint per ottenere lista dei parrucchieri contenuta nel DB.
        UtilityService.getStylists().then(response => 
            {      
                // Setto lo state relativo con la risposta ricevuta dall'endpoint.
                this.setState({stylists: response})
            }, (error) => {
                console.log(error)
            })
    }
    // Effettua refresh del giorno.
    this.updateGiorno() 

    // Verifico i permessi relativi all'utentel.
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

// Metodo che genera modale per inserire una prenotazione.
insertModal = async(e, ora) => {
    e.preventDefault(); // Evito che la richiesta venga fatta più di una volta.
    const dataS = this.state.dataSelezionata // Salvo in una costante la data selezionata.
    const un = this.state.username // Salvo in una costante username utente che sta prenotando.
    const hs = this.state.hairstyler // Salvo in una costante parrucchiere selezionato.
    let datas = new Date(this.state.dataSelezionata) // Creo data di appoggio uguale alla data selezionata.
    datas.setHours(ora)
    datas.setMinutes(30)
    datas.setSeconds(0)

    // Creo data attuale con aggiunta 30 minuti, in modo che l'utente non posso prenotare 
    // troppo vicino all'ora dell'eventuale taglio.
    let attPlus30 = new Date()
    attPlus30.setMinutes(attPlus30.getMinutes() + 30)

    // Verifico se la data selezionata è antecedente di almeno 30 minuti all'orario attuale.
    if (datas>=attPlus30){
        // Comunico all'utente di scegliere il taglio desiderato (obbligatorio).
        Swal.fire({
            title: 'Seleziona il taglio che desideri.',
            input: 'select',
            inputOptions: {
                "13": "SOLO TAGLIO - €13",            
                "15": "TAGLIO + SHAMPOO - €15",       
                "17": "TAGLIO + BARBA + SHAMPOO - €17"
            },
            inputPlaceholder: 'Seleziona un taglio',
            showCancelButton: true,
            // Metodo per validare input e non lasciarlo vuoto.
            inputValidator: function (value) {
            return new Promise(function (resolve, reject) {
                if (value !== '') {
                resolve();
                } else {
                resolve('Seleziona un tipo di taglio');
                }
            });
            }
        }).then(result => {
            // Salvo scelta effettuata dall'utente.
            const scelta = result.value

            // Se la scelta è stata confermata, aggiungo appuntamento.
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Vuoi aggiungere l'appuntamento?",
                    showDenyButton: true,   
                    showCancelButton: false,
                    confirmButtonText: `Aggiungi`,
                    denyButtonText: `Cancella`,
                }).then((result) => {
                    // Ricevo conferma di volere aggiungere appuntamento, quindi invoco
                    // endpoint remoto per salvarlo sul DB.
                    if (result.isConfirmed) {
                        UtilityService.savePren(dataS, un, ora, scelta, hs).then(
                            response => {
                                // Comunico esito positivo
                                Swal.fire('Aggiunto!', '', 'success').then(() => {
                                    this.updateGiorno()
                                })
                                
                            }, error => {
                                // Comunico esito negativo
                                Swal.fire('Errore!', '', 'error') 
                            }
                        )
                    }
                })
            }
        })
    }
    // Se mancano meno di 30 minuti all'orario attuale, allora comunico che è troppo tardi per 
    // effettuare la prenotazione.
    else if (datas<attPlus30){
        Swal.fire({
            icon: 'error',
            title: 'Inserimento prenotazione scaduto.',
            text: 'Non puoi inserire una prenotazione precedente all\'orario attuale.'
          })
    }   
}

// Metodo che genera modale per eliminare una prenotazione.
deleteModal = async(e, ora) => {
    e.preventDefault(); // Evito che la richiesta venga fatta più di una volta.
    let datas = new Date(this.state.dataSelezionata) // Creo data di appoggio uguale alla data selezionata.
    datas.setHours(ora)
    datas.setMinutes(30)
    datas.setSeconds(0)

    // Creo data attuale più 30 minuti.
    let attPlus30 = new Date() 
    attPlus30.setMinutes(attPlus30.getMinutes() + 30)

    // Verifico che l'orario attuale non sia troppo vicino all'orario di prenotazione.
    // Deve essere almeno 31 minuti antecedente.
    if (datas>=attPlus30){
        // Comunico richiesta di eliminazione appuntamento.
        Swal.fire({
            title: "Vuoi eliminare l'appuntamento?",
            showDenyButton: true,   
            showCancelButton: false,
            confirmButtonText: `Elimina`,
            denyButtonText: `Indietro`,
            }).then((result) => {
            // Se l'esito della richiesta è positivo, procedo invocando endpoint remoto.
            if (result.isConfirmed) {
                UtilityService.deletePren(this.state.dataSelezionata, this.state.username, ora, this.state.hairstyler).then(
                    response => {
                        // Elimino prenotazione dal DB e comunico esito positivo.
                        Swal.fire('Eliminato!', '', 'success').then(() => {
                            this.updateGiorno()
                        })

                    }, error => {
                        // Comunico esito negativo
                        Swal.fire('Errore!', '', 'error') 
                    }
                )
            }
        })
    }
    else if (datas<attPlus30){
        // Comunico che non è possibile eliminare una prenotazione precedente all'orario attuale.
        Swal.fire({
            icon: 'error',
            title: 'Prenotazione scaduta.',
            text: 'Non puoi eliminare una prenotazione precedente all\'orario attuale.'
          })
    }else{
        // Comunico che non è possibile eliminare una prenotazione con poco preavviso.
        Swal.fire({
            icon: 'error',
            title: 'Troppo tardi...',
            text: 'Non puoi eliminare una prenotazione con così poco preavviso!\nContatta il tuo parrucchiere.'
          })
    }
}

// Metodo che genera modale per visualizzare le informazioni di un utente.
// Sarà utilizzato solo nel caso sia loggato un utente di livello parrucchiere
// e che quest'ultimo stia visualizzando il proprio calendario.
openInfoModal = async(e, username) =>{
    e.preventDefault(); // Evito che la richiesta venga fatta più di una volta.

    // Invoco endpoint remoto per ottenere tutte le informazioni richieste dall'utente che ha prenotato.
    UtilityService.getInfoByUsername(username).then(
        // Comunico informazioni tramite modale.
        response =>{
            Swal.fire({
                    "title": "Informazioni Utente",
                    "html": 
                        ("<p>Nome: <strong>" + response.nome + "</strong> </p> " +
                        "<p>Cognome: <strong>" + response.cognome + "</strong> </p>  " +
                        "<p>Telefono: <strong>" + response.telefono + "</strong> </p> " +
                        "<p>Email: <strong>" + response.email + "</strong> </p> ")
            })
        }, error => {
            console.log(error)
        }
    )
}

render() {
    const classes = this.props
    const rows = this.state.rows
    const idP = this.state.hsId
    const hs = this.state.hairstyler
    return (
      <div>
         <AppNavbar/>
        {
            // Verifico se l'utente ha i permessi visualizzare la pagina.
            this.state.content === ">>> User Contents!" ? (
            <Container fluid style = {{paddingTop: "40px", textAlign: "center"}}> 

            <Row style={{textAlign: "center", paddingBottom:"40px"}}>
                <Col xs = "12" xl ="12" style = {{justifyContent: "center"}}>
                    <Card className={classes.root} variant="outlined" style={{borderRadius: "20px",
                        background: "rgb(27,23,93)",
                        // eslint-disable-next-line
                        background: "linear-gradient(338deg, rgba(27,23,93,1) 4%, rgba(121,9,9,1) 50%, rgba(0,212,255,1) 100%)",
                        border:"none"}}>
                        <CardContent style = {{padding: "20px", textAlign: "center", color: "white"}}>
                            <Typography className={classes.title} gutterBottom>
                                <strong>Seleziona una data ed un parrucchiere per visualizzare la relativa giornata.</strong>
                            </Typography>
                            {
                                this.state.dataSelezionata !== new Date() ? (
                                    <Calendar id="icon" value = {this.state.dataSelezionata} dateFormat="dd/mm/yy" 
                                    onChange={this.changeHandler} name = "dataSelezionata" 
                                    style = {{paddingTop : "20px"}} showIcon />
                                ):(
                                    <Calendar id="icon" value = {new Date()} dateFormat="dd/mm/yy" 
                                    onChange={this.changeHandler} name = "dataSelezionata" 
                                    style = {{paddingTop : "20px"}} showIcon />
                                )
                            }   
                            <br></br>
                            <FormControl variant="outlined" className={classes.formControl} style={{paddingTop: "15px"}}
                            >
                                <Select
                                native
                                value={this.hairstyler}
                                onChange={this.handleChange}
                                inputProps={{
                                    name: 'hairstyler',
                                    id: 'hairstyler_id',
                                }}
                                style={{color: "black", backgroundColor: "white", opacity:"80%"}}
                                >
                                {
                                    this.state.stylists.map((parrucchiere) =>
                                        parrucchiere ? (
                                            <option value = {parrucchiere.id}>{parrucchiere.nome}</option>
                                        ) : (
                                            <option></option>
                                        )
                                    )
                                }
                                </Select>
                            </FormControl>
                        </CardContent>                          
                    </Card>

                    </Col>      
                </Row>

            <Row style = {{justifyContent: "center", textAlign: "center"}}>
                <Col xs = "12" xl ="12">
                    <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="center">Orario</TableCell>
                            <TableCell align="center">Disponibilità</TableCell>
                            <TableCell align="center">Tipo Taglio</TableCell>
                            <TableCell align="center">Azioni</TableCell>
                            {   
                                // Se l'utente ha i permessi da parrucchiere, mostro la relativa colonna in tabella.
                                this.state.ruoli.includes("ROLE_PM") ? (
                                    <TableCell align="center">Info Utente</TableCell>
                                ):(
                                    <br></br>
                                )
                            }
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            rows.map((row) => (
                                    ((new Date(row.data)).getHours() - 2 === 12)  ? ( // h.12:30 --> Pausa pranzo
                                        <TableRow>
                                            <TableCell component="th" scope="row" align="center">
                                                <Tag className="p-mr-2" style={{fontSize: "15px"}} severity="info" 
                                                rounded>
                                                    {(new Date(row.data)).getHours() - 2}:30 - {(new Date(row.data)).getHours() - 1}:30
                                                </Tag>
                                            </TableCell> 
                                            <TableCell align="center">
                                                <Tag className="p-mr-2" icon="pi pi-exclamation-triangle" severity="warning" value="Pausa Pranzo"></Tag>
                                            </TableCell> 
                                            <TableCell align="center">
                                                <Tag className="p-mr-2" icon="pi pi-exclamation-triangle" severity="warning" value="Pausa Pranzo"></Tag>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tag className="p-mr-2" icon="pi pi-exclamation-triangle" severity="warning" value="Pausa Pranzo"></Tag>                                                    
                                            </TableCell>

                                            {
                                                this.state.ruoli.includes("ROLE_PM") ? (
                                                    <TableCell align="center">
                                                    <Tag className="p-mr-2" icon="pi pi-exclamation-triangle" severity="warning" value="Pausa Pranzo"></Tag>                                                    
                                                    </TableCell>
                                                ):(
                                                    <TableCell align="center"></TableCell>
                                                )
                                            }
                                        </TableRow>
                                    ):(
                                        (row.username) !== "" ? ( // Caso in cui ci sono prenotazioni
                                            <TableRow key = {(new Date(row.data)).getHours() - 2}>

                                            <TableCell component="th" scope="row" align="center">
                                                <Tag className="p-mr-2" style={{fontSize: "15px"}} severity="info" 
                                                rounded>
                                                    {(new Date(row.data)).getHours() - 2}:30 - {(new Date(row.data)).getHours() - 1}:30
                                                </Tag>
                                            </TableCell>    
        
                                            <TableCell align="center">
                                                {
                                                    row.username === this.state.username ? (
                                                        <Tag className="p-mr-2" icon="pi pi-info-circle" severity="info" value="Prenotato da te" ></Tag>
                                                    ):(
                                                        <Tag icon="pi pi-times" severity="danger" value="Occupato"></Tag>
                                                    )
                                                }
                                            </TableCell>
                                            <TableCell align = "center">
                                                {
                                                    row.username === this.state.username ? ( 
                                                        row.prezzo === 13 ? (
                                                            <Tag className="p-mr-2" value={"€" + row.prezzo + " | solo taglio" }></Tag>
                                                        ):(
                                                            row.prezzo === 15 ? (
                                                                <Tag className="p-mr-2" value={"€" + row.prezzo+ " | taglio + shampoo" }></Tag>
                                                            ): (
                                                                <Tag className="p-mr-2" value={"€" + row.prezzo+ " | taglio + barba + shampoo" }></Tag>
                                                            )
                                                        )
                                                        
                                                    ):(
                                                        <Tag icon="pi pi-times" severity="danger" value="Occupato"></Tag>
                                                    )
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    row.username === this.state.username ? (
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            className={classes.button}
                                                            startIcon={<DeleteIcon />}
                                                            style = {{padding: "10px"}}
                                                            onClick={(e) => this.deleteModal(e, (new Date(row.data)).getHours() - 2)}
                                                        >
                                                            Elimina
                                                        </Button>
                                                    ) : (
                                                        <div></div>
                                                    )
                                                } 
                                            </TableCell>
                                            {
                                                (this.state.ruoli.includes("ROLE_PM")&&(Number(hs) === idP)) ? (
                                                    <TableCell align="center">
                                                        <Button variant="contained" color="primary" onClick={(e) => this.openInfoModal(e, row.username)}>
                                                            <i className="pi pi-user"></i>
                                                        </Button>
                                                    </TableCell>
                                                ):(
                                                    <TableCell align="center"></TableCell>
                                                )
                                            }
                                            </TableRow>
                                        ):(
                                            <TableRow>
                                            <TableCell component="th" scope="row" align="center">
                                                <Tag className="p-mr-2" style={{fontSize: "15px"}} severity="info" 
                                                rounded>
                                                    {(new Date(row.data)).getHours() - 2}:30 - {(new Date(row.data)).getHours() - 1}:30
                                                </Tag>
                                            </TableCell>   
                                            <TableCell align="center">
                                                <Tag className="p-mr-2" icon="pi pi-check" severity="success" value="Libero" ></Tag>
                                            </TableCell>
                                            <TableCell  align = "center">
                                                <Tag className="p-mr-2" value="Inserisci per scegliere il tipo di taglio."></Tag>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    id = {(new Date(row.data)).getHours() - 2}
                                                    size="medium"
                                                    style = {{padding: "10px"}} 
                                                    onClick={(e) => this.insertModal(e, (new Date(row.data)).getHours() - 2)}
                                                    className={classes.button}
                                                    startIcon={<SaveIcon />}
                                                >
                                                    Inserisci
                                                </Button>
                                            </TableCell>
                                            {
                                                this.state.ruoli.includes("ROLE_PM") ? (
                                                    <TableCell align="center">
                                                        
                                                    </TableCell>
                                                ):(
                                                    <TableCell align="center"></TableCell>
                                                )
                                            }

                                            </TableRow>
                                        )
                                    )
                            ))                            
                        }
                        </TableBody>
                    </Table>
                    </TableContainer>
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

export default withStyles(useStyles)(CalendarPage);