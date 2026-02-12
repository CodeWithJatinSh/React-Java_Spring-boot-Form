package com.example.backend.validations.validators;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.backend.repository.UserRepository;
import com.example.backend.validations.annotations.UniqueName;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

@Component 
public class UniqueNameValidator implements ConstraintValidator<UniqueName, String> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {

        if (value == null || value.isEmpty()) {
            return true; // Let @NotBlank handle it
        }

        return !userRepository.existsByName(value);
    }
}
