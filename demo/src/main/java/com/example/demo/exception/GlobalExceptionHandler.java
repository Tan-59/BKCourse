package com.example.demo.exception;

import com.example.demo.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

//    @ExceptionHandler(value = Exception.class)
//    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception){
//        ApiResponse apiResponse = new ApiResponse();
//
//        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
//        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
//
//        return ResponseEntity.badRequest().body(apiResponse);
//    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<?>> handlingAppException(AppException appException){
        ErrorCode errorCode=appException.getErrorCode();
        ApiResponse<?> apiResponse=new ApiResponse<>();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = CustomValidationException.class)
    ResponseEntity<List<ApiResponse<?>>> handlingCustomValidationException(CustomValidationException exception){
        List<ApiResponse<?>> errorResponses = exception.getErrorList().stream()
                .map(errorCode -> {
                    ApiResponse<?> apiResponse = new ApiResponse<>();
                    apiResponse.setCode(errorCode.getCode());
                    apiResponse.setMessage(errorCode.getMessage());
                    return apiResponse;
                })
                .collect(Collectors.toList());
        return ResponseEntity.badRequest().body(errorResponses);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<?>> handlingValidation(MethodArgumentNotValidException exception){
        String enumKey = Objects.requireNonNull(exception.getFieldError()).getDefaultMessage();

        ErrorCode errorCode = ErrorCode.INVALID_KEY;

        try {
            errorCode = ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException ignored){

        }

        ApiResponse<?> apiResponse = new ApiResponse<>();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }

//    @ExceptionHandler(value = IllegalArgumentException.class)
//    ResponseEntity<List<ApiResponse<?>>> handlingErrorCoding(IllegalArgumentException illegalArgumentException){
//        ErrorCode fallbackErrorCode = ErrorCode.INVALID_KEY;
//
//        // 2. Tạo đối tượng ApiResponse
//        ApiResponse<?> apiResponse = new ApiResponse<>();
//        apiResponse.setCode(fallbackErrorCode.getCode());
//
//        // Lấy thông báo lỗi cụ thể cho INVALID_KEY
//        apiResponse.setMessage(fallbackErrorCode.getMessage());
//
//        // 3. Trả về List chứa lỗi đó (HTTP 400 Bad Request)
//        // Sử dụng Collections.singletonList() để tạo List chứa 1 phần tử
//        return ResponseEntity.badRequest().body(List.of(apiResponse));
//    }

}
