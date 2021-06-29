/*
    Classe che mi permette di gestire ed interfacciarmi con endpoint remoto.
    Gestisce tutte le funzionalità dell'applicativo.
*/

// --------------------------------------------------------
import axios from "axios";
// --------------------------------------------------------

class UtilityService {
    // Metodo per verificare se è possibile prenotare ad una certa data e ora per un dato parrucchiere.
    isDisponibile = (data, ora, hairstyler) => {
        return axios.post("api/pren/search", { data, ora, hairstyler }).then(
            response => {
                return response.data;
            },
            error => {
                console.log(error)
                throw error
            }
        )
    }

    // Metodo per cercare la prima prenotazione disponibile ad una certa data e ora per un dato parrucchiere.
    firstAvailable = (hairstyler) => {
        return axios.post("api/pren/next", { hairstyler }).then(
            response => {
                return response.data;
            },
            error => {
                console.log(error)
                throw error
            }
        )
    }

    // Metodo per ottenere la lista di prenotazioni conosciuto giorno e parrucchiere.
    getPrenotationsByDayAndHairstyler = async(data, hairstyler) => {
        const dataAfter = data;
        const dataBefore = data;
        return axios.post("api/pren/get", { dataAfter, dataBefore, hairstyler }).then(
            response => {
                return response.data
            },
            error => {
                console.log(error)
                throw error
            }
        )
    }

    // Metodo per salvare un prenotazione nel DB.
    savePren = (data, username, ora, prezzo, hairstyler) => {
        return axios.post("api/pren/save", { data, username, ora, prezzo, hairstyler }).then(
            response => {
                return response.data
            },
            error => {
                console.log(error)
                throw error
            }
        )
    }

    // Metodo per eliminare un prenotazione dal DB.
    deletePren = (data, username, ora, hairstyler) => {
        return axios.post("api/pren/delete", { data, username, ora, hairstyler }).then(
            response => {
                return response.data
            },
            error => {
                console.log(error)
                throw error
            }
        )
    }

    // Metodo per ottenere tutte le prenotazioni di un utente conosciuto lo username.
    getAllByUsername(username) {
        return axios.post("api/user/get", { username }).then(
            response => {
                return response.data
            },
            error => {
                console.log(error)
                throw error
            }
        )
    }

    // Metodo per ottenere tutte le informazioni di un utente conosciuto lo username.
    getInfoByUsername(username) {
        return axios.post("api/user/get_info", { username }).then(
            response => {
                return response.data;
            }, error => {
                return error;
            }
        )
    }

    // Metodo per aggiornare le informazioni di un utente conosciuto lo username.
    updateInfo(username, nome, cognome, telefono, email) {
        const fullName = nome + " " + cognome;
        return axios.post("api/user/update_info", { username, fullName, telefono, email }).then(
            response => {
                return response.data;
            }, error => {
                return error;
            }
        )
    }

    // Metodo per ottenere la lista di parrucchieri presenti nel DB.
    getStylists() {
        return axios.post("api/user/getStylists").then(
            response => {
                return response.data;
            }, error => {
                return error
            }
        )
    }

    // Metodo per ottenere tutte le statistiche relative ai guadagni presenti nel DB,
    // fornita una data di inizio, una di fine ed un parrucchiere.
    getAnalyticsForHS(hairstyler, dataInizio, dataFine) {
        return axios.post("api/user/analytics", { hairstyler, dataInizio, dataFine }).then(
            response => {
                return response.data
            },
            errore => {
                return errore;
            }
        )
    }

    // Metodo che ritorna l'ID di un utente conosciuto lo username.
    getIdByUsername(username) {
        return axios.post("api/user/getId", { username }).then(
            response => {
                return response.data
            }, error => {
                return error
            }
        )
    }
}

export default new UtilityService();