/*
    Component con Chart per mostrare i guadagni stimati ed effettivi per un parrucchiere.
*/

// --------------------------------------------------------
import React, { Component } from 'react';
import { Chart } from 'primereact/chart';
import { Container, Row, Col} from 'reactstrap';
import { Calendar } from 'primereact/calendar';
import Typography from '@material-ui/core/Typography';
import { withStyles} from '@material-ui/core/styles';

import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Swal from 'sweetalert2'

import UtilityService from "../services/UtilityService"
import AuthenticationService from "../services/AuthenticationService"
import jwt from "jwt-decode"
// --------------------------------------------------------

// Hook per stili Primereact | Material UI.
const useStyles = theme => ({
    root: {
      minWidth: 275,
      
    },
    title: {
      fontSize: 14,
    },
  });

export class Grafico extends Component {
    // Costruttore.
    constructor(props) {
        super(props);

        // Definisco state
        this.state = {
            dataInizio: new Date(), // Data di inizio - default data odierna.
            dataFine: new Date(), // Data di fine - default data odierna.
            username: "", // Username utente loggato
            // Dati Chart
            basicData : {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'Guadagno Stimato',
                        data: [],
                        fill: false,
                        borderColor: '#42A5F5',
                        tension: .4
                    },
                    {
                        label: 'Guadagno Effettivo',
                        data: [],
                        fill: false,
                        borderColor: '#FFA726',
                        tension: .4
                    }
                ]
            },
            sommaStimati : 0, // Sommatoria di tutti i guadagni stimati del periodo selezionato
            sommaEffettivi : 0, // Sommatoria di tutti i guadagni effettivi del periodo selezionato

        }
        // Stile tabella.
        this.options = this.getLightTheme();
    }

    // Stile tabella.
    getLightTheme() {
        let basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: .6,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        return {
            basicOptions,
        }
    }

    // Metodo per cambiare ed impostare valori selezionati.
    changeHandler = (event) =>{  
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    // Metodo per aggiornare il grafico in base alle date selezionate.
    updateChart = async (e) => {
        e.preventDefault(); // Evito che la richiesta venga fatta più di una volta.
        const d1 = this.state.dataInizio // Salvo in una costante la data di inizio selezionata.
        const d2 = this.state.dataFine // Salvo in una costante la data di fine selezionata.
        this.state.sommaStimati = 0 // Inizializzo i guadagni stimati a 0
        this.state.sommaEffettivi = 0 // Inizializzo i guadagni effettivi a 0

        // Verifico che la data di inizio sia antecedente a quella di fine.
        if (d1 <= d2){
            let arrGiorni = [] // Memorizza i giorni compresi tra le 2 date
            let i = new Date(d1) // Data di appoggio uguale a quella di partenza, mi serve per scorrere date
            let k = 0 // Indice per scorrere vettore giorni.

            // Ciclo per scorrere tutti i giorni tra d1 e d2
            while(i < d2) {  
                // Salvo la data nel vettore apposito 
                arrGiorni[k] = i.getDate() + " " +(new Date(i)).toLocaleString('default', { month: 'long' }) +  " " +i.getFullYear()
                let app = i;
                
                // Incremento giorno.
                app.setDate(i.getDate()+1);
                i = app;

                // Incremento indice scorrimento per vettore giorni.
                k++                
            }

            // Invoco endpoint remoto per ottenere statistiche relative.
            UtilityService.getAnalyticsForHS(this.state.username, d1, d2).then(
                response => {
                    let guadagniStimati = [] // Memorizza vettore con guadagni stimati giornalieri
                    let guadagniEffettivi = [] // Memorizza vettore con guadagni effettivi giornalieri

                    // Calcolo giorni di differenza tra le 2 date inserite.
                    let differenceInTime = (new Date()).getTime() - d1.getTime();
                    let differenceInDays = differenceInTime / (1000 * 3600 * 24); 

                    // Se la data di fine è antecedente a quella attuale,
                    // i guadagni saranno tutti effettivi.
                    if (d2 < new Date()){
                        guadagniEffettivi = response;

                    // Se la data di inizio è successiva a quella attuale,
                    // i guadagni saranno tutti stimati.
                    } else if (d1 > new Date()){
                        guadagniStimati = response;
                    } else {

                        // Se la date sono "a cavallo" della data odierna, 
                        // effettuo un mix tra stimati | effettivi.
                        let i = 0 // Variabile di controllo per scorrere giorni.

                        // Ciclo per memorizzare guadagni effettivi e stimati fino alla data odierna [corrispondono]
                        while (i < differenceInDays){
                            guadagniEffettivi[i] = response[i]
                            this.state.sommaEffettivi = this.state.sommaEffettivi + response[i]
                            guadagniStimati[i] = response[i]
                            this.state.sommaStimati = this.state.sommaStimati + response[i]
                            i++
                        }
                        let j = i

                        // Ciclo per memorizzare i guadagni stimati successivi alla data odierna.
                        while (j < response.length){
                            guadagniStimati[j] = response[j]
                            this.state.sommaStimati = this.state.sommaStimati + response[j]
                            j++
                        }
                    }

                    // Salvo dati da inserire nel Chart.
                    let bD = {
                        labels: arrGiorni,
                        datasets: [
                            {
                                label: 'Guadagno Stimato',
                                data: guadagniStimati,
                                fill: false,
                                borderColor: '#42A5F5',
                                tension: .4
                            },
                            {
                                label: 'Guadagno Effettivo',
                                data: guadagniEffettivi,
                                fill: false,
                                borderColor: '#FFA726',
                                tension: .4
                            }
                        ]
                    }
                    // Imposto state.
                    this.setState({basicData: bD})
                }, error =>{
                    console.log(error)
                }
            );

            
        }else{
            Swal.fire('Inserisci una data ed un orario validi. La data di inizio DEVE essere antecedente a quella di fine.')
        }
    }

    // Metodo per cambiare ed impostare valori selezionati.
    componentDidMount() {
        // Ottengo utente da token JWT.
        const user = AuthenticationService.getCurrentUser();
        if (user){
            const nome = (jwt(user.accessToken)).sub
            this.setState({username: nome})
        } 
    }

    render() {
        const { basicOptions } = this.options;
        const classes = this.props
        return (
            <Container fluid style = {{paddingTop: "40px"}}> 
                <Row>
                  <Col>
                    <Card className={classes.root} variant="outlined" style={{borderRadius: "20px",
                          background: "rgb(27,23,93)",
                          // eslint-disable-next-line
                          background: "linear-gradient(338deg, rgba(27,23,93,1) 4%, rgba(121,9,9,1) 50%, rgba(0,212,255,1) 100%)",
                          border:"none"}}>
                          <CardContent style = {{padding: "20px", textAlign: "center", color: "white"}}>
                            <Typography className={classes.title} gutterBottom>
                                <strong>Seleziona una data di inizio e fine periodo per 
                                  visualizzare l'andamento dei tuoi guadagni stimati ed effettivi.</strong>
                            </Typography>
                            <Row style = {{justifyContent: "center"}}>
                              <Col xs = "12" xl = "3">
                              <Typography className={classes.title} style = {{paddingTop : "20px"}} gutterBottom>
                                <strong>Data Inizio</strong>
                              </Typography>
                              {
                                  this.state.dataInizio !== new Date() ? (
                                      <Calendar id="icon" value = {this.state.dataInizio} dateFormat="dd/mm/yy" 
                                      onChange={this.changeHandler} name = "dataInizio" 
                                      showIcon />
                                  ):(
                                      <Calendar id="icon" value = {new Date()} dateFormat="dd/mm/yy" 
                                      onChange={this.changeHandler} name = "dataInizio"  showIcon />
                                  )
                              }   
                              </Col>
                              <Col xs = "12" xl = "3">
                              <Typography className={classes.title} style = {{paddingTop : "20px"}} gutterBottom>
                                <strong>Data Fine</strong>
                              </Typography>
                              {
                                  this.state.dataFine !== new Date() ? (
                                      <Calendar id="icon" value = {this.state.dataFine} dateFormat="dd/mm/yy" 
                                      onChange={this.changeHandler} name = "dataFine"  showIcon />
                                  ):(
                                      <Calendar id="icon" value = {new Date()} dateFormat="dd/mm/yy" 
                                      onChange={this.changeHandler} name = "dataFine"  showIcon />
                                  )
                              }   
                              </Col>
                            </Row>
                            
                          </CardContent>
                        <CardActions style = {{justifyContent: "center", paddingBottom: "20px"}}>  
                            <Button variant="contained" color="secondary" onClick = {this.updateChart}>Aggiorna</Button>
                        </CardActions>
                    </Card>
                  </Col>
                </Row>

                <Row style = {{justifyContent: "center", paddingTop: "40px", paddingBottom: "30px"}}>
                  <Col xl= "9">
                        <div className="card">
                            <Chart type="line" data={this.state.basicData} options={basicOptions} />
                        </div>
                  </Col>
                  <Col xl="3">
                      <Row>
                        <Col xl="12" style ={{ paddingTop: "40px"}}>
                            <Card className={classes.root} variant="outlined" style={{borderRadius: "20px"}}>
                                <CardContent style = {{padding: "20px", textAlign: "center"}}>
                                    <Typography className={classes.title} color="textPrimary" gutterBottom>
                                    <strong>Guadagni Stimati</strong>
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary">
                                    Il totale dei guadagni stimati nel periodo selezionato [
                                        {this.state.dataInizio.getDate()} {this.state.dataInizio.toLocaleString('default', { month: 'long' })} {this.state.dataInizio.getFullYear()} - {this.state.dataFine.getDate()} {this.state.dataFine.toLocaleString('default', { month: 'long' })} {this.state.dataFine.getFullYear()}]
                                        ammonta a: <br></br>
                                        <strong>€{this.state.sommaStimati}</strong>
                                    </Typography>
                                </CardContent>
                            </Card>
                          </Col>
                          <Col xl="12" style ={{ paddingTop: "40px"}}>
                            <Card className={classes.root} variant="outlined" style={{borderRadius: "20px"}}>
                                <CardContent style = {{padding: "20px", textAlign: "center"}}>
                                    <Typography className={classes.title} color="textPrimary" gutterBottom>
                                    <strong>Guadagni Effettivi</strong>
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary">
                                    Il totale dei guadagni effettivi nel periodo selezionato [
                                        {this.state.dataInizio.getDate()} {this.state.dataInizio.toLocaleString('default', { month: 'long' })} {this.state.dataInizio.getFullYear()} - {this.state.dataFine.getDate()} {this.state.dataFine.toLocaleString('default', { month: 'long' })} {this.state.dataFine.getFullYear()}]
                                        ammonta a: <br></br>
                                        <strong>€{this.state.sommaEffettivi}</strong>
                                    </Typography>
                                </CardContent>
                            </Card>
                          </Col>
                      </Row>
                    
                  </Col>
                </Row>       
              </Container>
        )
    }
}

export default  withStyles(useStyles)(Grafico);