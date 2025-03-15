import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AxiosHook from "../hooks/AxiosInstance";
import { toast } from "react-toastify";
import '../assets/css/CheckoutForm.css';

const CheckoutForm = ({ submitBooking, price }) => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  console.log(price);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const AxiosInstance = AxiosHook();
    const formData = {
      amount: price * 100, // specify your payment amount here
    };

    AxiosInstance.post('/payment', formData)
      .then((response) => {
        const { clientSecret } = response.data;

        // Get individual elements
        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        // Ensure elements are properly initialized
        if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
          console.error("Stripe Elements are not correctly initialized.");
          setLoading(false);
          return;
        }

        // Confirm card payment with Stripe directly using the elements
        stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardNumberElement, // Pass the CardNumberElement
            billing_details: {
              // Optionally add billing details
              name: 'John Doe', // Replace with real customer data if necessary
            },
          },
        })
          .then(({ error, paymentIntent }) => {
            if (error) {
              console.error(error.message);
              setLoading(false);
              toast.error('Payment failed: ' + error.message);
            } else if (paymentIntent.status === 'succeeded') {
              toast.success('Payment successful!');
              submitBooking(paymentIntent.id);
              setLoading(false);
            }
          })
          .catch((err) => {
            console.error('Stripe error:', err);
            setLoading(false);
            toast.error('Payment failed. Please try again.');
          });
      })
      .catch((error) => {
        console.error("Payment error:", error);
        setLoading(false);
        toast.error('Something went wrong. Please try again later.');
      });
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
    <div className="form-field">
      <label htmlFor="card-number">Card Number</label>
      <CardNumberElement id="card-number" className="input-field fs-4 mb-5" />
    </div>
    <div className="form-row">
      <div className="form-field half">
        <label htmlFor="card-expiry">Expiration Date</label>
        <CardExpiryElement id="card-expiry" className="input-field" />
      </div>
      <div className="form-field half">
        <label htmlFor="card-cvc">CVC</label>
        <CardCvcElement id="card-cvc" className="input-field" />
      </div>
    </div>
    <button type="submit" disabled={!stripe || loading} className="submit-button">
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  </form>
  );
};

export default CheckoutForm;
