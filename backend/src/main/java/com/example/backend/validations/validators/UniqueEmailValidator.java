package com.example.backend.validations.validators;

import org.springframework.stereotype.Component;

import com.example.backend.repository.UserRepository;
import com.example.backend.validations.annotations.UniqueEmail;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

@Component
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {

    private final UserRepository userRepository;

    public UniqueEmailValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return true;
        }
        return !userRepository.existsByEmail(value);
    }
}

