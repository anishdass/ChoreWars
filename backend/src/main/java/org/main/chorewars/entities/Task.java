package org.main.chorewars.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.main.chorewars.entities.enums.TaskFrequency;
import org.main.chorewars.entities.enums.TaskStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "tasks")
public class Task {
    @Id
    @Column(updatable = false)
    private String taskId;

    @ManyToOne
    @JoinColumn(name = "space_id")
    private Space space;

    @Setter
    @Column(nullable = false)
    private String title;

    @Setter
    @Column(nullable = false)
    private String description;

    @Setter
    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @Setter
    @ManyToOne
    @JoinColumn(name = "completed_by_id")
    private User completedBy;

    @Setter
    @ManyToOne
    @JoinColumn(name = "assigner_id")
    private User assigner;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskFrequency frequency;

    @Setter
    @Column(nullable = false)
    private int pointsAssigned;

    @Setter
    @Column(nullable = false)
    private boolean isAdult;

    @Setter
    @Column(nullable = false)
    private boolean isRepeated;

    @Setter
    @Column(nullable = false)
    private boolean isArchived;

    @Setter
    @Column(nullable = false)
    private boolean isPaused;

    @Setter
    @Column(nullable = false)
    private boolean isScheduled;

    @Setter
    @Column(nullable = false)
    private LocalDateTime timeDedicated;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Setter
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Setter
    private LocalDateTime completedAt;

    @Setter
    private LocalDateTime nextOccurrence;

    @Setter
    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    public Task(String title, String description, boolean isAdult, TaskFrequency frequency, User assigner, boolean isRepeated, boolean isScheduled) {
        this.taskId = "TASK-" + UUID.randomUUID().toString().substring(0, 8);
        this.title = title;
        this.description = description;
        this.status = TaskStatus.CREATED;
        this.space = assigner.getSpace();
        this.frequency = frequency;
        this.assigner = assigner;
        this.isAdult = isAdult;
        this.isArchived = false;
        this.isPaused = false;
        this.isRepeated = isRepeated;
        this.isScheduled = isScheduled;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
