package com.expenseflow.backend.dto;

import com.expenseflow.backend.entity.ExpenseCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseResponseDto {

    private Long id;

    private String title;

    private Double amount;

    private ExpenseCategory category;

    private LocalDate expenseDate;

    private String description;
}