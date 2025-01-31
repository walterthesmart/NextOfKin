;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant MAX_RECIPIENTS u10)
(define-constant INACTIVITY_PERIOD u52560) ;; ~1 year at 10-min block time
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INVALID_AMOUNT (err u101))
(define-constant ERR_INVALID_RECIPIENT_COUNT (err u102))

;; Data Maps
(define-map balances principal uint)
(define-map recipients principal (list 10 {recipient: principal, amount: uint}))
(define-map last-activity principal uint)

;; Read-only functions
(define-read-only (get-balance (user principal))
  (ok (default-to u0 (map-get? balances user)))
)

(define-read-only (get-recipients (user principal))
  (ok (default-to (list) (map-get? recipients user)))
)

(define-read-only (get-last-activity (user principal))
  (ok (default-to u0 (map-get? last-activity user)))
)

(define-read-only (get-contract-info)
  (ok {
    owner: CONTRACT_OWNER,
    max-recipients: MAX_RECIPIENTS,
    inactivity-period: INACTIVITY_PERIOD
  })
)

;; Private functions
(define-private (is-authorized (user principal))
  (or 
    (is-eq tx-sender CONTRACT_OWNER)
    (is-eq tx-sender user)
  )
)

(define-private (validate-recipients (new-recipients (list 10 {recipient: principal, amount: uint})))
  (let ((recipient-count (len new-recipients)))
    (and 
      (<= recipient-count MAX_RECIPIENTS)
      (> recipient-count u0)
    )
  )
)

;; Public functions
(define-public (set-balance (user principal) (amount uint))
  (begin
    (asserts! (is-authorized user) ERR_UNAUTHORIZED)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (map-set balances user amount)
    (map-set last-activity user block-height)
    (ok true)
  )
)

(define-public (set-recipients (user principal) (new-recipients (list 10 {recipient: principal, amount: uint})))
  (begin
    (asserts! (is-authorized user) ERR_UNAUTHORIZED)
    (asserts! (validate-recipients new-recipients) ERR_INVALID_RECIPIENT_COUNT)
    (map-set recipients user new-recipients)
    (map-set last-activity user block-height)
    (ok true)
  )
)