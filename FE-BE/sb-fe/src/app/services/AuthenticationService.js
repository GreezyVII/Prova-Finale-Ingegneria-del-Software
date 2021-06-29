/*
    Classe che mi permette di gestire ed interfacciarmi con endpoint remoto.
    Gestisce la parte legata all'autenticazione di un utente.
*/

// --------------------------------------------------------
import axios from "axios";
// --------------------------------------------------------

class AuthenticationService {
    // Metodo per effettuare il login dell'utente.
    signin = (username, password) => {
        return axios.post("/api/auth/signin", { username, password })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }

    // Metodo per effettuare il logout dell'utente.
    signOut() {
        localStorage.removeItem("user");
    }

    // Metodo per effettuare la registrazione dell'utente.
    register = async(firstname, lastname, username, phone, email, password, checked) => {
        let name = firstname + " " + lastname;

        return axios.post("/api/auth/signup", {
            name,
            username,
            email,
            phone,
            password,
            checked
        });
    }

    // Metodo per ottenere il token dell'utente loggato.
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthenticationService();