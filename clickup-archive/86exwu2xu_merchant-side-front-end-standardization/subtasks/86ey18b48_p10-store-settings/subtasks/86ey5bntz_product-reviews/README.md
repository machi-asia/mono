# Product Reviews

- **Task ID**: `86ey5bntz`
- **URL**: https://app.clickup.com/t/86ey5bntz
- **Status**: ready for deployment
- **Assignees**: Angelo Kamachi, Aira Pilor
- **Created**: 2026-07-03T10:25:57.676Z
- **Updated**: 2026-10-07T00:05:48.840Z
- **List**: P1 Delivery
- **Folder**: Shared with me

## Description

_No description_

## Media (7)

- `01_mobile-product_preview_ref.png` (source: attachment, uploader: Aira Pilor)

  ![01_mobile-product_preview_ref.png](./media/01_mobile-product_preview_ref.png)

- `02_tc02-product_preview_ref-after-tap.png` (source: attachment, uploader: Aira Pilor)

  ![02_tc02-product_preview_ref-after-tap.png](./media/02_tc02-product_preview_ref-after-tap.png)

- `03_tc01-product_preview_ref-tooltip-open.png` (source: attachment, uploader: Aira Pilor)

  ![03_tc01-product_preview_ref-tooltip-open.png](./media/03_tc01-product_preview_ref-tooltip-open.png)

- `04_image.png` (source: attachment, uploader: Angelo Kamachi)

  ![04_image.png](./media/04_image.png)

- `05_image.png` (source: attachment, uploader: Aira Pilor)

  ![05_image.png](./media/05_image.png)

- `06_image.png` (source: comment, uploader: Angelo Kamachi)

  ![06_image.png](./media/06_image.png)

- `07_image.png` (source: comment, uploader: Aira Pilor)

  ![07_image.png](./media/07_image.png)


## Comments (4)

### Aira Pilor (2026-10-06T08:02:54.863Z)

Env: DEV-local
Status: PASSED
URL: http://localhost:3000/home/settings/store?ref_key=product_preview_ref

TEST CASE #1: Section title "i" tooltip - desktop (case 1)
STEPS:
Step 1 - Open Settings > Store Settings at desktop width.
Step 2 - Hover the "i" icon beside "Product Reviews".
EXPECTED RESULT: Black icon aligned with the title; tooltip opens without covering the title or being cut off.
EVIDENCE: tc01-product_preview_ref-tooltip-open.png
ACTUAL RESULT: As expected. PASSED.

TEST CASE #2: Section title tooltip on mobile - tap (case 2)
STEPS:
Step 1 - Open Settings > Store Settings on a phone.
Step 2 - Tap the "i" icon beside "Product Reviews" and wait.
EXPECTED RESULT: Opens on tap and does not close itself.
EVIDENCE: tc02-product_preview_ref-after-tap.png
ACTUAL RESULT: Opens on tap and stays open. PASSED.

TEST CASE #3: Mobile view - section layout
STEPS:
Step 1 - Open Settings > Store Settings at 390px wide on a touch device.
Step 2 - Scroll to the Product Reviews card.
EXPECTED RESULT: The card fits the phone screen; nothing runs past the edge.
EVIDENCE: mobile-product_preview_ref.png
ACTUAL RESULT: As expected. PASSED.


### Angelo Kamachi (2026-08-18T06:34:36.294Z)

image.png
tooltip fixed


### Aira Pilor (2026-07-03T11:18:33.891Z)

env: DEV
Status: FAILED

The following are the issues under Product Reviews:
------Tooltip Icon and Layout on both MOBILE and DESKTOP view:
image.png

Kindly fix all the returns.

Moving this subtask to "Ready Priority"
cc @Angelo Kamachi

### ClickBot (2026-07-03T10:25:58.691Z)

This task Product Reviews has been created 
Date: Jul 3 2026, 6:25PM (Asia/Shanghai)
By Aira Pilor


