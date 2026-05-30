package com.expenseflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryExpenseResponse {

    private String category;

    private Double totalAmount;
}