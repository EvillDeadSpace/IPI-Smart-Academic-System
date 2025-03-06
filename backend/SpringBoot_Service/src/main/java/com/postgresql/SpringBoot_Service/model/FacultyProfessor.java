package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "faculty_professors")
public class FacultyProfessor {


    @Id
    private Long id;  // Remove @GeneratedValue since we're using @MapsId

    private Long predmetId;
    private String titula; // Dodatni atribut
    private String kabinet; // Dodatni atribut

    // Veza sa Korisnikom (1:1)
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Faculty_users korisnik;

    @Column(name = "setup_completed")
    private boolean setupCompleted = false;

    @ElementCollection
    @CollectionTable(
        name = "professor_subjects",
        joinColumns = @JoinColumn(name = "professor_id")
    )
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
        return subjects != null ? subjects : new ArrayList<>();
    }

    public void setSubjects(List<String> subjects) {
        this.subjects = subjects != null ? subjects : new ArrayList<>();
    }

    public boolean isSetupCompleted() {
        return setupCompleted;
    }

    public void setSetupCompleted(boolean setupCompleted) {
        this.setupCompleted = setupCompleted;
    }
}
