# GPON Project - Huawei

A platform for managing a GPON (fiber-to-the-home) network: the equipment along each fiber chain (OLTs, boards,
boxes and ONTs), the clients connected to it, and the staff who operate it, all shown on an interactive map.

The backend is a set of Spring Boot microservices behind a Spring Cloud Gateway, with Eureka for service discovery and
Huawei **openGauss** as the database. The frontend is an Angular app with OpenLayers maps.

## Architecture

```
                 Angular frontend (:4200)
                          │
                          ▼
              Spring Cloud Gateway (:8080)
               │                       │
   /gpon/user/**                /gpon/equipment/**
               ▼                       ▼
   User_MicroService (:8089)   GPON_Equipment_MicroService (:8090)
               │                       │
               └────── openGauss ──────┘

          Eureka_Server (:8069): service registry
```

| Service | Port | Responsibility |
|---------|------|----------------|
| `Eureka_Server` | 8069 | Service discovery |
| `Gateway` | 8080 | Single entry point, routes `/gpon/user/**` and `/gpon/equipment/**` |
| `User_MicroService` | 8089 | Sign-up and sign-in (JWT, phone number + password), users, roles, plans, addresses, complaints, reverse geocoding (LocationIQ) |
| `GPON_Equipment_MicroService` | 8090 | OLTs, boards, boxes (sub-boxes and end boxes, linked into chains) and ONTs |
| `DTOs` | – | Shared data classes (Board, Client, ODN, OLT, ONT, User) |

## Features

- **Network inventory**: create and manage OLTs, the boards in their slots, the chain of boxes along the fiber
  (each box knows the previous and next one), and the ONTs installed at clients.
- **Status tracking**: filter equipment by status, type, address, OLT, board or box.
- **Map**: an OpenLayers map shows the equipment by location, with layer controls for equipment types and
  administrative areas (delegations).
- **Dashboard**: Chart.js charts and the number of new users, compared with the day before.
- **Accounts**: JWT authentication with sign-in by phone number, a separate client sign-in, and profile pages.
- **Addresses**: coordinates picked on the map are turned into street addresses with LocationIQ.

## Tech stack

| Layer | Technologies |
|-------|--------------|
| Backend | Java 24, Spring Boot 3.5, Spring Cloud 2025.0 (Gateway, Netflix Eureka), Spring Security, Spring Data JPA, JJWT |
| Database | openGauss (Huawei's PostgreSQL-based database) |
| Frontend | Angular 20, OpenLayers, Chart.js, Swiper |

## REST API

All endpoints go through the gateway at `http://localhost:8080`.

| Base path | Endpoints |
|-----------|-----------|
| `/gpon/user/api/auth` | `signup`, `signin`, `signin-client`, `logout`, `check-auth` |
| `/gpon/user/api/address` | `save`, `reverse-geo-code/{lat}/{lng}`, `{id}` |
| `/gpon/equipment/api/olt` | `save`, `all`, `{id}`, `status/{status}`, `address/{addressId}`, `update/{id}`, `delete/{id}` |
| `/gpon/equipment/api/board` | `save`, `all`, `{id}`, `olt/{oltId}`, `olt/{oltId}/slot/{slotNumber}`, `status/{status}`, `update/{id}`, `delete/{id}` |
| `/gpon/equipment/api/box` | `save`, `all`, `{id}`, `type/{type}`, `status/{status}`, `olt/{oltId}`, `board/{boardId}`, `previous/{id}`, `next/{id}`, `{id}/connect-to-next/{nextBoxId}`, `update/{id}`, `delete/{id}` |
| `/gpon/equipment/api/ont` | `save`, `all`, `{id}`, `status/{status}`, `client/{clientId}`, `box/{boxId}`, `board/{boardId}`, `olt/{oltId}`, `update/{id}`, `delete/{id}` |

## Getting started

### Requirements

- JDK 24 and Maven (or use the `mvnw` wrapper included in each service)
- Node.js 20+ and the Angular CLI (`npm install -g @angular/cli`)
- An openGauss database

### 1. Configure the database

`User_MicroService` and `GPON_Equipment_MicroService` read their database settings from
`src/main/resources/application.properties`. Point `spring.datasource.url`, `username` and `password` at your
openGauss instance. Tables are created automatically (`spring.jpa.hibernate.ddl-auto=update`).

`User_MicroService` also needs `app.jwtSecret` and a [LocationIQ](https://locationiq.com) key in
`locationiq.api.key`.

### 2. Start the backend

Start the services in this order, each in its own terminal:

```bash
cd BackEnd/Eureka_Server               && ./mvnw spring-boot:run
cd BackEnd/User_MicroService           && ./mvnw spring-boot:run
cd BackEnd/GPON_Equipment_MicroService && ./mvnw spring-boot:run
cd BackEnd/Gateway                     && ./mvnw spring-boot:run
```

On Windows, use `mvnw.cmd` instead of `./mvnw`. The Eureka dashboard is at http://localhost:8069.

### 3. Start the frontend

```bash
cd FrontEnd
npm install
ng serve
```

Open http://localhost:4200. The API address is set in `FrontEnd/src/environment/environment.ts`.

## Project structure

```
BackEnd/
├── Eureka_Server/
├── Gateway/
├── User_MicroService/
├── GPON_Equipment_MicroService/
└── DTOs/
FrontEnd/
└── src/
    ├── app/        # dashboard, equipment forms, map, user pages
    ├── Core/       # TypeScript models
    └── Services/   # API clients
```

More detail: [BackEnd/README.md](BackEnd/README.md) and [FrontEnd/README.md](FrontEnd/README.md).
