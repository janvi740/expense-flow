package com.expenseflow.backend.repository;

import com.expenseflow.backend.entity.Expense;
import com.expenseflow.backend.entity.ExpenseCategory;
import com.expenseflow.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.expenseflow.backend.dto.CategorySummaryDto;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository
        extends JpaRepository<Expense, Long> {

    List<Expense> findByUser(User user);
    Long countByUser(User user);

    List<Expense> findByUserAndCategory(User user, ExpenseCategory category);

    List<Expense> findByUserAndExpenseDateBetween(
            User user,
            LocalDate startDate,
            LocalDate endDate
    );

    Page<Expense> findByUser(
            User user,
            Pageable pageable
    );

    Page<Expense> findByUserAndCategory(
            User user,
            ExpenseCategory category,
            Pageable pageable
    );

    List<Expense> findByUserAndTitleContainingIgnoreCase(
            User user,
            String title
    );

    @Query("""
       SELECT COALESCE(SUM(e.amount), 0)
       FROM Expense e
       WHERE e.user = :user
       """)
    Double getTotalExpenseByUser(
            @Param("user") User user
    );

    @Query("""
       SELECT e.category, SUM(e.amount)
       FROM Expense e
       WHERE e.user = :user
       GROUP BY e.category
       """)
    List<Object[]> getCategoryWiseExpenses(
            @Param("user") User user
    );

    @Query("""
    SELECT
        e.category as category,
        SUM(e.amount) as total
    FROM Expense e
    WHERE e.user.id = :userId
    GROUP BY e.category
""")
    List<CategorySummaryDto> getCategorySummary(
            Long userId
    );


    List<Expense> findByUserAndAmountBetween(
            User user,
            Double minAmount,
            Double maxAmount
    );
}