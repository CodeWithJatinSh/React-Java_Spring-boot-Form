package com.example.backend.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.dto.UserRequestDTO;
import com.example.backend.dto.UserResponseDTO;
import com.example.backend.dto.UserUpdateDTO;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public UserResponseDTO saveUser(UserRequestDTO dto) {
        User user = modelMapper.map(dto, User.class);
        userRepository.save(user);
        return modelMapper.map(user, UserResponseDTO.class);
    }

    @Override
    public List<UserResponseDTO> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .toList();
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserUpdateDTO dto) { 
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found with id: " + id
                ));

        // ✨ Store the old password BEFORE mapping
        String oldPassword = existing.getPassword();

        // Map all fields from dto to existing user
        modelMapper.map(dto, existing);

        // ✨ If no new password provided, restore the old password
        if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
            existing.setPassword(oldPassword);
        }

        userRepository.save(existing);

        return modelMapper.map(existing, UserResponseDTO.class);
    }

    @Override
    public UserResponseDTO deleteUser(Long id) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found with id: " + id
                ));

        userRepository.delete(existing);

        return modelMapper.map(existing, UserResponseDTO.class);
    }
}