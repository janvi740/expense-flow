package com.expenseflow.backend.service;

import com.expenseflow.backend.dto.CategoryExpenseResponse;
import com.expenseflow.backend.dto.ExpenseSummaryResponse;

import java.util.List;

public interface DashboardService {

    ExpenseSummaryResponse getSummary(
            String email
    );

    List<CategoryExpenseResponse>
    getCategoryWiseExpenses(
            String email
    );
}