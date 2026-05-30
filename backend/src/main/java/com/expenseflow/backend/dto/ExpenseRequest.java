package com.expenseflow.backend.dto;

import com.expenseflow.backend.entity.ExpenseCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ExpenseRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Amount is required")
    private Double amount;

    @NotNull(message = "Category is required")
    private ExpenseCategory category;

    @NotNull(message = "Date is required")
    private LocalDate expenseDate;

    private String description;
}