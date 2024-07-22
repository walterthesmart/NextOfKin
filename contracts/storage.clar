(define-constant CONTRACT_OWNER tx-sender)
(define-constant MAX_RECIPIENTS u10)
;; Approximately 1 year in blocks (assuming 10-minute block time)
(define-constant INACTIVITY_PERIOD u52560) 

(define-map balances principal uint)
(define-map recipients principal (list 10 {recipient: principal, amount: uint}))
(define-map last-activity principal uint)

(define-read-only (get-balance (user principal))
  (ok (map-get? balances user))
)

(define-read-only (get-recipients (user principal))
  (default-to (list) (map-get? recipients user))
)

(define-read-only (get-last-activity (user principal))
  (default-to u0 (map-get? last-activity user))
)

(define-read-only (inactivity-period) 
  INACTIVITY_PERIOD
)

(define-read-only (max-recipients) 
  MAX_RECIPIENTS
)

(define-read-only (contract-owner) 
  CONTRACT_OWNER
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