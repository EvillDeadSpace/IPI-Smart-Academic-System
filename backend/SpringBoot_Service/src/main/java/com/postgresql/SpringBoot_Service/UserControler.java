package com.postgresql.SpringBoot_Service;

import com.postgresql.SpringBoot_Service.model.Faculty_users;
import com.postgresql.SpringBoot_Service.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class UserControler {


    @Autowired
    UserRepo repo;
    @Autowired
    private UserRepo userRepo;


    // add user
    @PostMapping("/add_user")
    public void addUser(@RequestBody Faculty_users faculty_users) {
        if (faculty_users != null) {
            if (userRepo.existsByEmail(faculty_users.getEmail())) {
                throw new IllegalArgumentException("Email je već u upotrebi!");
            }
            if (faculty_users.getIme() == null || faculty_users.getIme().isEmpty()) {
                throw new IllegalArgumentException("Ime je obavezno!");
            }
            if (faculty_users.getPrezime() == null || faculty_users.getPrezime().isEmpty()) {
                throw new IllegalArgumentException("Prezime je obavezno!");
            }
            if (faculty_users.getEmail() == null || faculty_users.getEmail().isEmpty()) {
                throw new IllegalArgumentException("Email je obavezan!");
            }
        } else {
            throw new IllegalArgumentException("Faculty_users objekat je null!");
        }


        System.out.println(faculty_users + " is added to the database");
        repo.save(faculty_users);
    }


}
