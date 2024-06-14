
;; title: NextofKin
;; version:
;; summary:
;; description: A contract that provides a way to designate a recipient for your funds in case of inactivity.

;; traits
;;

;; token definitions
(define-fungible-token token)
;;

;; constants
(define-constant deposit-charge-rate 1)
(define-constant withdrawal-charge-rate 3)
(define-constant inactivity-period 525600) ;;1 year in minutes
;;

;; data vars
;;

;; data maps
(define-map deposits principal principal)
(define-map last-activity principal int)
(define-map designated-recipient principal principal)
(define-map designated-amount principal int)
(define-map authorized principal (define-map principal bool))
;;

;; public functions
(define-public (deposit (amount int))
    (let (
        (fee (calculate-fee amount deposit-charge-rate))
        (net-amount (- amount fee))
    )
        (stx-transfer? amount tx-sender charge-recipient)
        (map-set deposits tx-sender (+ (default-to 0 (map-get? deposits tx-sender)) net-amount))
        (update-activity tx-sender)
        (ok net-amount)
    )
)

(define-public (set-designated-recipient (recipient principal) (amount int))
    (let (
        (balance (default-to 0 (map-get? deposits tx-sender)))
    )
        (asserts! (>= balance amount) (err "Insufficient balance"))
        (map-set designated-recipient tx-sender recipient)
        (map-set designated-amount tx-sender amount)
        (ok true)
    )
)

(define-public (authorize (addr principal) (status bool))
    (let (
        (auth (default-to (map) (map-get? authorized tx-sender)))
    )
        (map-set auth addr status)
        (map-set authorized tx-sender auth)
        (ok true)
    )
)

(define-public (transfer-to (recipient principal) (amount int))
    (let (
        (balance (default-to 0 (map-get? deposits tx-sender)))
        (fee (calculate-fee amount withdrawal-charge-rate))
        (net-amount (- amount fee))
    )
        (asserts! (>= balance amount) (err "Insufficient balance"))
        (stx-transfer? fee tx-sender 'charge-recipient)
        (stx-transfer? net-amount tx-sender recipient)
        (map-set deposits tx-sender (- balance amount))
        (update-activity tx-sender)
        (ok net-amount)
    )
)

(define-public (transfer-from (depositor principal) (recipient principal) (amount int))
    (let (
        (auth (default-to (map) (map-get? authorized depositor)))
        (balance (default-to 0 (map-get? deposits depositor)))
        (fee (calculate-fee amount withdrawal-charge-rate))
        (net-amount (- amount fee))
    )
        (asserts! (get depositor auth) (err "Not authorized"))
        (asserts! (>= balance amount) (err "Insufficient balance"))
        (stx-transfer? fee tx-sender 'charge-recipient)
        (stx-transfer? net-amount tx-sender recipient)
        (map-set deposits depositor (- balance amount))
        (update-activity depositor)
        (ok net-amount)
    )
)

(define-public (check-inactivity)
    (let (
        (current-height (block-height))
        (addresses (map-keys deposits))
    )
        (for addresses addr
            (let (
                (last-activity-height (default-to 0 (map-get? last-activity addr)))
                (designated-amount (default-to 0 (map-get? designated-amount addr)))
                (designated-recipient (default-to tx-sender (map-get? designated-recipient addr)))
            )
                (if (>= (- current-height last-activity-height) inactivity-period)
                    (let (
                        (balance (default-to 0 (map-get? deposits addr)))
                        (fee (calculate-fee designated-amount withdrawal-charge-rate))
                        (net-amount (- designated-amount fee))
                    )
                        (if (>= balance designated-amount)
                            (begin
                                (stx-transfer? fee tx-sender 'charge-recipient)
                                (stx-transfer? net-amount tx-sender designated-recipient)
                                (map-set deposits addr (- balance designated-amount))
                                (ok net-amount)
                            )
                            (err "Insufficient balance for inactivity transfer")
                        )
                    )
                    (ok false)
                )
            )
        )
    )
)
;;

;; read only functions
;;

;; private functions
(define-private (calculate-fee (amount int) (rate int))
    (/ (* amount rate) 100)
)

(define-private (update-activity (depositor principal))
    (map-set last-activity depositor (block-height))
)
;;










