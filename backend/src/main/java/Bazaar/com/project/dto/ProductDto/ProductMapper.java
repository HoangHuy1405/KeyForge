package Bazaar.com.project.dto.ProductDto;

import org.springframework.transaction.annotation.Transactional;

import Bazaar.com.project.dto.ProductDto.Response.DetailedResponse;
import Bazaar.com.project.dto.ProductDto.Response.InventoryResponse;
import Bazaar.com.project.dto.ProductDto.Response.LogisticsResponse;
import Bazaar.com.project.dto.ProductDto.Response.ProductBasicResponse;
import Bazaar.com.project.dto.ProductDto.Response.ProductFullResponse;
import Bazaar.com.project.dto.ProductDto.Response.ProductSummaryResponse;
import Bazaar.com.project.dto.ProductDto.Response.ShippingOptionsResponse;
import Bazaar.com.project.model.Product.Product;
import Bazaar.com.project.model.Product.embeddables.InventoryInfo;
import Bazaar.com.project.model.Product.embeddables.LogisticsInfo;
import Bazaar.com.project.model.Product.embeddables.LogisticsInfo.Dimensions;
import Bazaar.com.project.model.Product.embeddables.LogisticsInfo.ShippingOptions;
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

                return ProductSummaryResponse.builder()
                                .id(p.getId())
                                .name(p.getName())
                                .thumbnailUrl(p.getThumbnailUrl())
                                .category(p.getCategory())
                                .status(p.getStatus())
                                .details(detailed)
                                .location(log != null ? log.getLocation() : null)
                                .availableQuantity(available)
                                .build();
        }

}
