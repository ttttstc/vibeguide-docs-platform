# App Flow Document for VibeGuide AI Documentation Platform

## Onboarding and Sign-In/Sign-Up

When a new visitor arrives at the VibeGuide platform, they land on a welcoming page that briefly explains the AI-powered documentation features and invites them to create an account. From the landing page, a user can click a “Sign Up” button, which brings up the registration form. The form asks for an email address, a password, and confirmation of the password. Upon submitting this information, the user receives a confirmation email. After clicking the confirmation link, they return to the app and complete their profile by providing a display name and optional avatar. Users can also choose to sign up via a supported social account, such as Google, by clicking the corresponding button, granting basic profile permissions, and consenting to the terms.

For returning users, the “Sign In” link on the landing page opens a login form. The user enters their email and password or chooses a social login provider. Submitting valid credentials grants access to the main dashboard. If the user forgets their password, they click a “Forgot Password” link below the login form. This opens a page to enter their email address. The system sends a password reset link. The user clicks that link, sets a new password, and is then redirected back to the login form.

Signing out is always available in the top navigation bar as a “Sign Out” button. Clicking this button ends the session and returns the user to the landing page.

## Main Dashboard or Home Page

Once authenticated, the user lands on the main dashboard. At the top, a header displays the VibeGuide logo on the left and the user’s avatar on the right. Below the header, a welcome message shows the user’s display name. To the left, a collapsible sidebar lists navigation links such as Projects, Documentation Editor, Settings, and Help.

In the central area, the Projects section is displayed by default. It shows a gallery of existing projects, each represented by a card that displays the project title, creation date, and a preview of the latest generated document. Above the gallery is a prominent “Create New Project” button. Clicking this button opens a dialog where the user names their new project and optionally selects a template or category.

The footer of the dashboard provides quick links to the support page and the platform’s terms of service. The user can navigate to other areas by clicking the sidebar links or by selecting a project card to view more details.

## Detailed Feature Flows and Page Transitions

When a user chooses to create a new project, the “Create New Project” dialog prompts for a title and an optional description. After submitting, the dialog closes and the new project appears in the gallery. The user can then click the project card to open the project detail view. This view contains project metadata at the top and two tabs: “Overview” and “Documentation Editor.”

In the Documentation Editor tab, the user sees an input form where they define their documentation requirements. The form fields include a brief summary of the product or feature, the intended audience, and any technical specifications or style preferences. As the user fills in these fields, real-time validation ensures required fields are not empty and text length limits are respected.

When ready, the user clicks a “Generate Documentation” button at the bottom of the form. The system displays a progress indicator in place of the button, showing a spinner and a message that the AI is working. Behind the scenes, the app sends the form data to the backend AI generation endpoint. If the request succeeds, the generated document content appears below the form. The user can then review, edit, or request a regeneration with revised inputs. If the user chooses to accept the document, they click a “Save Document” button. The document is saved in the project’s document list and appears under the Overview tab.

In the project Overview tab, all saved documents are listed chronologically. The user clicks any document title to view it in full screen, where they can download it as a PDF or Markdown file. They can also rename or delete a document by clicking an icon that reveals the appropriate action.

For users with an upgraded subscription, an additional “Advanced Options” link appears in the Documentation Editor. Clicking it expands extra fields such as tone selection or audience region. These additional inputs feed into the AI generation endpoint as special parameters.

## Settings and Account Management

From the sidebar, the user navigates to Settings. In the Profile section, they can update their display name, change their avatar, or modify their contact email. To update their password, the user clicks a “Change Password” button, which opens a small form requiring their current password and a new one. Submitting valid credentials updates their login information immediately.

Below the Profile section is a Notifications section where the user can toggle email alerts for important events such as project completion, error alerts, or special promotions. Each toggle switch automatically saves the preference without reloading the page.

If the VibeGuide platform offers paid plans, a Billing section appears. There, the user can view their subscription status, payment method, and billing history. They click an “Update Payment Method” button to open a secure form for entering new card details. Any change is confirmed with a toast message. Upgrading or downgrading the subscription happens by clicking a plan card and confirming the change; the UI updates to reflect the new plan immediately.

From the Settings page, the user can always return to the Projects dashboard by clicking the sidebar link labeled Projects. The app preserves the user’s last visited project if they choose to return directly to a project detail view.

## Error States and Alternate Paths

If a user submits invalid data in any form, such as leaving required fields empty or entering an incorrect email format, inline error messages appear next to the affected fields, explaining the issue in plain language. The user cannot proceed until the errors are resolved.

During network outages or server failures, a full-screen overlay informs the user that the application is offline. This overlay provides a “Retry” button to attempt reconnection. If the user tries any action while offline, a small toast message reminds them that connectivity is required.

If a backend call fails unexpectedly, the user sees a dismissible error toast stating “Something went wrong. Please try again.” For authentication errors such as a session timeout or invalid token, the user is automatically redirected to the login page with a message indicating they must sign in again.

Attempting restricted actions, such as accessing the Billing section without a subscription or generating more documents than the plan allows, triggers an upgrade prompt. The prompt explains the limitation and provides a button to view pricing and upgrade.

## Conclusion and Overall App Journey

From the first moment a user visits the landing page to the ongoing creation and management of AI-generated documentation, the VibeGuide platform guides them through a clear and intuitive flow. New users sign up or sign in, set up their profile, and land on a dashboard that surfaces their projects. They create a project, enter documentation requirements in the editor, and watch as the AI generates content tailored to their needs. Saved documents appear in a convenient overview, where users can download or edit them. Settings and account management pages ensure that personal and billing information stays current. Along the way, helpful error messages and retry options keep the user on track. Ultimately, the user’s end goal—producing polished, AI-crafted documentation—is met through a straightforward journey from sign-up to saved deliverables.