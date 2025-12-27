package Bazaar.com.project.feature.Product.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Keyboard layout sizes commonly used in mechanical keyboard community.
 */
@Getter
@RequiredArgsConstructor
public enum KeyboardLayout {
    FULL_SIZE("Full Size (100%)", 104),
    NINETY_SIX("96%", 96),
    TKL("TKL (80%)", 87),
    SEVENTY_FIVE("75%", 84),
    SIXTY_FIVE("65%", 68),
    SIXTY("60%", 61),
    FORTY("40%", 40),
    NUMPAD("Numpad", 21),
    MACRO_PAD("Macro Pad", 0);

    private final String displayName;
    private final int approximateKeyCount;
}
