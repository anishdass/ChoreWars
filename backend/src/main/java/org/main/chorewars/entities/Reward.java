package org.main.chorewars.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "rewards")
public class Reward {
    @Id
    @Column(updatable = false)
    private String rewardId;

    @Setter
    @Column(nullable = false)
    private String name;

    @Setter
    @Column(nullable = false)
    private int goldsRequired;

    @Setter
    @ManyToMany(mappedBy = "reward_id")
    private User user;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Setter
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Reward(String name, int goldsRequired) {
        this.rewardId = "REWARD-" + UUID.randomUUID().toString().substring(0, 8);
        this.name = name;
        this.goldsRequired = goldsRequired;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
