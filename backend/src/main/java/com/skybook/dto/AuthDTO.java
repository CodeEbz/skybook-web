package com.skybook.dto;

public class AuthDTO {

    public static class LoginRequest {
        private String email;
        private String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phoneNumber;
        private String address;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }

    public static class AuthResponse {
        private String token;
        private String role;
        private String name;
        private int id;

        public AuthResponse(String token, String role, String name, int id) {
            this.token = token;
            this.role = role;
            this.name = name;
            this.id = id;
        }

        public String getToken() { return token; }
        public String getRole() { return role; }
        public String getName() { return name; }
        public int getId() { return id; }
    }
}
