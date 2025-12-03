import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import Swal from 'sweetalert2'
import '../styles/CartPage.css'

// 🚨 IMPORTANTE: Asegúrate de que esta URL base sea accesible (tu localhost con Ngrok activo, si es necesario)
const API_BASE_URL = 'http://localhost:8080/api'; 

export const CartPage = () => {
  const { shoppingList, removeProduct, incrementQuantity, decrementQuantity, clearCart } = useContext(CartContext)

  const calculateTotal = () => {
    // Usamos parseFloat para evitar problemas con toFixed en el cálculo interno
    return shoppingList.reduce((total, product) => total + parseFloat(product.price) * product.quantity, 0).toFixed(2)
  }

  const handlerPurchase = async () => {
    if (shoppingList.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Carrito vacío',
        text: 'Agrega productos antes de comprar.',
        confirmButtonText: 'Cerrar',
      });
      return;
    }

    // 1. Crear el objeto de Request para Spring Boot
    // Recordatorio: Tu API solo espera un ítem que resuma el carrito
    const totalAmount = parseFloat(calculateTotal());

    const paymentRequest = {
      title: "Compra de Carrito ReactJS",
      quantity: 1, // El carrito completo como un ítem
      price: totalAmount // El total a pagar
    };

    // Desactivar el botón y mostrar loading
    Swal.fire({
        title: 'Preparando pago...',
        text: 'Contactando con Mercado Pago...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });

    try {
      // 2. Llamada al Backend de Spring Boot
      const response = await fetch(`${API_BASE_URL}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentRequest)
      });

      const paymentUrl = await response.text();

      if (response.ok && paymentUrl.startsWith('http')) {
        Swal.close();
        
        // 3. Redirigir a Mercado Pago
        // Opcional: Limpiar el carrito después de redirigir (asumimos éxito al generar el link)
        if (clearCart) {
            clearCart(); 
        }

        window.location.href = paymentUrl;

      } else {
        // Manejo de errores del backend (ej. token expirado, error 500)
        Swal.fire({
            icon: 'error',
            title: 'Error de Pago',
            html: `No se pudo generar el link de Mercado Pago.<br/>Detalle: ${paymentUrl.trim()}`,
            confirmButtonText: 'Cerrar',
            background: '#1a1a1a',
            color: '#f2f2f2'
        });
      }
    } catch (error) {
      // Manejo de errores de conexión de red
      Swal.fire({
        icon: 'error',
        title: 'Error de Conexión',
        text: 'No se pudo conectar con el servidor de Spring Boot.',
        confirmButtonText: 'Cerrar',
        background: '#1a1a1a',
        color: '#f2f2f2'
      });
    }
  }

  return (
    <div className="cart-container dark-theme">
      {shoppingList.length === 0 ? (
        <p className="empty-cart">Tu carrito está vacío 🛒</p>
      ) : (
        <>
          <div className="cart-list">
            {shoppingList.map(product => (
              <div className="cart-item" key={product.id}>
                {/* ... (El resto del JSX para el listado de ítems permanece igual) ... */}
                <div className="cart-info">
                  <h5>{product.title}</h5>
                  <p className="price">${product.price}</p>
                </div>

                <div className="cart-actions">
                  <div className="quantity-controls">
                    <button onClick={() => decrementQuantity(product.id)}>-</button>
                    <span>{product.quantity}</span>
                    <button onClick={() => incrementQuantity(product.id)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeProduct(product.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h4>Total: ${calculateTotal()}</h4>
            {/* 🚨 LLAMA A LA NUEVA FUNCIÓN ASÍNCRONA 🚨 */}
            <button className="buy-btn" onClick={handlerPurchase}>
              Comprar
            </button>
          </div>
        </>
      )}
    </div>
  )
}