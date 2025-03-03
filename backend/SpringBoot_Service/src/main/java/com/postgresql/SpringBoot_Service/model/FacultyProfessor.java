package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
public class FacultyProfessor {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long predmetId;
    private String titula; // Dodatni atribut
    private String kabinet; // Dodatni atribut

    // Veza sa Korisnikom (1:1)
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Faculty_users korisnik;

    @ElementCollection
    @CollectionTable(name = "professor_subjects", 
                    joinColumns = @JoinColumn(name = "professor_id"))
    @Column(name = "subject")
    private List<String> subjects = new ArrayList<>();

    // Getters i Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPredmetId() {
        return predmetId;
    }

    public void setPredmetId(Long predmetId) {
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

    public List<String> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<String> subjects) {
        this.subjects = subjects;
    }
}
