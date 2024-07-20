(define-map balances principal uint)
(define-map recipients principal (list 10 {recipient: principal, amount: uint}))
(define-map last-activity principal uint)

(define-read-only (get-balance (user principal))
  (default-to u0 (map-get? balances user))
)

(define-read-only (get-recipients (user principal))
  (default-to (list) (map-get? recipients user))
)

(define-read-only (get-last-activity (user principal))
  (default-to u0 (map-get? last-activity user))
)

(define-public (set-balance (user principal) (amount uint))
  (ok (map-set balances user amount))
)

(define-public (set-recipients (user principal) (new-recipients (list 10 {recipient: principal, amount: uint})))
  (ok (map-set recipients user new-recipients))
)

(define-public (set-last-activity (user principal) (height uint))
  (ok (map-set last-activity user height))
)