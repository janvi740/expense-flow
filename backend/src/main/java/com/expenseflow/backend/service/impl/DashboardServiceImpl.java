package com.expenseflow.backend.service.impl;

import com.expenseflow.backend.dto.CategoryExpenseResponse;
import com.expenseflow.backend.dto.ExpenseSummaryResponse;
import com.expenseflow.backend.entity.User;
import com.expenseflow.backend.exception.ResourceNotFoundException;
import com.expenseflow.backend.repository.ExpenseRepository;
import com.expenseflow.backend.repository.UserRepository;
import com.expenseflow.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl
        implements DashboardService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Override
    public ExpenseSummaryResponse getSummary(
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Double totalExpense =
                expenseRepository.getTotalExpenseByUser(user);

        Long totalTransactions =
                expenseRepository.countByUser(user);

        return new ExpenseSummaryResponse(
                totalExpense,
                totalTransactions
        );
    }

    @Override
    public List<CategoryExpenseResponse>
    getCategoryWiseExpenses(
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        List<Object[]> results =
                expenseRepository.getCategoryWiseExpenses(user);

        List<CategoryExpenseResponse> response =
                new ArrayList<>();

        for(Object[] row : results) {

            response.add(
                    new CategoryExpenseResponse(
                            row[0].toString(),
                            (Double) row[1]
                    )
            );
        }

        return response;
    }
}