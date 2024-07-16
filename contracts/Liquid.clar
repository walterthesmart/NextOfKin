(define-map deposits {owner: principal} {amount: int})
(define-map loans principal {amount: int, last-interaction-block: uint})

(define-data-var total-deposits uint u0)
(define-data-var pool-reserve uint u0)
(define-data-var loan-interest-rate uint u10)

(define-constant err-no-interest (err u100))
(define-constant err-overpay (err u200))
(define-constant err-overborrow (err u300))

;; Define the contract's data variables

;; Maps each user's address to the amount they've deposited into the platform.
(define-map deposits { owner: principal } { amount: uint }) ;; Tracks how much each user has deposited.

;; Maps each user's address to their loan details, including the loan amount and the last interaction block.
(define-map loans principal { amount: uint, last-interaction-block: uint }) ;; Tracks how much each user has taken out in loans.

;; A variable to keep track of the total amount of sBTC deposited by all users into the platform.
(define-data-var total-deposits uint u0) ;; The total amount deposited by users.

;; A variable to track the total amount of interest or fees that have been collected by the platform.
(define-data-var pool-reserve uint u0) ;; The total interest collected (to pay out to depositors).

;; A variable representing the interest rate applied to loans, set at 10% in this example.
(define-data-var loan-interest-rate uint u10) ;; The interest rate for loans.

(define-public (deposit (amount uint))
    (let (
        (current-balance (default-to u0 (get amount (map-get? deposits { owner: tx-sender }))))
        )
        (try! (contract-call? .asset transfer amount tx-sender (as-contract tx-sender) none))
        (map-set deposits { owner: tx-sender } { amount: (+ current-balance amount) })
        (var-set total-deposits (+ (var-get total-deposits) amount))
        (ok true)
    )
)





(define-public (withdraw (amount uint)))
    (let (
        (current-balance (default-to u0 (get amount (map-get? deposits { owner: tx-sender })))
        (total-deposited (default-to u0 (get amount (map-get? deposits { owner: tx-sender }))))
        )
        (asserts! (>= total-deposited amount) err-overpay)
        (try! (contract-call? .asset transfer amount tx-sender (as-contract tx-sender) none))
        (map-set deposits { owner: tx-sender } { amount: (- current-balance amount) })
        (var-set total-deposits (- (var-get total-deposits) amount))
        (ok true)
    )
)

(define-public (borrow (amount uint))
    (let (
        (current-loan (default-to u0 (get amount (map-get? loans tx-sender))))
        (current-balance (default-to u0 (get amount (map-get? deposits { owner: tx-sender })))
        (interest-owed (calculate-interest amount))
        )
        (asserts! (>= current-balance amount) err-overborrow)
        (try! (contract-call? .asset transfer amount tx-sender (as-contract tx-sender) none))
        (map-set loans tx-sender { amount: (+ current-loan amount) last-interaction-block: (get-block-height) })
        (map-set deposits { owner: tx-sender } { amount: (- current-balance amount) })
        (var-set pool-reserve (+ (var-get pool-reserve) interest-owed))
        (ok true)
    )
))


