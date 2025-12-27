package Bazaar.com.project.feature.Product.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Stock status for Group Buy lifecycle management.
 */
@Getter
@RequiredArgsConstructor
public enum StockStatus {
    IN_STOCK("In Stock"), // Ready to ship immediately
    PRE_ORDER("Pre-Order"), // In production, shipping later
    GROUP_BUY("Group Buy"), // Live group buy
    INTEREST_CHECK("Interest Check"), // Gauging demand
    OUT_OF_STOCK("Out of Stock");

    private final String displayName;
}
