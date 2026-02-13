package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.example.backend.dto.UserRequestDTO;
import com.example.backend.dto.UserUpdateDTO;
import com.example.backend.dto.UserResponseDTO;
import com.example.backend.service.UserService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // CREATE - Uses UserRequestDTO (with @UniqueEmail and @UniqueName)
    @PostMapping
    public UserResponseDTO createUser(@Valid @RequestBody UserRequestDTO dto) {
        return userService.saveUser(dto);
    }

    // GET ALL
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getUsers();
    }

    // UPDATE - Now uses UserUpdateDTO (with @UniqueEmailUpdate and @UniqueNameUpdate)
    @PutMapping("/{id}")
    public UserResponseDTO updateUser(@PathVariable Long id,
                                      @Valid @RequestBody UserUpdateDTO dto) {
        dto.setId(id); // Set the ID from path variable to DTO for validation
        return userService.updateUser(id, dto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public UserResponseDTO deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }
}
