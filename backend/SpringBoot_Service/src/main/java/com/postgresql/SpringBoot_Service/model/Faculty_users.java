package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;

@Entity
@Table(name = "faculty_users")
public class Faculty_users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ime;
    private String prezime;
    private String email;
    private String password;
    private String tipUsera;

    // Constructor
    public Faculty_users() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTipUsera() {
        return tipUsera;
    }

    public void setTipUsera(String tipUsera) {
        this.tipUsera = tipUsera;
    }
}
