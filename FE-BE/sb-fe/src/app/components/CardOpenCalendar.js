/*
    Component con un card per reindirizzare a Calendar.js
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
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    render (){
        const classes = this.props;     

        return (
            <Card className={classes.root} variant="outlined" style={{borderRadius: "20px",
            background: "rgb(27,23,93)",
            // eslint-disable-next-line
            background: "linear-gradient(338deg, rgba(27,23,93,1) 4%, rgba(121,9,9,1) 50%, rgba(0,212,255,1) 100%)",
            color: "white", border:"none"}}>
            <CardContent style = {{padding: "40px", textAlign: "center"}}>
                <Typography className={classes.title} gutterBottom>
                <strong>Consulta Date Disponibili</strong>
                </Typography>
                <Typography className={classes.pos} >
                Inserisci la data da consultare, potrai inserire <br/>
                ed eliminare una prenotazione.
                </Typography>
            </CardContent>
            <CardActions style = {{justifyContent: "center", paddingBottom: "20px"}}>  
            <Link to = "/calendar" style = {{textDecoration:"none"}}>
                <Button variant="contained" color="secondary" size="medium">Consulta</Button>
            </Link>
            </CardActions>
            </Card>
        );
    }
}

export default withRouter(withStyles(useStyles)(CardBox));