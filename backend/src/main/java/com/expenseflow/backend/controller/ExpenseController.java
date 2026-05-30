package com.expenseflow.backend.controller;

import com.expenseflow.backend.dto.ExpenseRequest;
import com.expenseflow.backend.entity.Expense;
import com.expenseflow.backend.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import com.expenseflow.backend.dto.CategorySummaryDto;
import java.util.List;
import com.expenseflow.backend.dto.ExpenseResponseDto;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public Expense addExpense(
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication
    ) {

        return expenseService.addExpense(
                request,
                authentication.getName()
        );
    }

    @GetMapping
    public Page<Expense> getExpenses(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size,

            @RequestParam(defaultValue = "expenseDate")
            String sortBy,

            @RequestParam(required = false)
            String category,

            Authentication authentication
    ) {

        return expenseService.getUserExpenses(
                authentication.getName(),
                page,
                size,
                sortBy,
                category
        );
    }

    @PutMapping("/{expenseId}")
    public Expense updateExpense(
            @PathVariable Long expenseId,
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication
    ) {

        return expenseService.updateExpense(
                expenseId,
                request,
                authentication.getName()
        );
    }

    @DeleteMapping("/{expenseId}")
    public String deleteExpense(
            @PathVariable Long expenseId,
            Authentication authentication
    ) {

        expenseService.deleteExpense(
                expenseId,
                authentication.getName()
        );

        return "Expense deleted successfully";
    }

    @GetMapping("/summary/category")
    public List<CategorySummaryDto> getCategorySummary() {

        return expenseService.getCategorySummary();
    }


    @GetMapping("/category/{category}")
    public ResponseEntity<List<ExpenseResponseDto>> getExpensesByCategory(
            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                expenseService.getExpensesByCategory(category)
        );
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ExpenseResponseDto>> getExpensesByDateRange(

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {

        return ResponseEntity.ok(
                expenseService.getExpensesByDateRange(
                        startDate,
                        endDate
                )
        );
    }

    @GetMapping("/amount-range")
    public ResponseEntity<List<ExpenseResponseDto>> getExpensesByAmountRange(

            @RequestParam Double minAmount,
            @RequestParam Double maxAmount
    ) {

        return ResponseEntity.ok(
                expenseService.getExpensesByAmountRange(
                        minAmount,
                        maxAmount
                )
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<ExpenseResponseDto>> searchExpenses(

            @RequestParam String keyword
    ) {

        return ResponseEntity.ok(
                expenseService.searchExpenses(keyword)
        );
    }
}