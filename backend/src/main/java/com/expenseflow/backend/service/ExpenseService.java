package com.expenseflow.backend.service;

import com.expenseflow.backend.dto.CategorySummaryDto;
import com.expenseflow.backend.dto.ExpenseRequest;
import com.expenseflow.backend.dto.ExpenseResponseDto;
import com.expenseflow.backend.entity.Expense;
import org.springframework.data.domain.Page;
import java.util.List;
import java.time.LocalDate;

public interface ExpenseService {

    List<CategorySummaryDto> getCategorySummary();

    List<ExpenseResponseDto> getExpensesByCategory(String category);

    List<ExpenseResponseDto> getExpensesByDateRange(
            LocalDate startDate,
            LocalDate endDate
    );

    List<ExpenseResponseDto> getExpensesByAmountRange(
            Double minAmount,
            Double maxAmount
    );

    List<ExpenseResponseDto> searchExpenses(
            String keyword
    );


    Expense addExpense(
            ExpenseRequest request,
            String email
    );

    Page<Expense> getUserExpenses(
            String email,
            int page,
            int size,
            String sortBy,
            String category
    );

    Expense updateExpense(
            Long expenseId,
            ExpenseRequest request,
            String email
    );

    void deleteExpense(
            Long expenseId,
            String email
    );
}