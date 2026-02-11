package com.example.backend.dto;


import com.example.backend.validations.annotations.UniqueEmail;
import com.example.backend.validations.annotations.UniqueName;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class UserRequestDTO {

    @NotBlank(message = "Name is required")
    @UniqueName
    private String name;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    @UniqueEmail
    private String email;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Password is required")
    @Size(min = 4, message = "Password must be 4 characters long")
    private String password;

    // Getters & Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;   
    }

    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}
