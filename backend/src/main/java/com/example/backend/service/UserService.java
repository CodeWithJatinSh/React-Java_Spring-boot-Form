package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.UserRequestDTO;
import com.example.backend.dto.UserResponseDTO;
import com.example.backend.dto.UserUpdateDTO;

public interface UserService {

    UserResponseDTO saveUser(UserRequestDTO dto);

    List<UserResponseDTO> getUsers();

    UserResponseDTO updateUser(Long id, UserUpdateDTO dto);
    
    UserResponseDTO deleteUser(Long id);
}

