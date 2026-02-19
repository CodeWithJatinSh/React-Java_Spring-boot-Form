package com.example.backend.validations.validators;

import java.time.LocalDate;
import java.time.Period;

import com.example.backend.validations.annotations.AgeCheck;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;


public class AgeCheckValidator implements ConstraintValidator<AgeCheck, LocalDate> {

    @Override
    public void initialize(AgeCheck constraintAnnotation) {}

    @Override
    public boolean isValid(LocalDate dateOfBirth, ConstraintValidatorContext context) {
        if (dateOfBirth == null) return true; // Let @NotNull handle null
        return Period.between(dateOfBirth, LocalDate.now()).getYears() >= 18;
    }
}
