/*
    Classe che mi permette di gestire ed interfacciarmi con endpoint remoto.
    Gestisce la parte legata ai permessi di un utente.
*/

// --------------------------------------------------------
import axios from 'axios';
// --------------------------------------------------------

// Imposto un interceptor per le varie richieste effettuate al BE.
axios.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
        const token = 'Bearer ' + user.accessToken;
        config.headers.Authorization = token;
    }

    return config;
});

class BackendService {
    // Ottengo verifica interfaccia utente
    async getUserBoard() {
        return await axios.get("/api/test/user");
    }

    // Ottengo verifica interfaccia parrucchiere
    async getPmBoard() {
        return await axios.get("/api/test/pm");
    }
}

export default new BackendService();