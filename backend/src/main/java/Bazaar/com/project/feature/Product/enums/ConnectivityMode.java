package Bazaar.com.project.feature.Product.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Connectivity modes for keyboards.
 */
@Getter
@RequiredArgsConstructor
public enum ConnectivityMode {
    WIRED("Wired (USB-C)"),
    BLUETOOTH("Bluetooth"),
    USB_DONGLE("2.4G Wireless");

    private final String displayName;
}
