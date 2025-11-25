package com.example.demo.exception;

import lombok.*;
import lombok.experimental.FieldDefaults;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error"),
    INVALID_KEY(1001, "Uncategorized error"),
    FULL_NAME_EXISTED(1002, "User existed"),
    USER_NOT_FOUND(1003, "User not found"),
    EMAIL_EXISTED(1004, "Email existed"),
    INVALID_PASSWORD (1005, "Password must be at least 8 characters"),
    INVALID_FULL_NAME(1006, "Full name must be at least 8 characters"),
    EMAIL_REQUIRED(1007, "Email can't be blank"),
    FULL_NAME_REQUIRED(1008, "Full name can't be blank"),
    PASSWORD_REQUIRED(1009, "Password can't be blank");
    int code;
    String message;
}
