package Bazaar.com.project.dto.ProductDto;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

import Bazaar.com.project.dto.ProductDto.Response.DetailedResponse;
import Bazaar.com.project.dto.ProductDto.Response.InventoryResponse;
import Bazaar.com.project.dto.ProductDto.Response.LogisticsResponse;
import Bazaar.com.project.dto.ProductDto.Response.ProductBasicResponse;
import Bazaar.com.project.dto.ProductDto.Response.ProductFullResponse;
import Bazaar.com.project.dto.ProductDto.Response.ProductSummaryResponse;
import Bazaar.com.project.dto.ProductDto.Response.ProductViewerResponse;
import Bazaar.com.project.dto.ProductDto.Response.ShippingOptionsResponse;
import Bazaar.com.project.dto.UserDto.UserProfileResponseDto;
import Bazaar.com.project.model.Product.Product;
import Bazaar.com.project.model.Product.ProductImage;
import Bazaar.com.project.model.Product.embeddables.InventoryInfo;
import Bazaar.com.project.model.Product.embeddables.LogisticsInfo;
import Bazaar.com.project.model.Product.embeddables.LogisticsInfo.Dimensions;
import Bazaar.com.project.model.Product.embeddables.LogisticsInfo.ShippingOptions;
import Bazaar.com.project.model.UserAggregate.User;
import Bazaar.com.project.model.Product.embeddables.ProductDetails;

public class ProductMapper {
        /** For createBasic response (step 1) */
        @Transactional(readOnly = true)
        public static ProductBasicResponse toBasic(Product p) {
                return ProductBasicResponse.builder()
                                .id(p.getId())
                                .name(p.getName())
                                .description(p.getDescription())
                                .category(p.getCategory())
                                .status(p.getStatus())
                                .build();
        }

        @Transactional(readOnly = true)
        public static ProductFullResponse toResponse(Product p) {
                ProductDetails d = p.getDetails();
                InventoryInfo inv = p.getInventory();
                LogisticsInfo lg = p.getLogistics();
                Dimensions dim = lg != null ? lg.getDimensions() : null;
                ShippingOptions ship = lg != null ? lg.getShipping() : null;

                DetailedResponse detailed = DetailedResponse.builder()
                                .brand(d != null ? d.getBrand() : null)
                                .model(d != null ? d.getModel() : null)
                                .size(d != null ? d.getSize() : null)
                                .material(d != null ? d.getMaterial() : null)
                                .origin(d != null ? d.getOrigin() : null)
                                .condition(d != null ? d.getCondition() : null)
                                .build();

                InventoryResponse inventory = InventoryResponse.builder()
                                .price(inv != null ? inv.getPrice() : null)
                                .stockQuantity(inv != null ? inv.getStockQuantity() : 0)
                                .reservedQuantity(inv != null ? inv.getReservedQuantity() : 0)
                                .availableQuantity(inv != null ? inv.availableQuantity() : 0)
                                .minOrderQuantity(inv != null ? inv.getMinOrderQuantity() : 1)
                                .maxOrderQuantity(inv != null ? inv.getMaxOrderQuantity() : null)
                                .build();

                ShippingOptionsResponse shipping = ShippingOptionsResponse.builder()
                                .fast(ship != null ? ship.getFast() : null)
                                .regular(ship != null ? ship.getRegular() : null)
                                .economy(ship != null ? ship.getEconomy() : null)
                                .build();

                LogisticsResponse logistics = LogisticsResponse.builder()
                                .weightGrams(lg != null ? lg.getWeightGrams() : null)
                                .lengthCm(dim != null ? dim.getLengthCm() : null)
                                .widthCm(dim != null ? dim.getWidthCm() : null)
                                .heightCm(dim != null ? dim.getHeightCm() : null)
                                .location(lg != null ? lg.getLocation() : null)
                                .preOrder(lg != null ? lg.getPreOrder() : null)
                                .preOrderLeadTimeDays(lg != null ? lg.getPreOrderLeadTimeDays() : null)
                                .shipping(shipping)
                                .build();

                return ProductFullResponse.builder()
                                .id(p.getId())
                                .name(p.getName())
                                .description(p.getDescription())
                                .category(p.getCategory())
                                .status(p.getStatus())
                                .details(detailed)
                                .inventory(inventory)
                                .logistics(logistics)
                                .build();
        }

        /** Summary card for product listing pages */
        @Transactional(readOnly = true)
        public static ProductSummaryResponse toSummary(Product p) {
                InventoryInfo inv = p.getInventory();
                ProductDetails d = p.getDetails();
                LogisticsInfo log = p.getLogistics();
                Integer available = (inv != null) ? inv.availableQuantity() : 0;

                DetailedResponse detailed = DetailedResponse.builder()
                                .brand(d != null ? d.getBrand() : null)
                                .model(d != null ? d.getModel() : null)
                                .size(d != null ? d.getSize() : null)
                                .material(d != null ? d.getMaterial() : null)
                                .origin(d != null ? d.getOrigin() : null)
                                .condition(d != null ? d.getCondition() : null)
                                .build();

                LogisticsResponse logistic = LogisticsResponse.builder()
                                .location(log.getLocation())
                                .build();

                InventoryResponse inventory = InventoryResponse.builder()
                                .price(inv != null ? inv.getPrice() : null)
                                .build();

                return ProductSummaryResponse.builder()
                                .id(p.getId())
                                .name(p.getName())
                                .thumbnailUrl(p.getThumbnailUrl())
                                .category(p.getCategory())
                                .status(p.getStatus())
                                .details(detailed)
                                .logistic(logistic)
                                .inventory(inventory)
                                .availableQuantity(available)
                                .createdAt(p.getCreatedAt())
                                .build();
        }

        public static ProductViewerResponse toViewer(Product p, User u, String avatarUrl) {
                InventoryInfo inv = p.getInventory();
                ProductDetails d = p.getDetails();
                LogisticsInfo log = p.getLogistics();

                DetailedResponse detailed = DetailedResponse.builder()
                                .brand(d != null ? d.getBrand() : null)
                                .model(d != null ? d.getModel() : null)
                                .size(d != null ? d.getSize() : null)
                                .material(d != null ? d.getMaterial() : null)
                                .origin(d != null ? d.getOrigin() : null)
                                .condition(d != null ? d.getCondition() : null)
                                .build();

                LogisticsResponse logistic = LogisticsResponse.builder()
                                .weightGrams(log != null ? log.getWeightGrams() : null)
                                .lengthCm(log != null ? log.getDimensions().getLengthCm() : null)
                                .widthCm(log != null ? log.getDimensions().getWidthCm() : null)
                                .heightCm(log != null ? log.getDimensions().getHeightCm() : null)
                                .location(log != null ? log.getLocation() : null)
                                .preOrder(log != null ? log.getPreOrder() : null)
                                .preOrderLeadTimeDays(log != null ? log.getPreOrderLeadTimeDays() : null)
                                .shipping(new ShippingOptionsResponse(
                                                log != null ? log.getShipping().getFast() : null,
                                                log != null ? log.getShipping().getRegular() : null,
                                                log != null ? log.getShipping().getEconomy() : null))
                                .build();

                InventoryResponse inventory = InventoryResponse.builder()
                                .price(inv != null ? inv.getPrice() : null)
                                .availableQuantity(inv != null ? inv.availableQuantity() : null)
                                .minOrderQuantity(inv != null ? inv.getMinOrderQuantity()
                                                : null)
                                .maxOrderQuantity(inv != null ? inv.getMaxOrderQuantity()
                                                : null)
                                .build();
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
                                .status(p.getStatus())
                                .thumbnailUrl(p.getThumbnailUrl())
                                .images(toImageDtoList(p.getImages()))
                                .details(detailed)
                                .inventory(inventory)
                                .logistics(logistic)
                                .seller(seller)
                                .build();
        }

        public static ProductImageDto toImageDto(ProductImage entity) {
                if (entity == null)
                        return null;
                return new ProductImageDto(
                                entity.getId(), // from BaseEntity (UUID)
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
