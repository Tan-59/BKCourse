package com.example.demo.service;

import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.entity.User;
import com.example.demo.exception.AppException;
import com.example.demo.exception.CustomValidationException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.UserMapper;
import com.example.demo.repository.UserRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
//    Validator validator;
    @Transactional
    public UserResponse createUser(UserCreationRequest request) {
        List<ErrorCode> errors = new ArrayList<>();
//        Set<ConstraintViolation<UserCreationRequest>> violations = validator.validate(request);
//        if (!violations.isEmpty()) {
//            for (ConstraintViolation<UserCreationRequest> violation : violations) {
//                String enumKey = violation.getMessage();
//                try {
//                    ErrorCode validationError = ErrorCode.valueOf(enumKey);
//                    errors.add(validationError);
//                } catch (IllegalArgumentException e) {
//                    errors.add(ErrorCode.INVALID_KEY);
//                }
//            }
//        }
        if(userRepository.existsByFullName(request.getFullName())) {
            errors.add(ErrorCode.FULL_NAME_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            errors.add(ErrorCode.EMAIL_EXISTED);
        }
        if (!errors.isEmpty()) {
          //  throw new CustomValidationException(errors);
            throw new CustomValidationException(errors);
        }
        Long nextValue = userRepository.getNextUserIdSequence();
        String formattedId = String.format("USR%04d", nextValue);
        User user = userMapper.toUser(request);
        user.setUserID(formattedId);
     return userMapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    public List<UserResponse> getAllUsers() {
        return  userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    @Transactional
    public UserResponse getUser(String userId){
        return userMapper.toUserResponse(userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    @Transactional
    public UserResponse updateUser(String userId, UserUpdateRequest userUpdateRequest){
        User user=userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userMapper.updateUser(user,userUpdateRequest);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(String userId){
        userRepository.deleteById(userId);
    }

}