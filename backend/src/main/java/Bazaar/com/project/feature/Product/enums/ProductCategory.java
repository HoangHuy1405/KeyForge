package Bazaar.com.project.feature.Product.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * KeyForge product categories for mechanical keyboard marketplace.
 */
@Getter
@RequiredArgsConstructor
public enum ProductCategory {
    KEYBOARD_KIT("Keyboard Kit"),
    SWITCH("Switch"),
    KEYCAP("Keycap Set"),
    STABILIZER("Stabilizer"),
    PCB("PCB Board"),
    PLATE("Plate"),
    CASE("Case"),
    ACCESSORY("Accessory");

    private final String displayName;
}
