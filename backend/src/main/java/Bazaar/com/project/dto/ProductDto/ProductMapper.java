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
        @Transactional(readOnly = true)
        public static ProductFullResponse toResponse(Product p) {
                ProductDetails d = p.getDetails();
                InventoryInfo inv = p.getInventory();
                LogisticsInfo lg = p.getLogistics();
                Dimensions dim = lg != null ? lg.getDimensions() : null;
                ShippingOptions ship = lg != null ? lg.getShipping() : null;

                return new ProductFullResponse(
                                p.getId(),
                                p.getName(),
                                p.getDescription(),
                                p.getCategory(),
                                p.getStatus(),
                                new DetailedResponse(
                                                d != null ? d.getBrand() : null,
                                                d != null ? d.getModel() : null,
                                                d != null ? d.getSize() : null,
                                                d != null ? d.getMaterial() : null,
                                                d != null ? d.getOrigin() : null,
                                                d != null ? d.getCondition() : null),
                                new InventoryResponse(
                                                inv.getPrice(),
                                                inv != null ? inv.getStockQuantity() : 0,
                                                inv != null ? inv.getReservedQuantity() : 0,
                                                inv != null ? inv.availableQuantity() : 0,
                                                inv != null ? inv.getMinOrderQuantity() : 1,
                                                inv != null ? inv.getMaxOrderQuantity() : null),
                                new LogisticsResponse(
                                                lg != null ? lg.getWeightGrams() : null,
                                                dim != null ? dim.getLengthCm() : null,
                                                dim != null ? dim.getWidthCm() : null,
                                                dim != null ? dim.getHeightCm() : null,
                                                lg != null ? lg.getLocation() : null,
                                                lg != null ? lg.getPreOrder() : null,
                                                lg != null ? lg.getPreOrderLeadTimeDays() : null,
                                                new ShippingOptionsResponse(
                                                                ship != null ? ship.getFast() : null,
                                                                ship != null ? ship.getRegular() : null,
                                                                ship != null ? ship.getEconomy() : null)));
        }

        /** For createBasic response (step 1) */
        @Transactional(readOnly = true)
        public static ProductBasicResponse toBasic(Product p) {
                return new ProductBasicResponse(
                                p.getId(),
                                p.getName(),
                                p.getDescription(),
                                p.getCategory(),
                                p.getStatus());
        }

        /** Summary card for product listing pages */
        @Transactional(readOnly = true)
        public static ProductSummaryResponse toSummary(Product p) {
                InventoryInfo inv = p.getInventory();
                Integer available = inv != null ? inv.availableQuantity() : 0;
                return new ProductSummaryResponse(
                                p.getId(),
                                p.getName(),
                                p.getThumbnailUrl(),
                                p.getCategory(),
                                p.getStatus(),
                                available);
        }

}
