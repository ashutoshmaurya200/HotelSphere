package com.hotel.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PaymentRequestDTO {

	   @NotNull
	    private Long bookingId;

	    @Positive
	    private BigDecimal amount;

	    @NotBlank
	    private String paymentMethod;
	    
	    private String transactionId;
}
