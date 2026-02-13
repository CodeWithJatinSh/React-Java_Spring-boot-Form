package com.example.backend.validations.validators;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.validations.annotations.UniqueEmailUpdate;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

@Component
public class UniqueEmailUpdateValidator implements ConstraintValidator<UniqueEmailUpdate, String> {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private jakarta.servlet.http.HttpServletRequest request;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null || email.isEmpty()) {
            return true;
        }

        // Get the user ID from the request path
        String path = request.getRequestURI();
        String[] parts = path.split("/");
        Long userId = null;
        
        try {
            userId = Long.parseLong(parts[parts.length - 1]);
        } catch (NumberFormatException e) {
            // If we can't parse ID, treat as new user creation
            return !userRepository.existsByEmail(email);
        }

        // Check if email exists for a different user
        User existingUser = userRepository.findByEmail(email).orElse(null);
        
        if (existingUser == null) {
            return true; // Email doesn't exist, validation passes
        }
        
        // Email exists - check if it belongs to the current user being updated
        return existingUser.getId().equals(userId);
    }
}