# ADR-001: APIM Subscription Management Service

## Context

Organizations using Azure API Management (APIM) need programmatic control over subscription lifecycle — creating subscriptions, assigning API products, and enforcing security policies such as periodic key rotation. Currently, these operations are performed manually through the Azure Portal or ad-hoc scripts, which does not scale and introduces security risks when subscription keys are not rotated regularly.

This PoC builds a backend API service that wraps Azure APIM management operations, providing a structured, secure, and auditable interface for subscription management with enforced 90-day key rotation policy.

## Decision Drivers

- Need for automated subscription lifecycle management (create, read, update, rotate, delete)
- Security requirement: subscription keys must be rotated every 90 days
- Admin oversight: ability to list, filter, sort, and paginate all subscriptions
- Integration with existing Microsoft identity infrastructure (Entra ID)
- PoC must be self-contained and demonstrable without requiring a live Azure APIM instance

## Decision

Build an ASP.NET Web API (.NET 8, C#) that:

1. **Wraps Azure APIM subscription operations** using the `Azure.ResourceManager.ApiManagement` SDK as the primary integration approach
2. **Enforces 90-day key rotation** via a dual-key rotation strategy with zero-downtime cutover
3. **Provides admin endpoints** with filtering, sorting, and pagination for subscription oversight
4. **Separates inbound and outbound authentication** (see Authentication section)

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                   API Controllers                    │
│         (Subscriptions, Admin, Products)             │
├─────────────────────────────────────────────────────┤
│                Application Services                  │
│   (SubscriptionService, RotationService, etc.)       │
├─────────────────────────────────────────────────────┤
│                   Domain Layer                       │
│     (Subscription, RotationPolicy, Product)          │
├─────────────────────────────────────────────────────┤
│                 Infrastructure                       │
│   (APIM SDK Client, In-Memory Store, Auth)           │
└─────────────────────────────────────────────────────┘
```

**Layers:**

- **API Controllers** — HTTP endpoints, request validation, response mapping
- **Application Services** — business logic orchestration, rotation scheduling
- **Domain** — entities, value objects, rotation policy rules
- **Infrastructure** — Azure APIM SDK wrapper, in-memory persistence, authentication providers

### API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/subscriptions` | Create a new subscription | User |
| GET | `/api/subscriptions` | List user's subscriptions (filtered, sorted, paginated) | User |
| GET | `/api/subscriptions/{id}` | Get subscription details | User |
| DELETE | `/api/subscriptions/{id}` | Cancel a subscription | User |
| POST | `/api/subscriptions/{id}/rotate` | Trigger manual key rotation | User |
| PUT | `/api/subscriptions/{id}/products` | Replace product assignments for a subscription | User |
| GET | `/api/admin/subscriptions` | List all subscriptions with advanced filtering/sorting/pagination | Admin |
| GET | `/api/admin/subscriptions/rotation-status` | List subscriptions approaching or overdue rotation | Admin |

**Product management semantics:** `PUT /api/subscriptions/{id}/products` performs a full replacement of assigned products. The request body contains the complete list of desired product IDs.

### Authentication

Authentication is split into two distinct concerns:

**Inbound (caller → this API):**
- Microsoft Entra ID JWT bearer token validation via `Microsoft.Identity.Web`
- Role-based access control (RBAC) with two roles: `Admin` and `User`
- Users can manage their own subscriptions; Admins can manage all subscriptions

**Outbound (this API → Azure APIM):**
- Service-to-service authentication using client credentials (app registration)
- `Azure.Identity` with `ClientSecretCredential` or `DefaultAzureCredential`
- PoC uses mock APIM service; real credentials not required

### Key Rotation Strategy

APIM subscriptions have two keys (primary and secondary). The rotation strategy ensures zero-downtime for API consumers:

1. **Day 0:** Subscription created — primary key is active, secondary key is standby
2. **Day 85:** Rotation warning — admin endpoint flags subscription as "approaching rotation"
3. **Day 90:** Rotation triggered (manual or automatic):
   - Regenerate the **secondary** key
   - Mark secondary as the new active key (notify consumers of cutover window)
   - After cutover window, regenerate the **primary** key
4. **Rotation metadata** tracks: `lastRotatedAt`, `activeKey` (primary/secondary), `rotationDueAt`

**PoC scope:** Rotation is triggered manually via the `/rotate` endpoint. Automatic background rotation (e.g., via `IHostedService`) is documented as a target-architecture concern but not implemented in the PoC. Rotation metadata is stored in-memory.

### Data Persistence

- **PoC:** In-memory store (`ConcurrentDictionary`) for subscription metadata, rotation state, and product assignments. Data is lost on restart — acceptable for demonstration purposes.
- **Target architecture:** Persistent store (e.g., Azure SQL, Cosmos DB) with durable rotation scheduling.

### Error Handling

- Retry with exponential backoff for transient APIM SDK failures
- Structured error responses with correlation IDs
- Audit logging for all mutation operations (create, rotate, delete, product changes)
- Graceful handling of APIM-specific errors (RBAC denied, throttling, eventual consistency)

## Alternatives Considered

1. **Direct Azure Portal / CLI management** — Does not scale, no audit trail, no automated rotation enforcement. Rejected.
2. **Azure Functions with timer triggers** — Simpler for rotation scheduling, but less suitable for a full CRUD API with admin panel. Could complement this service in production.
3. **Terraform / Bicep for subscription management** — Infrastructure-as-code approach. Good for provisioning, but not for runtime subscription lifecycle management with user-facing API.

## PoC Boundaries

### In scope (PoC)

- ASP.NET Web API with all endpoints listed above
- Mock APIM service (in-memory, simulating SDK responses)
- Inbound auth simulation (JWT validation with test tokens or development bypass)
- Manual key rotation via API endpoint
- Unit tests for services, domain logic, and controllers
- Admin listing with filtering/sorting/pagination over in-memory data
- Structured sample data for demonstration

### Out of scope (PoC)

- Real Azure APIM instance and live SDK calls
- Real Microsoft Entra ID tenant and token issuance
- Automatic background rotation (`IHostedService`)
- Persistent database
- Production deployment and CI/CD
- Performance optimization for large-scale subscription listings

### Known limitations

- Admin listing operates over in-memory data — no optimized query model. Production would require a persisted projection/index.
- In-memory store loses rotation state on restart — production needs durable scheduling.
- Mock APIM service simulates happy-path responses; edge cases (throttling, partial failures) are covered in unit tests only.

## Risks

- **APIM SDK gaps:** The SDK may not expose all subscription management operations, requiring fallback to REST API calls for specific features.
- **Entra ID complexity:** Token management and role configuration for Entra ID required fully manual implementation in the original research — expect this to remain a manual step.
- **Rotation edge cases:** Dual-key rotation with consumer notification is complex; PoC simplifies this to manual trigger without consumer notification.

## Assumptions & Open Questions

### Assumptions

- A single APIM instance is managed by this service
- Subscription ownership is determined by the Entra ID user identity (object ID) in the JWT token
- Products are pre-configured in APIM; this service assigns existing products to subscriptions but does not create/manage products themselves
- PoC demonstrates the API contract and business logic; Azure infrastructure is configured manually if needed

### Open Questions

- Should the rotation warning threshold (5 days before due date) be configurable?
- Should the API support bulk operations (e.g., rotate all overdue subscriptions at once)?
- What is the cutover window duration for key rotation in production?

## Consequences

### Positive

- Clean, testable API with clear separation of concerns
- Enforced rotation policy reduces security risk
- Admin visibility into subscription state and rotation compliance
- Mock-based PoC is fully demonstrable without Azure dependencies
- Architecture is designed for production evolution (swap mock → real SDK, add persistence)

### Negative

- In-memory store limits realistic rotation demonstration
- Mock APIM service may not capture all real-world SDK behaviors
- Two authentication concerns (inbound + outbound) add complexity even in PoC

## LLM Applicability

Based on research findings from the original Case 3 evaluation:

**Suitable for LLM generation:**
- API controllers, request/response models
- Application services and business logic
- Domain entities and rotation policy rules
- Unit tests with mocks
- Mock APIM service implementation
- Sample/seed data generation

**Requires manual implementation or validation:**
- Azure APIM product configuration and SDK edge cases
- Entra ID token management and role configuration
- Infrastructure provisioning (Azure resources, app registrations)
- Integration testing against real APIM instance

**Known LLM failure modes to watch for:**
- May ignore explicit requirements (e.g., admin listing was missed in original research)
- May use outdated SDK APIs — verify against current `Azure.ResourceManager.ApiManagement` documentation
- Infrastructure scripts generated by LLM are unreliable — do not use for production Azure configuration
