package com.hotel.entity;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Generates Getters, Setters (including setRole), etc.
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails { 

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;

	private String fullName;

	@Column(unique = true, nullable = false)
	private String email;

	private String phone;
	private String passwordHash;
	private String role; // e.g., "ADMIN" or "USER"

	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	
	
	
	private String secretQuestion; // e.g., "What is your pet's name?"
	private String secretAnswer;   // e.g., "Tommy"

	@OneToMany(mappedBy = "user")
	@JsonIgnore
	private List<Booking> bookings;

	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// This converts your String "ADMIN" into a real Authority
		String roleName = role.startsWith("ROLE_") ? role : "ROLE_" + role;
		return List.of(new SimpleGrantedAuthority(roleName));
	}

	@Override
	public String getUsername() {
		return email; // Use email as the username
	}

	@Override
	public String getPassword() {
		return passwordHash; // Point to your password field
	}

	// Standard defaults 
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	// Optional: Auto-set dates
	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}