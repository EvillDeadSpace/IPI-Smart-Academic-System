package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;

@Entity
@Table(name = "faculty_student")
public class FacultyStudent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "faculty_user_id")
    private Faculty_users facultyUser;

    @Column(name = "smjer_studija")
    private String smjerStudija;

    @Column(name = "indeks")
    private String indeks;

    @Column(name = "godina_studija")
    private String godinaStudija;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Faculty_users getFacultyUser() {
        return facultyUser;
    }

    public void setFacultyUser(Faculty_users facultyUser) {
        this.facultyUser = facultyUser;
    }

    public String getSmjerStudija() {
        return smjerStudija;
    }

    public void setSmjerStudija(String smjerStudija) {
        this.smjerStudija = smjerStudija;
    }

    public String getIndeks() {
        return indeks;
    }

    public void setIndeks(String indeks) {
        this.indeks = indeks;
    }

    public String getGodinaStudija() {
        return godinaStudija;
    }

    public void setGodinaStudija(String godinaStudija) {
        this.godinaStudija = godinaStudija;
    }
}
