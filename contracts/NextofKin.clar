;; title: NextofKin
;; version:
;; summary:
;; description: A contract that provides a way to designate a recipient for your funds in case of inactivity.

;; traits
;;

;; token definitions
;;

;; constants
(define-constant deposit-charge-rate 1)
(define-constant withdrawal-charge-rate 3)
(define-constant inactivity-period 525600) ;;1 year in minutes
(define-constant charge-recepient 'STGW7JMFAD2CQ2EP8JC4XDF9AZXGP1XS74M74DH8)

;; data vars
;;

;; data maps
(define-map deposits {owner: principal} {amount: int})
(define-map last-activity {owner:principal} {last-activity: int})
(define-map principal-to-recepients {owner: principal} {recepients: (list 10 principal)})
(define-map authorized {owner: principal} {recepients: (list 10 principal), status: bool})
;;

;; public functions
(define-public (deposit (amount int))
    (let (
        (fee (calculate-fee amount deposit-charge-rate))
        (net-amount (- amount fee))
    )
        (stx-transfer? amount tx-sender charge-recipient)
        (map-set deposits {owner: tx-sender} {amount: (+ (default-to 0 (map-get? deposits tx-sender)) net-amount)})
        (update-activity tx-sender)
        (ok net-amount)
    )
)

(define-public (set-designated-recipient (recipient principal))
    (let (
        (current-recipients (default-to {recepients: (list)} (map-get? principal-to-recepients {owner: tx-sender})))
        (new-recipients-list (unwrap-panic (as-max-len? (append (get recepients current-recipients) recipient) 10)))
    )
        (asserts! (is-some new-recipients-list) (err "Recipient list is full"))
        (map-set principal-to-recepients {owner: tx-sender} {recepients: (unwrap! new-recipients-list (err "Failed to update recipients"))})
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










