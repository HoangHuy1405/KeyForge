package Bazaar.com.project.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import Bazaar.com.project.feature.Product.enums.ProductStatus;
import Bazaar.com.project.feature.Product.model.Product;
import Bazaar.com.project.feature.Product.repository.ProductRepository;
import Bazaar.com.project.feature.User.model.User;
import Bazaar.com.project.feature.User.repository.UserRepository;

import org.springframework.http.MediaType;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerIT {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    private User testSeller;

    @Autowired
    private ObjectMapper objectMapper;

    private Product savedProduct;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        userRepository.deleteAll();

        User seller = new User();
        seller.setFullname("Test Seller");
        // seller.setEmail("seller@example.com");
        seller = userRepository.save(seller);
        this.testSeller = seller;

        Product product = new Product();
        product.setName("New Product");
        product.setDescription("New product description");

        savedProduct = productRepository.save(product);
    }

    @Test
    void testCreateProduct() throws Exception {
        Product newProduct = new Product();
        newProduct.setName("New Product");
        newProduct.setDescription("New product description");
        newProduct.setStatus(ProductStatus.ACTIVE);
        newProduct.setSeller(testSeller);

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newProduct)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Product created successfully"))
                .andExpect(jsonPath("$.data.name").value("New Product"))
                .andExpect(jsonPath("$.data.price").value(200));
    }

    @Test
    void testGetProductById() throws Exception {
        mockMvc.perform(get("/products/{id}", savedProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Product fetched successfully"))
                .andExpect(jsonPath("$.data.name").value("Test Product"));
    }

    @Test
    void testGetAllProducts() throws Exception {
        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Products fetched successfully"))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void testUpdateProduct() throws Exception {
        savedProduct.setName("Updated Product");

        mockMvc.perform(put("/products/{id}", savedProduct.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(savedProduct)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Product updated successfully"))
                .andExpect(jsonPath("$.data.name").value("Updated Product"));

        Product updated = productRepository.findById(savedProduct.getId()).orElseThrow();
        assertThat(updated.getName()).isEqualTo("Updated Product");
    }

    @Test
    void testDeleteProduct() throws Exception {
        mockMvc.perform(delete("/products/{id}", savedProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Product deleted successfully"));

        assertThat(productRepository.existsById(savedProduct.getId())).isFalse();
    }
}
