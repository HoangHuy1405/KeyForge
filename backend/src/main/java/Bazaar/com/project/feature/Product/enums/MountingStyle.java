package Bazaar.com.project.feature.Product.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Mounting styles for keyboard builds.
 */
@Getter
@RequiredArgsConstructor
public enum MountingStyle {
    GASKET("Gasket Mount"),
    TOP_MOUNT("Top Mount"),
    TRAY_MOUNT("Tray Mount"),
    SANDWICH("Sandwich Mount"),
    INTEGRATED_PLATE("Integrated Plate"),
    PLATELESS("Plateless");

    private final String displayName;
}
