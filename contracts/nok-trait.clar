(define-trait nok-trait
  (
    (deposit (uint) (response bool uint))
    (assign-recipients ((list 10 {recipient: principal, amount: uint})) (response bool uint))
    (check-and-distribute (principal) (response uint uint))
    (get-balance (principal) (response uint none))
    (get-recipients (principal) (response (list 10 {recipient: principal, amount: uint}) none))
    (get-last-activity (principal) (response uint none))
  )
)