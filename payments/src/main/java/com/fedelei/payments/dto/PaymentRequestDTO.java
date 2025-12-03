package com.fedelei.payments.dto;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private String title;       // Nombre del producto
    private Integer quantity;   // Cantidad
    private Double price;       // Precio unitario
}