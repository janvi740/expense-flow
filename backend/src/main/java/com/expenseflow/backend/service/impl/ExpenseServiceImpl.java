package com.expenseflow.backend.service.impl;

import com.expenseflow.backend.dto.ExpenseRequest;
import com.expenseflow.backend.dto.ExpenseResponseDto;
import com.expenseflow.backend.entity.Expense;
import com.expenseflow.backend.entity.ExpenseCategory;
import com.expenseflow.backend.entity.User;
import com.expenseflow.backend.exception.ResourceNotFoundException;
import com.expenseflow.backend.repository.ExpenseRepository;
import com.expenseflow.backend.repository.UserRepository;
import com.expenseflow.backend.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.expenseflow.backend.exception.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.expenseflow.backend.dto.CategorySummaryDto;
import java.util.List;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Override
    public Expense addExpense(
            ExpenseRequest request,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Expense expense = Expense.builder()
                .title(request.getTitle())
                .amount(request.getAmount())
                .category(request.getCategory())
                .expenseDate(request.getExpenseDate())
                .description(request.getDescription())
                .user(user)
                .build();

        return expenseRepository.save(expense);
    }

    @Override
    public Page<Expense> getUserExpenses(
            String email,
            int page,
            int size,
            String sortBy,
            String category
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy).descending()
        );

        if(category != null && !category.isEmpty()) {

            ExpenseCategory expenseCategory =
                    ExpenseCategory.valueOf(category.toUpperCase());

            return expenseRepository.findByUserAndCategory(
                    user,
                    expenseCategory,
                    pageable
            );
        }

        return expenseRepository.findByUser(
                user,
                pageable
        );
    }

    @Override
    public Expense updateExpense(
            Long expenseId,
            ExpenseRequest request,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Expense not found"));

        if(!expense.getUser().getId().equals(user.getId())) {
            throw new BadRequestException(
                    "You cannot update this expense"
            );
        }

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());

        return expenseRepository.save(expense);
    }

    @Override
    public void deleteExpense(
            Long expenseId,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Expense not found"));

        if(!expense.getUser().getId().equals(user.getId())) {
            throw new BadRequestException(
                    "You cannot delete this expense"
            );
        }

        expenseRepository.delete(expense);
    }
    @Override
    public List<CategorySummaryDto> getCategorySummary() {

        User user = getCurrentUser();

        return expenseRepository.getCategorySummary(
                user.getId()
        );
    }

    private User getCurrentUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<ExpenseResponseDto> getExpensesByCategory(String category) {

        User user = getCurrentUser();

        ExpenseCategory expenseCategory =
                ExpenseCategory.valueOf(category.toUpperCase());

        return expenseRepository
                .findByUserAndCategory(user, expenseCategory)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<ExpenseResponseDto> getExpensesByDateRange(
            LocalDate startDate,
            LocalDate endDate
    ) {

        User user = getCurrentUser();

        return expenseRepository
                .findByUserAndExpenseDateBetween(user, startDate, endDate)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    private ExpenseResponseDto mapToDto(Expense expense) {

        return new ExpenseResponseDto(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getExpenseDate(),
                expense.getDescription()
        );
    }

    @Override
    public List<ExpenseResponseDto> getExpensesByAmountRange(
            Double minAmount,
            Double maxAmount
    ) {

        User user = getCurrentUser();

        return expenseRepository
                .findByUserAndAmountBetween(user, minAmount, maxAmount)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<ExpenseResponseDto> searchExpenses(
            String keyword
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );
        List<Expense> expenses =
                expenseRepository
                        .findByUserAndTitleContainingIgnoreCase(
                                user,
                                keyword
                        );

        return expenses.stream()
                .map(this::mapToDto)
                .toList();
    }
}