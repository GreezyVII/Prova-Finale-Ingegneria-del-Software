package org.polimi.andreaperotti.repository;
import org.polimi.andreaperotti.model.Prenotazione;
import org.polimi.andreaperotti.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

// JPA REPOSITORY dedicata alle query relative alle prenotazioni.
@Repository
public interface PrenRepository extends JpaRepository<Prenotazione, Long> {
    // Restituisce una prenotazione conoscendo parrucchiere e data della stessa.
    @Query("SELECT p FROM Prenotazione p WHERE p.dataPrenotazione= :dP AND p.parrucchiere =:parr")
    Prenotazione findPrenotazioneByDataPrenotazioneAndParrucchiere
            (@Param("dP") Date dataPrenotazione, @Param("parr") User parr);

    // Resituisce lista di prenotazioni conoscendo parrucchiere e data.
    @Query("SELECT p FROM Prenotazione p WHERE p.dataPrenotazione >= :d1 AND p.dataPrenotazione <= :d2 " +
            "AND p.parrucchiere = :parr")
    List<Prenotazione> findAllByDataAndParrucchiere(@Param("d1")Date d1, @Param("d2") Date d2, @Param("parr") User parr);

    // Restituisce la sommatoria giornaliera dei guadagni per tutti i giorni compresi tra la 2 date passate.
    @Query(value = "SELECT SUM(prenotazioni.prezzo) AS sommaPrezzo FROM prenotazioni WHERE " +
            "prenotazioni.data_prenotazione >= :d1 AND prenotazioni.data_prenotazione <= :d2 AND prenotazioni.parrucchiere_id =:parr" +
            " GROUP BY cast(prenotazioni.data_prenotazione AS DATE)", nativeQuery = true)
    List<Integer> getEarnings(@Param("parr") Long parr, @Param("d1")Date d1, @Param("d2") Date d2);

    // Restituisce tutte le date (castate a DATE e non DATETIME) relative ai guadagni getEarnings().
    @Query(value = "SELECT cast(prenotazioni.data_prenotazione AS DATE) AS dataPrenotazione FROM prenotazioni WHERE " +
            "prenotazioni.data_prenotazione >= :d1 AND prenotazioni.data_prenotazione <= :d2 AND prenotazioni.parrucchiere_id =:parr" +
            " GROUP BY cast(prenotazioni.data_prenotazione AS DATE)", nativeQuery = true)
    List<Date> getDateEarnings(@Param("parr") Long parr, @Param("d1")Date d1, @Param("d2") Date d2);

}
