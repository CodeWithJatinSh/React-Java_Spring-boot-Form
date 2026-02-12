package com.example.backend.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.dto.UserRequestDTO;
import com.example.backend.dto.UserResponseDTO;
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
public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {

    User existing = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found with id: " + id
            ));

    // Map all fields except password
    modelMapper.map(dto, existing);

    // ✨ Only update password if a new one is provided
    if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
        existing.setPassword(dto.getPassword());
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
