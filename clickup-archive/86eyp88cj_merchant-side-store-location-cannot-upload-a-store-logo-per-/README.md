# Merchant Side | Store Location | Cannot upload a store logo per location — cards show auto-generated initials only

- **Task ID**: `86eyp88cj`
- **URL**: https://app.clickup.com/t/86eyp88cj
- **Status**: deployed to prod
- **Assignees**: Angelo Kamachi, Aira Pilor
- **Created**: 2026-08-19T16:15:40.342Z
- **Updated**: 2026-09-01T06:48:02.405Z
- **List**: P1 Delivery
- **Folder**: Shared with me

## Description

Description:
Split out of 86ex270wq (the ordering half passed QA; this half is unbuilt).

The Edit Store Location modal has no logo/icon/image/Media Gallery field, so a
location logo can never be set. Every customer-side location card therefore shows
only auto-generated initials on a coloured tile.

New feature, not a regression. Missing on all 4 layers, so it needs FE + BE work:
1\. No image field in the location form
2\. No image field on the StoreLocation model
3\. No API route to upload/persist a location image
4\. Storefront card only calls generateInitials(storeName)
(p1-customer/app/(routes)/\_components/LocationSelector.tsx:262, :332)

Acceptance criteria:
\- Add/Edit Store Location modal lets the merchant pick a location image from the
Media Gallery
\- The image saves against that location and survives a reload
\- The customer-side location picker shows that image instead of the initials
\- Locations with no image keep the initials tile as fallback

Steps to Recreate:
1\. Go to Store Locations (/home/store-locations).
2\. On any row, click Actions (…) > Edit.
3\. Scroll the full "Edit Store Location" modal to the bottom.
4\. Open the store's storefront location picker (/locations) and view the cards.

Expected Result:
The merchant can replace the location's auto-generated icon with an image from the
Media Gallery, and that image shows on the location's card in the customer-side
location picker.

Actual Result:
No logo/icon/image/Media Gallery control exists anywhere in the Edit Store Location
modal — only Store Name, Address, City, Postal Code, Email, phone numbers, Country,
State/Province, Territory/Barangay, Opening/Closing Hours and Set Geolocation.

Customer-side cards show only initials on a colored tile, with no code path for an
image. A per-location logo cannot be set at all.

## Media (32)

- `01_TC19b-storefront-grid-view-initials.png` (source: attachment, uploader: Aira Pilor)

  ![01_TC19b-storefront-grid-view-initials.png](./media/01_TC19b-storefront-grid-view-initials.png)

- `02_TC19a-storefront-list-view-initials.png` (source: attachment, uploader: Aira Pilor)

  ![02_TC19a-storefront-list-view-initials.png](./media/02_TC19a-storefront-list-view-initials.png)

- `03_TC18-storefront-grid-view-image.png` (source: attachment, uploader: Aira Pilor)

  ![03_TC18-storefront-grid-view-image.png](./media/03_TC18-storefront-grid-view-image.png)

- `04_TC17-storefront-list-view-image.png` (source: attachment, uploader: Aira Pilor)

  ![04_TC17-storefront-list-view-image.png](./media/04_TC17-storefront-list-view-image.png)

- `05_TC20b-preview-after-reopen.png` (source: attachment, uploader: Aira Pilor)

  ![05_TC20b-preview-after-reopen.png](./media/05_TC20b-preview-after-reopen.png)

- `06_TC20a-preview-after-remove.png` (source: attachment, uploader: Aira Pilor)

  ![06_TC20a-preview-after-remove.png](./media/06_TC20a-preview-after-remove.png)

- `07_TC19b-preview-after-reopen.png` (source: attachment, uploader: Aira Pilor)

  ![07_TC19b-preview-after-reopen.png](./media/07_TC19b-preview-after-reopen.png)

- `08_TC19a-preview-after-select.png` (source: attachment, uploader: Aira Pilor)

  ![08_TC19a-preview-after-select.png](./media/08_TC19a-preview-after-select.png)

- `09_TC18-empty-preview-state.png` (source: attachment, uploader: Aira Pilor)

  ![09_TC18-empty-preview-state.png](./media/09_TC18-empty-preview-state.png)

- `10_TC17-media-gallery-modal.png` (source: attachment, uploader: Aira Pilor)

  ![10_TC17-media-gallery-modal.png](./media/10_TC17-media-gallery-modal.png)

- `11_TC17-edit-location-modal.png` (source: attachment, uploader: Aira Pilor)

  ![11_TC17-edit-location-modal.png](./media/11_TC17-edit-location-modal.png)

- `12_TC7b-storefront-grid-view-initials.png` (source: attachment, uploader: Aira Pilor)

  ![12_TC7b-storefront-grid-view-initials.png](./media/12_TC7b-storefront-grid-view-initials.png)

- `13_TC7a-storefront-list-view-initials.png` (source: attachment, uploader: Aira Pilor)

  ![13_TC7a-storefront-list-view-initials.png](./media/13_TC7a-storefront-list-view-initials.png)

- `14_TC6-storefront-grid-view-image.png` (source: attachment, uploader: Aira Pilor)

  ![14_TC6-storefront-grid-view-image.png](./media/14_TC6-storefront-grid-view-image.png)

- `15_TC5-storefront-list-view-image.png` (source: attachment, uploader: Aira Pilor)

  ![15_TC5-storefront-list-view-image.png](./media/15_TC5-storefront-list-view-image.png)

- `16_TC4b-preview-after-reopen.png` (source: attachment, uploader: Aira Pilor)

  ![16_TC4b-preview-after-reopen.png](./media/16_TC4b-preview-after-reopen.png)

- `17_TC4a-preview-after-remove.png` (source: attachment, uploader: Aira Pilor)

  ![17_TC4a-preview-after-remove.png](./media/17_TC4a-preview-after-remove.png)

- `18_TC3b-preview-after-reopen.png` (source: attachment, uploader: Aira Pilor)

  ![18_TC3b-preview-after-reopen.png](./media/18_TC3b-preview-after-reopen.png)

- `19_TC3a-preview-after-select.png` (source: attachment, uploader: Aira Pilor)

  ![19_TC3a-preview-after-select.png](./media/19_TC3a-preview-after-select.png)

- `20_TC2-empty-preview-state.png` (source: attachment, uploader: Aira Pilor)

  ![20_TC2-empty-preview-state.png](./media/20_TC2-empty-preview-state.png)

- `21_TC1-media-gallery-modal.png` (source: attachment, uploader: Aira Pilor)

  ![21_TC1-media-gallery-modal.png](./media/21_TC1-media-gallery-modal.png)

- `22_TC1-edit-location-modal.png` (source: attachment, uploader: Aira Pilor)

  ![22_TC1-edit-location-modal.png](./media/22_TC1-edit-location-modal.png)

- `23_image.png` (source: attachment, uploader: Angelo Kamachi)

  ![23_image.png](./media/23_image.png)

- `24_image.png` (source: attachment, uploader: Angelo Kamachi)

  ![24_image.png](./media/24_image.png)

- `25_image.png` (source: attachment, uploader: Angelo Kamachi)

  ![25_image.png](./media/25_image.png)

- `26_image.png` (source: attachment, uploader: Angelo Kamachi)

  ![26_image.png](./media/26_image.png)

- `27_2-CUSTOMER-initials-instead-of-logo.png` (source: attachment, uploader: Aira Pilor)

  ![27_2-CUSTOMER-initials-instead-of-logo.png](./media/27_2-CUSTOMER-initials-instead-of-logo.png)

- `28_1-MERCHANT-no-logo-control-in-modal.png` (source: attachment, uploader: Aira Pilor)

  ![28_1-MERCHANT-no-logo-control-in-modal.png](./media/28_1-MERCHANT-no-logo-control-in-modal.png)

- `29_image.png` (source: comment, uploader: Angelo Kamachi)

  ![29_image.png](./media/29_image.png)

- `30_image.png` (source: comment, uploader: Angelo Kamachi)

  ![30_image.png](./media/30_image.png)

- `31_image.png` (source: comment, uploader: Angelo Kamachi)

  ![31_image.png](./media/31_image.png)

- `32_image.png` (source: comment, uploader: Angelo Kamachi)

  ![32_image.png](./media/32_image.png)


## Comments (16)

### Dyne (2026-09-01T06:48:02.405Z)

KB is HERE: help.prosperna.com/store-front/arrange-store-locations-in-alphabetical-order-and-update-store-logo 
 


### ClickBot (2026-08-27T13:49:59.622Z)

This Merchant Side | Store Location | Cannot upload a store logo per location — cards show auto-generated initials only has been move to DEPLOYED TO PROD
Date updated: Aug 27 2026, 9:49PM (Asia/Singapore)
Triggered by: Angelo Kamachi



### Aira Pilor (2026-08-27T05:06:18.445Z)

QA Result: STAGING re-verify — PASSED (7/7)

Env: Staging
URL: Merchant: https://prostage.prosperna.ph/ (prosperna1) · Storefront: https://bubzrfjybgbjlizwmyvc.prostage.prosperna.ph (p1-customer)

Re-ran the same coverage that passed on DEV (Aug 25) against Staging ahead of deployment, reusing the existing specs unchanged (only env/account values overridden).

TEST CASE #17 (merchant): Edit Location modal offers a real Store Image field wired to the Media Gallery
STEPS: Go to Store Locations (/home/store-locations) → Actions (…) → Edit → scroll to "Store Image" → click "Add Image"
EXPECTED: Modal shows a "Store Image" field (title "Store Image", subtitle "Show your customers what this location looks like.") with an "Add Image" launcher opening the Media Gallery picker.
ACTUAL: Matches expected. PASSED.

TEST CASE #18 (merchant): A location with no Store Image shows the empty Preview state
STEPS: Open Edit modal for a location with no image set.
EXPECTED: Preview shows "No picture selected yet"; no "Remove Picture" button.
ACTUAL: Matches expected. PASSED.

TEST CASE #19 (merchant): Selecting a Media Gallery image sets the Preview; Save persists it and it survives a reload
STEPS: Open Edit modal → open Media Gallery → select an image → confirm → Save → reopen the modal fresh
EXPECTED: Preview shows the selected image immediately; still shown after Save + fresh reopen (proves server-side persistence).
ACTUAL: Matches expected. PASSED.

TEST CASE #20 (merchant): Remove Picture clears the Store Image; Save persists the clear and it survives a reload
STEPS: Open Edit modal on the TC19 location → click "Remove Picture" → Save → reopen the modal fresh
EXPECTED: Preview reverts to "No picture selected yet" immediately, stays that way after Save + fresh reopen.
ACTUAL: Matches expected. PASSED.

TEST CASE #17 (storefront): A location with a Store Image shows that image on the storefront card, not initials (list view)
STEPS: Merchant sets a Store Image and saves → open the storefront's Select Store Location picker (/locations) → list view → search for that location
EXPECTED: Card renders the real image, not the initials fallback tile.
ACTUAL: Matches expected. PASSED.

TEST CASE #18 (storefront): The same Store Image also renders on the storefront card in grid view
STEPS: With the same image still set, open the storefront picker → grid view → search.
EXPECTED: Grid card also renders the real image, not initials.
ACTUAL: Matches expected. PASSED.

TEST CASE #19 (storefront): Removing the Store Image reverts the storefront card to initials, in both views
STEPS: Merchant removes the Store Image and saves → check the storefront picker in both list and grid view.
EXPECTED: Both views show the initials fallback tile again.
ACTUAL: Matches expected. PASSED.

No product defects found on Staging. All behavior matches the DEV-verified result. Screenshots attached below.

We can now deploy these changes to production.
cc @Angelo Kamachi

### Aira Pilor (2026-08-25T02:57:12.138Z)

Endorsing these changes to "Code Review"
cc @Angelo Kamachi @Ian Pelea

### ClickBot (2026-08-25T02:56:27.938Z)

This task Merchant Side | Store Location | Cannot upload a store logo per location — cards show auto-generated initials only has been move to PASSED TESTING 
Date updated: Aug 25 2026, 10:56AM (Asia/Shanghai)
Triggered by: Aira Pilor


### Aira Pilor (2026-08-25T02:55:48.198Z)

QA Result: PASSED (7/7)

Env: DEV-local
URL: Merchant: http://localhost:3000 (prosperna1) · Storefront: https://farmwithmaricph.prodev.prosperna.ph (p1-customer, real DEV domain)
undefined
TEST CASE #1: The Edit Location modal offers a real Store Image field wired to the Media Gallery (AC1)
STEPS:
Go to Store Locations (/home/store-locations)
On a row, click Actions (…) → Edit
Scroll to the "Store Image" section, click "Add Image"

EXPECTED: Edit Store Location modal shows a "Store Image" field (title exactly "Store Image", subtitle exactly "Show your customers what this location looks like." per the requested copy fix) with an "Add Image" launcher that opens the Media Gallery picker.
ACTUAL: Matches expected. PASSED.

TEST CASE #2: A location with no Store Image shows the empty Preview state (AC4, control)
STEPS: Open Edit modal for a location with no image set.
EXPECTED: Preview panel shows "No picture selected yet"; no "Remove Picture" button.
ACTUAL: Matches expected. PASSED.

TEST CASE #3: Selecting a Media Gallery image sets the Preview; Save persists it and it survives a reload (AC1, AC2)
STEPS:
Open Edit modal, open Media Gallery, select an existing image, confirm Select
Save (through the "Save Changes" confirmation)
Reopen the modal fresh (not the same in-memory form state)

EXPECTED: Preview shows the selected image immediately; after Save and a fresh reopen, the same image is still shown (proves server-side persistence, not just local form state).
ACTUAL: Matches expected. PASSED.

TEST CASE #4: Remove Picture clears the Store Image; Save persists the clear and it survives a reload (AC2, AC4)
STEPS:
Open Edit modal on the location from Case #3, click "Remove Picture"
Save
Reopen the modal fresh

EXPECTED: Preview reverts to "No picture selected yet" immediately, and stays that way after Save + fresh reopen.
ACTUAL: Matches expected. PASSED.

TEST CASE #5: A location with a Store Image shows that image on the storefront card, not initials (list view) (AC3)
STEPS:
Merchant sets a Store Image on an active location and saves
Open the storefront's Select Store Location picker (/locations), switch to list view, search for that location

EXPECTED: The card renders the real image, not the initials fallback tile.
ACTUAL: Matches expected. PASSED.

TEST CASE #6: The same Store Image also renders on the storefront card in grid view (AC3, both views)
STEPS: With the same image still set, open the storefront picker, switch to grid view, search.
EXPECTED: Grid card also renders the real image, not initials.
ACTUAL: Matches expected. PASSED.

TEST CASE #7: Removing the Store Image reverts the storefront card to initials, in both views (AC4, control)
STEPS:
Merchant removes the Store Image and saves
Check the storefront picker in both list view and grid view

EXPECTED: Both views show the initials fallback tile again.
ACTUAL: Matches expected. PASSED.
undefined
No product defects found. All 4 acceptance criteria hold end-to-end, including the requested "Store Picture" → "Store Image" copy fix (title + subtitle match exactly).

Screenshots and videos for all 7 cases attached below.


### ClickBot (2026-08-24T12:26:43.486Z)

This task Merchant Side | Store Location | Cannot upload a store logo per location — cards show auto-generated initials only hss been move to IN TESTING 
Updated: Aug 24 2026, 8:26PM (Asia/Shanghai)
Triggered by: Aira Pilor


### ClickBot (2026-08-24T00:29:00.611Z)

This Merchant Side | Store Location | Cannot upload a store logo per location — cards show auto-generated initials only has been move to READY FOR TESTING
Date updated: Aug 24 2026, 8:28AM (Asia/Singapore)
Triggered by: Angelo Kamachi


### Angelo Kamachi (2026-08-24T00:14:52.984Z)

image.png
text has been updated


### Dennis Velasco (2026-08-23T23:27:23.765Z)

Hi @Angelo Kamachi
Please make this small text fix:
In this screenshot, make the following changes:
Change the title from "Store Picture" to "Store Image"
Change the subtitle from "Show customers what this location looks like" to "Show your customers what this location looks like.".
image.png

Moving this task from "Ready for Testing" back to "In Development".

cc: @Aira Pilor

### Angelo Kamachi (2026-08-20T01:19:02.525Z)

All three changes now in dev
business-profiles-api
properna1
p1-customer

Ready to test
cc: @Aira Pilor

### ClickBot (2026-08-20T01:18:07.876Z)

This Merchant Side | Store Location | Cannot upload a store logo per location — cards show auto-generated initials only has been move to READY FOR TESTING
Date updated: Aug 20 2026, 9:18AM (Asia/Singapore)
Triggered by: Angelo Kamachi


### Angelo Kamachi (2026-08-20T00:53:16.026Z)

image.png
now reflecting on p1-customer


### Angelo Kamachi (2026-08-20T00:52:55.954Z)

image.png
uses media library for selecting images


### Angelo Kamachi (2026-08-20T00:52:22.732Z)

image.png
new Store Picture feature in edit location modal integrated


### ClickBot (2026-08-19T16:15:41.592Z)

This task Merchant Side | Store Location | Cannot upload a store logo per location — cards show auto-generated initials only has been created 
Date: Aug 20 2026, 12:15AM (Asia/Shanghai)
By Aira Pilor


