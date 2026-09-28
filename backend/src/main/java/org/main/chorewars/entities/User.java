package org.main.chorewars.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
public class User {
    @Id
    private final UUID userId = UUID.randomUUID();

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Username cannot be blank")
    private final String username;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Please enter a valid email address")
    private final String email;

    @Column(nullable = false)
    private int totalPoints;

    public User(String username, String email) {
        this.username = username;
        this.email = email;
        this.totalPoints = 0;
    }

    public void addPoints(int points) {
        if (points < 0) {
            throw new IllegalArgumentException("Points to add cannot be negative");
        }
        this.totalPoints += points;
    }

}
