package com.example.demo.entity;

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
@Table(name = "Users")
@Entity
public class User {

    @Id
    @Column(name = "UserID", length = 20)
    String userID; // Lombok sẽ sinh getter/setter

    @Column(name = "Email", length = 100, nullable = false, unique = true)
    String email;

    @Column(name = "FullName", length = 100, nullable = false)
    String fullName;

    @Column(name = "Gender", length = 10)
    String gender;

    @Column(name = "Phone", length = 15)
    String phone;

    @Column(name = "BirthDate")
    @Temporal(TemporalType.DATE)
    Date birthDate;

    @Column(name = "PasswordHash", length = 255, nullable = false)
    String passwordHash;

    @Column(name = "Roles", length = 20, nullable = false)
    String roles;

    @Column(name = "CreatedAt", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    Date createdAt;

    /**
     * Phương thức được gọi trước khi đối tượng được lưu (persist) lần đầu tiên.
     * Vẫn giữ nguyên để xử lý giá trị mặc định cho CreatedAt và Roles.
     */
    @PrePersist
    protected void onCreate() {
        // Thiết lập CreatedAt mặc định (GETDATE() trong SQL)
        if (this.createdAt == null) {
            this.createdAt = new Date();
        }
        // Thiết lập Roles mặc định ('student')
        if (this.roles == null) {
            this.roles = "student";
        }
    }
}