package com.expenseflow.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private ExpenseCategory category;

    private LocalDate expenseDate;

    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}