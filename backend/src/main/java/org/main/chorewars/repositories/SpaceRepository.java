package org.main.chorewars.repositories;

import org.main.chorewars.entities.Space;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceRepository extends JpaRepository<Space, String> {
}
