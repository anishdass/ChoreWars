package org.main.chorewars.repositories;

import org.main.chorewars.entities.Reward;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RewardRepository extends JpaRepository<Reward, String> {
}
