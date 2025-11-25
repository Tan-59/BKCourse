package com.example.demo.repository;

import com.example.demo.entity.User;
import org.mapstruct.control.MappingControl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // Phương thức để lấy giá trị tiếp theo từ Sequence của SQL Server
    boolean existsByEmail(String email);
    boolean existsByFullName(String fullName);
    @Query(value = "SELECT NEXT VALUE FOR Seq_User", nativeQuery = true)
    Long getNextUserIdSequence();
}
