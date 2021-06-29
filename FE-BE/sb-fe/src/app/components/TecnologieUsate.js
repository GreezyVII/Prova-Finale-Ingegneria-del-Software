/*
    Component con card per descrivere tecnologie utilizzate.
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

import fb from "../../../src/springboot.png"
import ig from "../../../src/react_js.png"
import Image from 'react-bootstrap/Image'

import {Container, Row, Col} from 'reactstrap';
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
            <Card className={classes.root} variant="outlined" style={{borderRadius: "20px"}}>
            <CardContent style = {{paddingTop: "30px", paddingBottom: "30px", textAlign: "center"}}>
                <Typography className={classes.title} gutterBottom>
                    <strong><h4>Tecnologie Utilizzate</h4></strong>
                </Typography>
                <Container style={{paddingBottom: "15px"}}>
                    <Row>
                        <Col>
                            <Image src={fb} fluid></Image>
                        </Col>

                        <Col style={{paddingTop: "20px"}}>
                            <Image src={ig} fluid></Image>
                        </Col>
                    </Row>
                </Container>
            </CardContent>
            </Card>
        );
    }
}

export default withRouter(withStyles(useStyles)(CardBox));