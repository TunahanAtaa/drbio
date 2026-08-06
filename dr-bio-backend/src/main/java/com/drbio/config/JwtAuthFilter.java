package com.drbio.config;

import com.drbio.domain.user.dto.SecurityUser;
import com.drbio.domain.user.entity.Role;
import com.drbio.domain.user.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            if (jwtService.isTokenValid(jwt) && SecurityContextHolder.getContext().getAuthentication() == null) {
                String email = jwtService.extractEmail(jwt);
                String userIdStr = jwtService.extractUserId(jwt);
                String roleStr = jwtService.extractRole(jwt);
                
                Role role = Role.valueOf(roleStr);
                
                SecurityUser securityUser = SecurityUser.builder()
                        .id(UUID.fromString(userIdStr))
                        .email(email)
                        .role(role)
                        .build();

                // prefix ROLE_ is required for hasRole() in Spring Security
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.name());

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        securityUser,
                        null,
                        Collections.singletonList(authority)
                );
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            // Token is invalid, expired or tampered. 
            // SecurityContext won't be set, and the request will hit the 401 response if endpoint is secured.
        }

        filterChain.doFilter(request, response);
    }
}
