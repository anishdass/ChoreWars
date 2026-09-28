package org.main.chorewars.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.main.chorewars.entities.enums.ChoreFrequency;
import org.main.chorewars.entities.enums.ChoreStatus;

import java.util.UUID;

@Entity
@Table(name = "chores")
@Getter
public class Chore {
    @Id
    private final UUID id = UUID.randomUUID();

    @Setter
    @Column(nullable = false)
    private String title;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChoreStatus status = ChoreStatus.PENDING;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChoreFrequency frequency = ChoreFrequency.DAILY;

    @Setter
    private String place;

    @Setter
    @Column
    private User user;

    public Chore(String title) {
        this.title = title;
    }
}
