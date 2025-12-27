package Bazaar.com.project.feature.Product.dto;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

import Bazaar.com.project.feature.Product._ProductMedia.dto.ProductImageDto;
import Bazaar.com.project.feature.Product._ProductMedia.model.ProductImage;
import Bazaar.com.project.feature.Product.dto.response.InventoryResponse;
import Bazaar.com.project.feature.Product.dto.response.LogisticsResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductBasicResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductFullResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductSummaryResponse;
import Bazaar.com.project.feature.Product.dto.response.ProductViewerResponse;
import Bazaar.com.project.feature.Product.dto.response.ShippingOptionsResponse;
import Bazaar.com.project.feature.Product.model.Product;
import Bazaar.com.project.feature.Product.model.embeddables.InventoryInfo;
import Bazaar.com.project.feature.Product.model.embeddables.LogisticsInfo;
import Bazaar.com.project.feature.Product.model.embeddables.LogisticsInfo.ShippingOptions;
import Bazaar.com.project.feature.User.dto.UserProfileResponseDto;
import Bazaar.com.project.feature.User.model.User;

/**
 * Mapper for KeyForge Product entity to various DTOs.
 */
public class ProductMapper {

        /**
         * Basic response after product creation.
         */
        @Transactional(readOnly = true)
        public static ProductBasicResponse toBasic(Product p) {
                InventoryInfo inv = p.getInventory();
                return ProductBasicResponse.builder()
                                .id(p.getId())
                                .name(p.getName())
                                .description(p.getDescription())
                                .category(p.getCategory())
                                .stockStatus(p.getStockStatus())
                                .status(p.getStatus())
                                .price(inv != null ? inv.getPrice() : null)
                                .stockQuantity(inv != null ? inv.getStockQuantity() : 0)
                                .attributes(p.getAttributes())
                                .build();
        }

        /**
         * Full response for seller's product management.
         */
        @Transactional(readOnly = true)
        public static ProductFullResponse toFull(Product p) {
                InventoryInfo inv = p.getInventory();
                LogisticsInfo lg = p.getLogistics();

                return ProductFullResponse.builder()
                                .id(p.getId())
                                .name(p.getName())
                                .description(p.getDescription())
                                .category(p.getCategory())
                                .stockStatus(p.getStockStatus())
                                .status(p.getStatus())
                                .thumbnailUrl(p.getThumbnailUrl())
                                .attributes(p.getAttributes())
                                .inventory(toInventoryResponse(inv))
                                .logistics(toLogisticsResponse(lg))
                                .createdAt(p.getCreatedAt())
                                .updatedAt(p.getUpdatedAt())
                                .build();
        }

        /**
         * Summary for product listing grid.
         */
        @Transactional(readOnly = true)
        public static ProductSummaryResponse toSummary(Product p) {
                InventoryInfo inv = p.getInventory();
                LogisticsInfo lg = p.getLogistics();

                return ProductSummaryResponse.builder()
                                .id(p.getId())
                                .name(p.getName())
                                .thumbnailUrl(p.getThumbnailUrl())
                                .category(p.getCategory())
                                .stockStatus(p.getStockStatus())
                                .status(p.getStatus())
                                .price(inv != null ? inv.getPrice() : null)
                                .availableQuantity(inv != null ? inv.availableQuantity() : 0)
                                .location(lg != null ? lg.getLocation() : null)
                                .attributes(p.getAttributes())
                                .createdAt(p.getCreatedAt())
                                .build();
        }

        /**
         * Full detail for product viewer page (customer-facing).
         */
        public static ProductViewerResponse toViewer(Product p, User u, String avatarUrl) {
                InventoryInfo inv = p.getInventory();
                LogisticsInfo lg = p.getLogistics();

                UserProfileResponseDto seller = UserProfileResponseDto.builder()
                                .id(u.getId())
                                .username(u.getUsername())
                                .email(u.getEmail())
                                .phoneNum(u.getPhoneNum())
                                .avatarUrl(avatarUrl)
                                .build();

                return ProductViewerResponse.builder()
                                .id(p.getId())
                                .name(p.getName())
                                .description(p.getDescription())
                                .category(p.getCategory())
                                .stockStatus(p.getStockStatus())
                                .status(p.getStatus())
                                .thumbnailUrl(p.getThumbnailUrl())
                                .images(toImageDtoList(p.getImages()))
                                .attributes(p.getAttributes())
                                .inventory(toInventoryResponse(inv))
                                .logistics(toLogisticsResponse(lg))
                                .seller(seller)
                                .build();
        }

        // ===== Helper methods =====

        public static InventoryResponse toInventoryResponse(InventoryInfo inv) {
                if (inv == null) {
                        return InventoryResponse.builder().build();
                }
                return InventoryResponse.builder()
                                .price(inv.getPrice())
                                .stockQuantity(inv.getStockQuantity())
                                .reservedQuantity(inv.getReservedQuantity())
                                .availableQuantity(inv.availableQuantity())
                                .minOrderQuantity(inv.getMinOrderQuantity())
                                .maxOrderQuantity(inv.getMaxOrderQuantity())
                                .build();
        }

        public static LogisticsResponse toLogisticsResponse(LogisticsInfo lg) {
                if (lg == null) {
                        return LogisticsResponse.builder().build();
                }
                ShippingOptions ship = lg.getShipping();

                ShippingOptionsResponse shipping = ShippingOptionsResponse.builder()
                                .fast(ship != null ? ship.getFast() : null)
                                .regular(ship != null ? ship.getRegular() : null)
                                .economy(ship != null ? ship.getEconomy() : null)
                                .build();

                return LogisticsResponse.builder()
                                .location(lg.getLocation())
                                .shipping(shipping)
                                .build();
        }

        public static ProductImageDto toImageDto(ProductImage entity) {
                if (entity == null)
                        return null;
                return new ProductImageDto(
                                entity.getId(),
                                entity.getUrl(),
                                entity.getPublicId(),
                                entity.getVersion(),
                                entity.getSortOrder());
        }

        public static List<ProductImageDto> toImageDtoList(List<ProductImage> entities) {
                if (entities == null)
                        return List.of();
                return entities.stream()
                                .map(ProductMapper::toImageDto)
                                .collect(Collectors.toList());
        }
}
