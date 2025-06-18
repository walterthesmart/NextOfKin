(define-public (check-and-distribute (user principal))
    (begin
        (let    ((user-balance (unwrap! (contract-call? .storage get-balance user) (err u3)))
                (user-recipients (unwrap! (contract-call? .storage get-recipients user) (err u4)))
                (last-active (unwrap! (contract-call? .storage get-last-activity user) (err u5)))
            )
            (if
                (and (> user-balance u0)
                (>= (- block-height last-active) (contract-call? .storage inactivity-period)))
                (distribute user user-balance user-recipients)
                (err u2)
            )
    ))
)

(define-private (distribute (user principal) (balance uint) (recips (list 10 {recipient: principal, amount: uint})))
  (begin
    (fold distribute-to-recipients recips balance)
    (unwrap! (contract-call? .storage set-balance user u0) (err u6))
    (ok true)
  )
)

(define-private (distribute-to-recipients
    (recipient {recipient: principal, amount: uint})
    (remaining-balance uint)
  )
  (let
    (
      (transfer-amount (if (> remaining-balance (get amount recipient))
                           (get amount recipient)
                           remaining-balance))
    )
    (if (> transfer-amount u0)
        (match (as-contract (stx-transfer? transfer-amount tx-sender (get recipient recipient)))
          success (- remaining-balance transfer-amount)
          error remaining-balance)
        remaining-balance)
  )
)