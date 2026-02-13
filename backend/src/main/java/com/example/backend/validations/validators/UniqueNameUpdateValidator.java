package com.example.backend.validations.validators;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.validations.annotations.UniqueNameUpdate;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

@Component
public class UniqueNameUpdateValidator implements ConstraintValidator<UniqueNameUpdate, String> {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private jakarta.servlet.http.HttpServletRequest request;

    @Override
    public boolean isValid(String name, ConstraintValidatorContext context) {
        if (name == null || name.isEmpty()) {
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
            return !userRepository.existsByName(name);
        }

        // Check if name exists for a different user
        User existingUser = userRepository.findByName(name).orElse(null);
        
        if (existingUser == null) {
            return true; // Name doesn't exist, validation passes
        }
        
        // Name exists - check if it belongs to the current user being updated
        return existingUser.getId().equals(userId);
    }
}