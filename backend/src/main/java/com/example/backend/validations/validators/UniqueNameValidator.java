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
    private UserRepository userRepo;

    @Override
public boolean isValid(String name, ConstraintValidatorContext context) {

    if (userRepo.existsByName(name)) {

        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate("Name already exists")
               .addConstraintViolation();

        return false;
    }

    return true;
}

}
