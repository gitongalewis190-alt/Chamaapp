# Verifying M-Pesa codes against Safaricom

Status: **designed, not built.** It needs things only the Chama owner can provide (a Paybill or Till and Daraja API keys).

## What is possible

| How members pay | Can a code be checked with Safaricom? | How |
|---|---|---|
| To a **Paybill or Till** the Chama owns | **Yes** | Daraja C2B (push) or Transaction Status (pull) |
| **Send Money** to the treasurer's personal number | **No** public API exists | Only the SMS the treasurer receives (the app reads these today, including screenshots) |

## Recommended design (Paybill / Till)

1. **C2B Confirmation URL (best).** Register the Chama's shortcode with Daraja `C2B Register URL`, pointing to a new Supabase Edge Function `mpesa-c2b`.
   Safaricom then POSTs every incoming payment (code, amount, MSISDN masked, first name, bill reference) the moment it happens.
   - Store each one in a table `mpesa_receipts (chama_id, code unique, amount, msisdn_hash, first_name, bill_ref, received_at, raw jsonb)`.
   - Members type their member number as the **account / bill reference**, so matching is exact.
   - The app shows a "Verified by Safaricom" badge on any payment whose code is in `mpesa_receipts` with the same amount, and offers to record unmatched receipts in one tap.
2. **Transaction Status (for older payments).** Edge Function `mpesa-verify` calls `TransactionStatusQuery` with the code; the answer arrives on a result URL and updates `mpesa_receipts`.

## Security

- Daraja consumer key/secret, initiator password and certificate are Edge Function secrets, never in the app.
- The C2B endpoint checks Safaricom's source IPs and a secret path token; it only inserts, never updates payments.
- `record_payment` stays the only way money enters the books; a receipt only marks it verified.

## What the owner needs to provide

- A Paybill or Till number for the Chama, and a Daraja production app linked to it (developer.safaricom.co.ke).
- Then: deploy `mpesa-c2b`, run the migration for `mpesa_receipts`, register the URLs, and test with a KES 10 payment.
