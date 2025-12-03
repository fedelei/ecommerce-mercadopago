🚀 Pasarela de Pago Modular: Integración E-commerce (ReactJS + Spring Boot + Mercado Pago)

📝 Descripción del Proyecto
Este proyecto es una aplicación de demostración modular que simula un flujo completo de e-commerce, desde la selección de productos hasta la iniciación del pago en una pasarela externa.

El objetivo principal de esta implementación Full Stack fue demostrar la capacidad de integrar servicios de pago complejos (PSP) como Mercado Pago, manteniendo una separación limpia de responsabilidades entre el frontend y el backend, garantizando la seguridad de las credenciales sensibles.

📦 Funcionalidades Demostradas
-Listado de productos dinámico obtenido de la API Fake Store.

-Funcionalidad completa de Añadir/Eliminar/Modificar cantidad en el carrito (gestión de estado con Context API de React).

-Inicio de la transacción de pago con Mercado Pago al hacer clic en "Comprar".

-Manejo de la redirección a las vistas de éxito, pendiente y fallo.


| Componente | Tecnología | Responsabilidad Principal |
| :--- | :--- | :--- |
| **Frontend (UX/UI)** | **ReactJS** (Hooks & Context API), **SweetAlert2**, **HTML/CSS (Bootstrap 5)** | Gestión del estado del carrito, consumo de la API pública de productos (Fake Store API), presentación de la interfaz Dark Mode, y orquestación de la llamada de checkout. |
| **Backend (API)** | **Spring Boot 3** (Java), **Mercado Pago SDK**, **RESTful Services** | Actuar como servidor seguro para el manejo de credenciales (Access Token), creación de la Preferencia de Pago (PreferenceRequest), y devolución del init_point (URL de pago). |
| **Integración de Pagos**| **Mercado Pago** (Modo Sandbox) | Procesamiento de la transacción simulada y gestión de las URLs de Retorno (back_urls) para dirigir al usuario a las páginas /success, /pending, o /failure. |

✨ Desafíos Resueltos

Arquitectura Desacoplada: Se implementó una arquitectura limpia donde el Frontend solo se comunica con el Backend de Spring Boot, asegurando que las credenciales secretas de Mercado Pago permanezcan seguras en el servidor.

Manejo de back_urls: Se resolvió el conflicto de la API de Mercado Pago al rechazar localhost en las URLs de retorno, utilizando la herramienta Ngrok para exponer el servidor de prueba de forma segura y pública durante el desarrollo.

Flujo de Datos Eficiente: El Frontend agrupa los ítems del carrito y envía el Total de la Compra como un único DTO de pago al backend de Java para la creación de la preferencia, simplificando la lógica del servicio.

Experiencia de Usuario (UX): Se mejoró la interfaz con la implementación de estilos Dark Mode y un feedback visual no intrusivo (sin alert()s) al agregar productos al carrito.

Debugging Avanzado: Se utilizaron técnicas de debugging de consola y Network para aislar y resolver errores específicos de la API de Mercado Pago (invalid_auto_return), demostrando la capacidad de trabajar con errores de servicios de terceros.
