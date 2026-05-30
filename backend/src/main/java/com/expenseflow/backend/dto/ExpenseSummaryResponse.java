package com.expenseflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExpenseSummaryResponse {

    private Double totalExpense;

    private Long totalTransactions;
}