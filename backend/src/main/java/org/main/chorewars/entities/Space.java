package org.main.chorewars.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "spaces")
@Getter
@NoArgsConstructor
public class Space {
    @Id
    private String spaceId;

    @Setter
    private String name;

    @Setter
    @OneToMany(mappedBy = "space")
    private List<User> users;

    @Setter
    @OneToMany(mappedBy = "space")
    private List<Task> tasks;

    public Space(List<User> users, String name) {
        this.spaceId = "SPACE-" + UUID.randomUUID().toString().substring(0, 8);
        this.name = name;
        this.users = users;
    }
}
