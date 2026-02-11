package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.UserRequestDTO;
import com.example.backend.dto.UserResponseDTO;

public interface UserService {

    UserResponseDTO saveUser(UserRequestDTO dto);

    List<UserResponseDTO> getUsers();

    UserResponseDTO updateUser(Long id, UserRequestDTO dto);

    UserResponseDTO deleteUser(Long id);
}

