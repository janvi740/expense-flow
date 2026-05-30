package com.expenseflow.backend.controller;

import com.expenseflow.backend.dto.CategoryExpenseResponse;
import com.expenseflow.backend.dto.ExpenseSummaryResponse;
import com.expenseflow.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ExpenseSummaryResponse getSummary(
            Authentication authentication
    ) {

        return dashboardService.getSummary(
                authentication.getName()
        );
    }

    @GetMapping("/categories")
    public List<CategoryExpenseResponse>
    getCategoryWiseExpenses(
            Authentication authentication
    ) {

        return dashboardService.getCategoryWiseExpenses(
                authentication.getName()
        );
    }
}