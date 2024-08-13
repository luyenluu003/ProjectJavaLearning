package com.yui.projectSpringBoot.reponsitory;


import com.yui.projectSpringBoot.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepo extends JpaRepository<OurUsers,Integer> {
    Optional<OurUsers> findByEmail(String email);
}
