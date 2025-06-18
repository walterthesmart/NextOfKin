(define-trait nok-trait
  (
    (deposit (uint) (response bool uint))
    (withdraw (uint) (response bool uint))
    (check-and-distribute (principal) (response bool uint))
    (assign-recipients ((list 10 {recipient: principal, amount: uint})) (response bool uint))
  )
)