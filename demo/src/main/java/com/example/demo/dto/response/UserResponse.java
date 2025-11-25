package com.example.demo.dto.response;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String userID;
    String email;
    String fullName;
    String gender;
    String phone;
    Date birthDate;
    String passwordHash;
    String roles;
    Date createdAt;
}
