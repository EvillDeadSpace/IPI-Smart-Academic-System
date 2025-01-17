package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@Getter
@Setter
public class Faculty_users {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Generiše automatski jedinstveni ID
    private int id;

    private String ime;
    private String prezime;
    private String email;
    private String tipUsera; // Ako koristite ENUM, možete ga zameniti sa enum tipom

    // Getter za 'id'
    public int getId() {
        return id;
    }

    // Setter za 'id'
    public void setId(int id) {
        this.id = id;
    }

    // Getter za 'ime'
    public String getIme() {
        return ime;
    }

    // Setter za 'ime'
    public void setIme(String ime) {
        this.ime = ime;
    }

    // Getter za 'prezime'
    public String getPrezime() {
        return prezime;
    }

    // Setter za 'prezime'
    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    // Getter za 'email'
    public String getEmail() {
        return email;
    }

    // Setter za 'email'
    public void setEmail(String email) {
        this.email = email;
    }

    // Getter za 'tipUsera'
    public String getTipUsera() {
        return tipUsera;
    }

    // Setter za 'tipUsera'
    public void setTipUsera(String tipUsera) {
        this.tipUsera = tipUsera;
    }

}
