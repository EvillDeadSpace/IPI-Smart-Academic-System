package com.postgresql.SpringBoot_Service.dto;

import java.util.List;

public class EnrollmentRequest {
    private String email;
    private String major;
    private int year;
    private List<Long> subjects;

    // Getters and setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }
    
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    
    public List<Long> getSubjects() { return subjects; }
    public void setSubjects(List<Long> subjects) { this.subjects = subjects; }
}