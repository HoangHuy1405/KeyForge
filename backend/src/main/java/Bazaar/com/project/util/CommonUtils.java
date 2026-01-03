package Bazaar.com.project.util;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CommonUtils {

    private static final BigDecimal FALLBACK_EXCHANGE_RATE = new BigDecimal("24000.00");

    public static BigDecimal fetchRealTimeExchangeRate() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            // Free API provider: open.er-api.com
            // Returns JSON like: { "rates": { "VND": 24500.50, ... } }
            String apiUrl = "https://open.er-api.com/v6/latest/USD";

            Map response = restTemplate.getForObject(apiUrl, Map.class);

            if (response != null && response.get("rates") instanceof Map) {
                Map<String, Object> rates = (Map<String, Object>) response.get("rates");
                Object vndRate = rates.get("VND");

                if (vndRate instanceof Number) {
                    BigDecimal rate = new BigDecimal(vndRate.toString());
                    log.info("Fetched real-time exchange rate: 1 USD = {} VND", rate);
                    return rate;
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch exchange rate, using fallback. Error: {}", e.getMessage());
        }

        return FALLBACK_EXCHANGE_RATE;
    }

    public static Instant getCompareTime(String timeframe) {
        return switch (timeframe.toLowerCase()) {
            case "1d" -> Instant.now().minus(1, ChronoUnit.DAYS);
            case "7d" -> Instant.now().minus(7, ChronoUnit.DAYS);
            case "current" -> Instant.EPOCH;
            default -> throw new IllegalArgumentException("Invalid timeframe: " + timeframe);
        };
    }
}
