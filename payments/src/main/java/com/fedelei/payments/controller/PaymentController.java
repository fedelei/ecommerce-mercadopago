package com.fedelei.payments.controller;


import com.fedelei.payments.dto.PaymentRequestDTO;
import com.fedelei.payments.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Operation(summary = "Crea una preferencia de pago", description = "Genera un link de pago en Mercado Pago")
    @PostMapping("/create")
    public ResponseEntity<String> createPayment(@RequestBody PaymentRequestDTO request) {
        // Devuelve la URL de pago (sandbox_init_point)
        String url = paymentService.createPreference(request);
        return ResponseEntity.ok(url);
    }
    
    @Operation(summary = "Recibe notificaciones de MP", description = "Webhook que MP llama cuando el estado del pago cambia")
    @PostMapping("/webhook")
    public ResponseEntity<Void> receiveWebhook(@RequestParam("id") String id, @RequestParam("topic") String topic) {
        System.out.println("Notificación recibida -> Topic: " + topic + " | ID: " + id);
        return ResponseEntity.ok().build(); // Responder 200 OK es obligatorio para MP
    }
}