package com.example.backend.validations.validators;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.backend.repository.UserRepository;
import com.example.backend.validations.annotations.UniqueEmail;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

@Component
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {

    @Autowired
    private UserRepository userRepo;

    @Override
public boolean isValid(String email, ConstraintValidatorContext context) {

    if (userRepo.existsByEmail(email)) {

        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate("Email already exists")
               .addConstraintViolation();

        return false;
    }

    return true;
}

}
