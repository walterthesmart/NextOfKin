(define-public (check-and-distribute (user principal))
    (begin
        (let    ((user-balance (unwrap! (contract-call? .storage get-balance user) (err u3)))
                (user-recipients (contract-call? .storage get-recipients user))
                (last-active (contract-call? .storage get-last-activity user))
            )
            (if 
                (and (> u3 u0)
                (>= (- block-height last-active) (contract-call? .storage inactivity-period)))
                (distribute user u3 user-recipients)
                (err u2)
            )
    ))
)

(define-private (distribute (user principal) (balance uint) (recips (list 10 {recipient: principal, amount: uint})))
  (distribute-to-recipient user balance u2)
)

(define-private (distribute-to-recipient 
    (recipient-address principal) 
    (recipient-amount uint) 
    (remaining-balance uint)
  )
  (let
    (
      (transfer-amount (if (> remaining-balance recipient-amount)
                           recipient-amount
                           remaining-balance))
    )
    (if (> transfer-amount u0)
        (match (as-contract (stx-transfer? transfer-amount tx-sender recipient-address))
          success (ok (- remaining-balance transfer-amount))
          error (err u1))
        (ok remaining-balance))
  )
)