package org.main.chorewars.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.main.chorewars.entities.enums.Role;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @Column(updatable = false)
    private String userId;

    @Setter
    @Column(unique = true, nullable = false)
    private String username;

    @Setter
    @Column(nullable = false)
    private String password;

    @Setter
    private String displayPicture;

    @Setter
    private String firstName;

    @Setter
    private String lastName;

    @Setter
    @Column(unique = true)
    private String email;

    @Setter
    @Column(nullable = false)
    private int totalPoints;

    @Setter
    @Column(nullable = false)
    private int golds;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Setter
    @OneToMany
    @JoinColumn(name = "task_id")
    private List<Task> assignedTasks;

    @Setter
    @ManyToOne
    @JoinColumn(name = "space_id")
    private Space space;

    @Setter
    @OneToMany
    @JoinColumn(name = "reward_id")
    private List<Reward> rewards;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public User(String username, Space space, Role role) {
        this.userId = "USER-" + UUID.randomUUID().toString().substring(0, 8);
        this.username = username;
        this.space = space;
        this.totalPoints = 0;
        this.golds = 0;
        this.role = role;
        this.createdAt = LocalDateTime.now();
    }
}

