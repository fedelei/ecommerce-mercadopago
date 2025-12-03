package com.fedelei.payments.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fedelei.payments.dto.PaymentRequestDTO; // Importante para errores de MP
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.resources.preference.Preference;

import jakarta.annotation.PostConstruct;

@Service
public class PaymentService {

    // Asegúrate que esta variable se cargue correctamente desde application.properties
    @Value("${mp.access.token}")
    private String accessToken;

    @PostConstruct
    public void init() {
        // Inicializa el SDK con tu Token antes de que se use el servicio
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    public String createPreference(PaymentRequestDTO paymentRequest) {
        String ngrokUrl = "https://jeni-encephalitic-ismael.ngrok-free.dev";

        // 🛑 DEBUG 1: ¿Está llegando el token?
        if (accessToken == null || accessToken.isBlank()) {
            System.err.println("🚨 ERROR GRAVE: El Access Token es NULL o está vacío.");
            throw new RuntimeException("El token de Mercado Pago no está configurado.");
        }

        // Imprimimos los primeros caracteres del token para verificar que sea el correcto
        System.out.println("🔎 Token usado: " + accessToken.substring(0, 10) + "...");

        try {
            // ... (Tu código de creación de items y urls sigue igual) ...
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .title(paymentRequest.getTitle())
                    .quantity(paymentRequest.getQuantity())
                    .unitPrice(new BigDecimal(paymentRequest.getPrice()))
                    .currencyId("ARS")
                    .build();

            List<PreferenceItemRequest> items = new ArrayList<>();
            items.add(itemRequest);

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .autoReturn("approved")
                    .backUrls(
                            PreferenceBackUrlsRequest.builder()
                                    .success(ngrokUrl + "/index.html")
                                    .pending(ngrokUrl + "/pending.html")
                                    .failure(ngrokUrl + "/failure.html")
                                    .build()
                    )
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            return preference.getSandboxInitPoint();

        } catch (MPApiException apiException) {
            // 🛑 DEBUG 2: Aquí atrapamos el MENSAJE REAL de Mercado Pago
            System.err.println("================ ERRORES DE MERCADO PAGO ================");
            System.err.println("Código HTTP: " + apiException.getApiResponse().getStatusCode());
            System.err.println("Respuesta JSON: " + apiException.getApiResponse().getContent()); // <--- ¡ESTO ES LO QUE BUSCAMOS!
            System.err.println("=========================================================");

            throw new RuntimeException(apiException.getApiResponse().getContent());

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error genérico: " + e.getMessage());
        }
    }
}
