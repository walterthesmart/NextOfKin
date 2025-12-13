;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant MAX_RECIPIENTS u10)
(define-constant INACTIVITY_PERIOD u31536000) ;; 1 year in seconds
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INVALID_AMOUNT (err u101))
(define-constant ERR_INVALID_RECIPIENT_COUNT (err u102))

;; Data Maps
(define-map balances
  principal
  uint
)
(define-map recipients
  principal
  (list 10 {
    recipient: principal,
    amount: uint,
  })
)
(define-map last-activity
  principal
  uint
)

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
    inactivity-period: INACTIVITY_PERIOD,
  })
)

(define-read-only (max-recipients)
  MAX_RECIPIENTS
)

(define-read-only (inactivity-period)
  INACTIVITY_PERIOD
)

;; Private functions
(define-private (is-authorized-caller)
  (or
    (is-eq contract-caller .core)
    (is-eq contract-caller .distribution)
  )
)

(define-private (validate-recipients (new-recipients (list 10 {
  recipient: principal,
  amount: uint,
})))
  (let ((recipient-count (len new-recipients)))
    (and
      (<= recipient-count MAX_RECIPIENTS)
      (> recipient-count u0)
    )
  )
)

(define-private (validate-user (user principal))
  (and
    (not (is-eq user (as-contract tx-sender)))
    (not (is-eq user CONTRACT_OWNER)) ;; Optional: Owner shouldn't be a user? actually maybe they can.
    true
  )
)

;; Public functions
(define-public (set-balance
    (user principal)
    (amount uint)
  )
  (begin
    (asserts! (is-authorized-caller) ERR_UNAUTHORIZED)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    ;; Check user to satisfy linter and sanity
    (asserts! (not (is-eq user (as-contract tx-sender))) ERR_UNAUTHORIZED)
    (map-set balances user amount)
    (map-set last-activity user stacks-block-time)
    (ok true)
  )
)

(define-public (set-recipients
    (user principal)
    (new-recipients (list 10 {
      recipient: principal,
      amount: uint,
    }))
  )
  (begin
    (asserts! (is-authorized-caller) ERR_UNAUTHORIZED)
    (asserts! (validate-recipients new-recipients) ERR_INVALID_RECIPIENT_COUNT)
    (asserts! (not (is-eq user (as-contract tx-sender))) ERR_UNAUTHORIZED)
    (map-set recipients user new-recipients)
    (map-set last-activity user stacks-block-time)
    (ok true)
  )
)
