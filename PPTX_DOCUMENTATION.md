# OnePacificHub Authentication System: Slide-by-Slide Documentation

This document converts the presentation `OnePacificHub_Authentication_System_Supabase_Integration.pptx` into written documentation.

Note: some slides in the deck appear to be code screenshots. Where slide text was not extractable from the `.pptx`, the explanation below is inferred from the slide title and surrounding slides.

## Slide 1: Presentation Deck

**Slide Content**

- OnePacificHub Authentication System
- Supabase Integration
- A clear walkthrough of how login, registration, OAuth, session handling, and password reset are implemented in the website
- Frontend UI to Supabase Auth flow
- Supabase dashboard configuration
- Actual code integration points in the project
- Login and registration
- OAuth providers
- Password reset with OTP
- Supabase dashboard setup and code flow

**Explanation**

This opening slide defines the scope of the deck. It explains that the presentation is focused specifically on authentication, showing how the frontend, Supabase Auth, OAuth providers, session management, and password recovery work together in the OnePacificHub website.

## Slide 2: What Supabase Does Here

**Slide Content**

- Supabase is the auth layer, not the full application backend
- Handles login and signup
- Manages sessions and token refresh
- Supports Google and Facebook OAuth
- Supports password reset through Edge Functions

**Explanation**

This slide clarifies the system boundary. Supabase is currently responsible for authentication-related concerns only, which means it handles identity, sessions, and recovery flows, while the rest of the application data and non-auth business logic are still outside that integration.

## Slide 3: Supabase Client Code

**Slide Content**

- Core browser client setup

**Explanation**

This slide likely shows the base Supabase client initialization file. Its role is to create a reusable browser-side client using the project URL and anon key, then expose that client to the rest of the app so auth and database calls can be made consistently.

## Slide 4: Sign In Page

**Slide Content**

- Email/password login plus social login entry point
- Users can log in with email and password
- The same screen also exposes Google and Facebook login
- Successful login creates a Supabase session

**Explanation**

This slide describes the primary login UI. It shows that users can authenticate either with standard credentials or with social providers, and once Supabase confirms the login, the application receives a valid session and can treat the user as authenticated.

## Slide 5: Sign In Code

**Slide Content**

- Email/password authentication logic

**Explanation**

This slide most likely contains the code that submits email and password to Supabase Auth. It is the implementation detail behind the sign-in page, including form submission, error handling, and session creation after a successful response.

## Slide 6: Sign Up Page

**Slide Content**

- User registration form connected directly to Supabase Auth
- The form collects first name, last name, email, and password
- The signup request is sent to Supabase Auth
- Verification can be required before first login

**Explanation**

This slide documents the registration screen and its required fields. It shows that the app sends new-user information directly to Supabase Auth and may enforce email verification before allowing the account to be used.

## Slide 7: Sign Up Code (1/3)

**Slide Content**

- Account creation and verification flow

**Explanation**

This slide likely introduces the first part of the signup implementation. It probably covers form handling and the first step of passing collected user data into the authentication service.

## Slide 8: Sign Up Code (2/3)

**Slide Content**

- Account creation and verification flow

**Explanation**

This slide likely continues the signup logic, such as preparing metadata, calling Supabase's signup method, or configuring redirect behavior for post-verification flows.

## Slide 9: Sign Up Code (3/3)

**Slide Content**

- Account creation and verification flow

**Explanation**

This final signup code slide likely handles the result of registration. That usually includes showing success messages, instructing the user to verify their email, or gracefully reporting errors such as duplicate accounts or weak passwords.

## Slide 10: OAuth Login

**Slide Content**

- Social authentication through Supabase providers
- Google and Facebook buttons are available in the login UI
- Supabase handles the provider redirect and callback
- OAuth returns the user to the app with a valid session

**Explanation**

This slide explains the social login path. Instead of directly validating credentials in the form, the app starts an OAuth redirect, lets the provider authenticate the user, and then relies on Supabase to return the user back to the app with an established session.

## Slide 11: OAuth Code (1/2)

**Slide Content**

- Google and Facebook login logic

**Explanation**

This slide likely contains the function that starts OAuth sign-in for one or more providers. It probably calls a Supabase helper and passes the correct provider name plus any redirect configuration needed by the application.

## Slide 12: OAuth Code (2/2)

**Slide Content**

- Google and Facebook login logic

**Explanation**

This slide likely shows the rest of the provider-based login implementation. That may include provider-specific branching, callback handling, and error reporting when the redirect or token exchange fails.

## Slide 13: Forgot Password

**Slide Content**

- Password reset starts by requesting a one-time code
- The user enters an email address to start recovery
- The app does not use the default magic-link reset flow
- It calls a custom Edge Function to send an OTP

**Explanation**

This slide introduces a customized password recovery process. Instead of relying on the default email-link flow, the application uses a more controlled OTP-based reset sequence powered by Supabase Edge Functions.

## Slide 14: Forgot Password Code (1/2)

**Slide Content**

- Reset code request through Edge Functions

**Explanation**

This slide likely shows the client-side request that starts password recovery. The frontend probably passes the user's email to a custom function that generates and emails the one-time reset code.

## Slide 15: Forgot Password Code (2/2)

**Slide Content**

- Reset code request through Edge Functions

**Explanation**

This slide likely continues the recovery-request implementation, covering success and failure responses. It probably shows how the user is notified that the OTP was sent and how errors are surfaced when the request cannot be completed.

## Slide 16: OTP Verification

**Slide Content**

- The reset flow continues with a six-digit code
- The user enters the one-time code sent by email
- The backend validates the OTP and returns a short-lived reset token
- That token is then used to set the new password

**Explanation**

This slide shows the second phase of password recovery. The OTP itself is not enough to directly change the password; it must first be verified by the backend, which then issues a short-lived token that authorizes the final reset step.

## Slide 17: OTP Verification Code (1/2)

**Slide Content**

- OTP validation and reset token handling

**Explanation**

This slide likely contains the code that sends the entered OTP to the backend for validation. Its purpose is to obtain the temporary reset token needed to proceed securely to the password update step.

## Slide 18: OTP Verification Code (2/2)

**Slide Content**

- OTP validation and reset token handling

**Explanation**

This slide likely shows the rest of the verification flow, such as storing the reset token briefly in client state, transitioning to the new-password form, and handling expired or invalid codes.

## Slide 19: Email Received

**Slide Content**

- The code is delivered to the user outside the app UI
- The email contains the verification code used in the reset flow
- The code expires after a limited time window
- This keeps recovery time-bound and more secure

**Explanation**

This slide documents the recovery email itself. Its main purpose is to show that the reset code is sent through email, is time-limited, and forms part of a controlled verification process rather than an open-ended reset link.

## Slide 20: Logged-in Account Page

**Slide Content**

- Protected pages become available after authentication succeeds
- After login, the user is redirected to the account dashboard
- The route is protected by authentication state
- Session changes are monitored through AuthContext

**Explanation**

This slide shows the user-visible result of successful authentication. Once a valid session exists, the app redirects the user to a protected account area and uses shared auth state to keep that route guarded.

## Slide 21: Session Code (1/2)

**Slide Content**

- AuthContext session subscription and sync

**Explanation**

This slide likely contains the beginning of the session-management code. It probably subscribes to Supabase auth state changes so the React application can respond whenever a user signs in, signs out, or refreshes a session.

## Slide 22: Session Code (2/2)

**Slide Content**

- AuthContext session subscription and sync

**Explanation**

This slide likely completes the context logic by updating app state from the session and making that state available to protected routes and account-related components.

## Slide 23: Supabase Users

**Slide Content**

- Registered users are stored in Supabase Authentication
- The dashboard stores each user record in Supabase Auth
- Key details include email, provider, and user ID
- Custom metadata such as first and last name can also be attached

**Explanation**

This slide explains where user identity data lives after signup or OAuth login. Supabase Auth stores the core user record, while custom profile-related values can be attached as metadata to support app-specific display or workflow needs.

## Slide 24: Auth Providers

**Slide Content**

- Enabled providers determine which login methods can be used
- Email login is configured in Supabase
- Google and Facebook can be enabled as OAuth providers
- Only enabled providers should be exposed in the UI

**Explanation**

This slide connects frontend behavior with dashboard configuration. Social buttons in the UI should match the providers actually enabled in Supabase so that the application does not offer authentication methods that are not configured to work.

## Slide 25: Provider Button Code (1/2)

**Slide Content**

- Frontend buttons for social login

**Explanation**

This slide likely shows the visual button components and their event handlers. It probably maps button clicks to the correct Google or Facebook OAuth start function.

## Slide 26: Provider Button Code (2/2)

**Slide Content**

- Frontend buttons for social login

**Explanation**

This slide likely continues the UI integration details for provider buttons. That may include styling, conditional rendering, or shared button logic used to avoid duplicating code between providers.

## Slide 27: URL Configuration

**Slide Content**

- Redirect URLs connect the dashboard settings to the frontend callback route
- Supabase needs approved redirect URLs for OAuth and email flows
- The site origin is built from environment variables
- This must match the AuthCallback route used by the app

**Explanation**

This slide documents one of the most important integration details: redirect URL alignment. If the frontend callback route and the allowed URLs in Supabase do not match exactly, login and recovery flows can fail even if the rest of the implementation is correct.

## Slide 28: URL Callback Code (1/3)

**Slide Content**

- Redirect helpers and callback exchange

**Explanation**

This slide likely shows helper logic for constructing callback URLs and centralizing redirect settings. That helps keep the login, signup, and OAuth flows consistent across environments.

## Slide 29: URL Callback Code (2/3)

**Slide Content**

- Redirect helpers and callback exchange

**Explanation**

This slide likely shows the callback page logic that receives the return from Supabase or an OAuth provider. It probably exchanges temporary auth data for a session and then redirects the user into the authenticated area of the app.

## Slide 30: URL Callback Code (3/3)

**Slide Content**

- Redirect helpers and callback exchange

**Explanation**

This slide likely finishes the callback flow with error handling and cleanup. It may also contain navigation logic for sending the user to the correct route once session establishment has completed.

## Slide 31: Edge Functions

**Slide Content**

- Custom backend logic is used for the password reset flow
- The app expects custom functions named `send-reset-otp`, `verify-reset-otp`, and `reset-password`
- Those functions run behind Supabase Functions
- They extend Supabase Auth with custom OTP-based recovery

**Explanation**

This slide shows how the project extends built-in authentication behavior. Rather than handling password recovery entirely through default auth features, it adds custom server-side functions to support a tailored OTP reset process.

## Slide 32: Edge Function Client Code (1/4)

**Slide Content**

- Frontend calls to Supabase Functions

**Explanation**

This slide likely introduces the client helper used to invoke the first reset-related Edge Function. It probably wraps the function call so page components can trigger recovery without embedding low-level API code directly.

## Slide 33: Edge Function Client Code (2/4)

**Slide Content**

- Frontend calls to Supabase Functions

**Explanation**

This slide likely shows another function invocation, such as OTP verification. The frontend probably submits the code and receives either a reset token or an error that tells the user the code is invalid or expired.

## Slide 34: Edge Function Client Code (3/4)

**Slide Content**

- Frontend calls to Supabase Functions

**Explanation**

This slide likely covers the final reset action, where the short-lived reset token and the new password are sent to the backend. This keeps the password change protected behind a validated recovery workflow.

## Slide 35: Edge Function Client Code (4/4)

**Slide Content**

- Frontend calls to Supabase Functions

**Explanation**

This slide likely contains remaining service helpers, shared error handling, or utility code used across all password reset function calls. It completes the frontend integration layer for custom recovery behavior.

## Slide 36: Full Auth Flow

**Slide Content**

- Frontend to Supabase session lifecycle
- User
- Login UI
- Auth Service
- Supabase
- Session
- Protected Page
- User interacts with login, signup, OAuth, or reset screens
- Service layer calls Supabase Auth or Edge Functions
- Supabase returns a session that the app uses to protect routes
- User -> LoginPage/RegisterPage -> supabaseAuthService -> Supabase Auth / Edge Functions -> session token -> AuthContext + ProtectedRoute -> Account page

**Explanation**

This slide summarizes the entire authentication lifecycle from the user's action to route protection. It shows the architectural separation between UI pages, service methods, Supabase-managed auth, and context-based session handling in the React app.

## Slide 37: Code Integration

**Slide Content**

- Three files that connect the whole auth stack
- `supabase.js`: initializes the browser client, reads Supabase URL and anon key from environment variables, configures auth persistence and session handling
- `AuthContext.jsx`: watches auth state changes, stores the logged-in user in React state, protects routes and syncs session data
- `supabaseAuthService.js`: wraps login, signup, OAuth, logout, and session checks, keeps Supabase calls out of page components, returns simplified user/session objects to the app
- The client connects to Supabase, the service performs authentication requests, and AuthContext keeps the session active across the website

**Explanation**

This slide is the key implementation overview for the codebase. It identifies the three main files that make the auth system work and explains their responsibilities so the authentication logic stays modular instead of being spread across page components.

## Slide 38: Integration Code Detail (1/6)

**Slide Content**

- The three main files behind the auth system

**Explanation**

This slide likely begins the detailed code walkthrough for `supabase.js`, `AuthContext.jsx`, or `supabaseAuthService.js`. It probably focuses on how the client is initialized or how the service layer is structured.

## Slide 39: Integration Code Detail (2/6)

**Slide Content**

- The three main files behind the auth system

**Explanation**

This slide likely continues the breakdown by showing an important method or state-management block. It probably demonstrates how auth methods are exposed to the rest of the frontend.

## Slide 40: Integration Code Detail (3/6)

**Slide Content**

- The three main files behind the auth system

**Explanation**

This slide likely covers route protection or session subscription logic. Its purpose is to show how the app stays aware of the current user and reacts when that state changes.

## Slide 41: Integration Code Detail (4/6)

**Slide Content**

- The three main files behind the auth system

**Explanation**

This slide likely shifts to service-layer methods such as login, signup, or logout. It helps show that page components can remain simple while the auth service encapsulates direct Supabase interactions.

## Slide 42: Integration Code Detail (5/6)

**Slide Content**

- The three main files behind the auth system

**Explanation**

This slide likely shows additional service helpers or utility transformations. That may include returning normalized user objects or handling auth-related errors consistently across the app.

## Slide 43: Integration Code Detail (6/6)

**Slide Content**

- The three main files behind the auth system

**Explanation**

This slide likely concludes the implementation walkthrough and reinforces how the client, service, and context layers fit together to support a clean authentication architecture.

## Slide 44: Current Limitation

**Slide Content**

- Supabase is used for authentication only in the current frontend
- Login, signup, OAuth, session handling, and reset flow are on Supabase
- Profile update and password-change helpers still call a mock local-storage service
- Products, cart, and broader app data are not being queried from Supabase here
- So the current setup is production-style auth, but not yet a full Supabase backend

**Explanation**

This slide documents an important architectural limitation. Authentication is production-oriented and integrated with Supabase, but the rest of the application still relies on mock or local data patterns, so the project has not yet fully migrated its backend concerns.

## Slide 45: Limitation Code Detail (1/4)

**Slide Content**

- Mock/local service still used outside auth

**Explanation**

This slide likely points to a file or method that still uses local storage or a mock service. It provides evidence that not all account-related or domain-related operations have been moved to Supabase yet.

## Slide 46: Limitation Code Detail (2/4)

**Slide Content**

- Mock/local service still used outside auth

**Explanation**

This slide likely continues the limitation walkthrough by showing another location where application logic remains disconnected from Supabase-backed persistence.

## Slide 47: Limitation Code Detail (3/4)

**Slide Content**

- Mock/local service still used outside auth

**Explanation**

This slide likely highlights additional code paths that still depend on non-production storage. It helps document what remains to be migrated if the project moves toward a full Supabase backend.

## Slide 48: Limitation Code Detail (4/4)

**Slide Content**

- Mock/local service still used outside auth

**Explanation**

This final limitation detail slide likely closes the gap analysis and supports the conclusion that authentication is integrated, but broader data management is not yet consolidated.

## Slide 49: Conclusion

**Slide Content**

- Secure authentication is delegated to Supabase
- Frontend stays focused on UX and route protection
- OAuth and password reset are already integrated
- UI pages collect input
- Services call Supabase APIs
- AuthContext stores the active user session
- Move profile and app data to Supabase if full backend consolidation is desired
- Add database tables and replace mock services
- Supabase simplifies authentication by handling login, sessions, and security, allowing the frontend to focus on user experience and route protection

**Explanation**

This closing slide summarizes the overall value of the integration. The current setup already provides a strong authentication foundation, and the natural next step is to move the remaining profile and application data away from mock services and into Supabase-managed storage.
