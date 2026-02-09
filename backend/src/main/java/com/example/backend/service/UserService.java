package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @SuppressWarnings("null")
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User newData) {
        @SuppressWarnings("null")
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existing.setName(newData.getName());
        existing.setEmail(newData.getEmail());
        existing.setGender(newData.getGender());
        existing.setCity(newData.getCity());
        existing.setPassword(newData.getPassword());
        existing.setDob(newData.getDob());

        return userRepository.save(existing); 
    }
    
    @SuppressWarnings("null")
    public User deleteUser(Long id) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(existing);
        return existing;
    }
}
