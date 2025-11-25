package com.example.demo.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.List;
@Setter
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomValidationException extends RuntimeException {
    List<ErrorCode> errorList;
    // Constructor chấp nhận List<ErrorCode>
    public CustomValidationException(List<ErrorCode> errors) {
        // Gọi super với thông báo lỗi chung
        super("Multiple validation errors occurred.");
        this.errorList = errors;
    }

}
