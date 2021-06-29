/*
  Component che gestisce una card con le specifiche di ciò 
  che il programma svolge
*/

// --------------------------------------------------------
import React, {Component} from 'react';
import { withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import "primeicons/primeicons.css"
import 'primeflex/primeflex.css';
import { withRouter } from 'react-router-dom';
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

    // Metodo per cambiare ed impostare valori selezionati.
    changeHandler = (event) =>{  
        let nam = event.target.name; // Prendo nome del nodo.
        let val = event.target.value; // Prendo valore inserito.
        this.setState({[nam]: val}); // Imposto tramite chiave | valore
    }

    render (){
        // Salvo in una costante le classi definite nello UseStyles()
        const classes = this.props;     
        return (
            // Card con informazioni all'interno.
            <Card className={classes.root} variant="outlined" style={{borderRadius: "20px"}}>
            <CardContent style = {{paddingTop: "30px", paddingBottom: "30px", textAlign: "center"}}>
                <Typography className={classes.title} gutterBottom>
                <strong><h4>About Us</h4></strong>
                </Typography>
                <Typography className={classes.pos} >
                Un applicazione che ti permette di prenotare in modo semplice
                e veloce un taglio dal tuo parrucchiere di fiducia. 
                Allo stesso tempo permette a te parrucchiere di gestire in 
                modo facile e senza perdite di tempo tutta la tua clientela. 
                Fornisce inoltre statistiche utili al parrucchiere in modo da
                monitorare l'andamento degli appuntamenti di settimana in settimana.
                </Typography>
            </CardContent>
            </Card>
        );
    }
}

export default withRouter(withStyles(useStyles)(CardBox));