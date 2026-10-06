package org.main.chorewars.repositories;

import org.main.chorewars.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
