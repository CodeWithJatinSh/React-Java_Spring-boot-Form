package com.example.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    boolean existsByEmail(String email);
    boolean existsByName(String name);
    
    // ✨ ADD THESE
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name);
}