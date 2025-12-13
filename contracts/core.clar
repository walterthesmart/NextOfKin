(define-public (deposit (amount uint))
  (begin
    (let ((current-balance (unwrap! (contract-call? .storage get-balance tx-sender) (err u1))))
      (unwrap! (stx-transfer? amount tx-sender (as-contract tx-sender)) (err u2))
      (unwrap!
        (contract-call? .storage set-balance tx-sender (+ current-balance amount))
        (err u3)
      )
      (ok true)
    )
  )
)

(define-public (assign-recipients (new-recipients (list 10 {
  recipient: principal,
  amount: uint,
})))
  (let ((max-recipients (contract-call? .storage max-recipients)))
    (if (<= (len new-recipients) max-recipients)
      (begin
        (unwrap!
          (contract-call? .storage set-recipients tx-sender new-recipients)
          (err u200)
        )
        (ok true)
      )
      (err u1)
    )
  )
)

(define-public (withdraw (amount uint))
  (begin
    (let ((current-balance (unwrap! (contract-call? .storage get-balance tx-sender) (err u4))))
      (asserts! (>= current-balance amount) (err u5))
      (unwrap! (as-contract (stx-transfer? amount tx-sender tx-sender)) (err u6))
      (unwrap!
        (contract-call? .storage set-balance tx-sender (- current-balance amount))
        (err u7)
      )
      (ok true)
    )
  )
)

;; Distribution logic moved here to access funds
(define-private (distribute-to-recipients
    (recipient {
      recipient: principal,
      amount: uint,
    })
    (remaining-balance uint)
  )
  (let ((transfer-amount (if (> remaining-balance (get amount recipient))
      (get amount recipient)
      remaining-balance
    )))
    (if (> transfer-amount u0)
      (match (as-contract (stx-transfer? transfer-amount tx-sender (get recipient recipient)))
        success (- remaining-balance transfer-amount)
        error
        remaining-balance
      )
      remaining-balance
    )
  )
)

(define-public (execute-distribution
    (user principal)
    (balance uint)
    (recipients (list 10 {
      recipient: principal,
      amount: uint,
    }))
  )
  (begin
    (asserts! (is-eq contract-caller .distribution) (err u1001))
    (fold distribute-to-recipients recipients balance)
    (unwrap! (contract-call? .storage set-balance user u0) (err u1002))
    (ok true)
  )
)
