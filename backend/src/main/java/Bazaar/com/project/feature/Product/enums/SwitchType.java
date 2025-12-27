package Bazaar.com.project.feature.Product.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Switch types in mechanical keyboards.
 */
@Getter
@RequiredArgsConstructor
public enum SwitchType {
    LINEAR("Linear"),
    TACTILE("Tactile"),
    CLICKY("Clicky"),
    SILENT_LINEAR("Silent Linear"),
    SILENT_TACTILE("Silent Tactile"),
    HALL_EFFECT("Hall Effect");

    private final String displayName;
}
