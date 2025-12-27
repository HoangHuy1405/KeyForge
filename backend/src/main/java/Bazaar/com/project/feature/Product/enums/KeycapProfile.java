package Bazaar.com.project.feature.Product.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Keycap profiles - the shape of the keycap.
 */
@Getter
@RequiredArgsConstructor
public enum KeycapProfile {
    CHERRY("Cherry"),
    SA("SA"),
    DSA("DSA"),
    OEM("OEM"),
    XDA("XDA"),
    KAT("KAT"),
    MT3("MT3"),
    ASA("ASA"),
    MDA("MDA");

    private final String displayName;
}
