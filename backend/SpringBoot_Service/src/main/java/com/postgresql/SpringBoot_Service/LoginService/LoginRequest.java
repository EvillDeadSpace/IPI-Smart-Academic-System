package com.postgresql.SpringBoot_Service.LoginService;


import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;



    //GETTER AND SETTER FOR LOGIN REQUEST
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
