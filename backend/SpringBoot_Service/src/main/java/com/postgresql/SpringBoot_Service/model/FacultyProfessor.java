package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;

@Entity
public class FacultyProfessor {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Integer predmetId;
    private String titula; // Dodatni atribut
    private String kabinet; // Dodatni atribut

    // Veza sa Korisnikom (1:1)
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Faculty_users korisnik;

    // Getters i Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getPredmetId() {
        return predmetId;
    }

    public void setPredmetId(Integer predmetId) {
        this.predmetId = predmetId;
    }

    public String getTitula() {
        return titula;
    }

    public void setTitula(String titula) {
        this.titula = titula;
    }

    public String getKabinet() {
        return kabinet;
    }

    public void setKabinet(String kabinet) {
        this.kabinet = kabinet;
    }

    public Faculty_users getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(Faculty_users korisnik) {
        this.korisnik = korisnik;
    }
}
