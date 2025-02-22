package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@Getter
@Setter
public class FacultyStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String godinaStudija;
    private String smjerStudija;
    private String indeks;

    @OneToOne
    @JoinColumn(name = "faculty_user_id", referencedColumnName = "id")
    private Faculty_users facultyUser;

    // Getter i Setter metode

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getGodinaStudija() {
        return godinaStudija;
    }

    public void setGodinaStudija(String godinaStudija) {
        this.godinaStudija = godinaStudija;
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

    public Faculty_users getFacultyUser() {
        return facultyUser;
    }

    public void setFacultyUser(Faculty_users facultyUser) {
        this.facultyUser = facultyUser;
    }
}
