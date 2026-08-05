package com.drbio.domain.user.repository;

import com.drbio.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * E-posta adresine göre kullanıcıyı bulur.
     *
     * @param email aranacak e-posta adresi
     * @return kullanıcı bulunursa Optional içinde, bulunamazsa boş Optional döner
     */
    Optional<User> findByEmail(String email);

    /**
     * Verilen e-posta adresine sahip bir kullanıcının sistemde kayıtlı olup olmadığını kontrol eder.
     *
     * @param email kontrol edilecek e-posta adresi
     * @return e-posta adresi sistemde varsa true, yoksa false döner
     */
    boolean existsByEmail(String email);
}
