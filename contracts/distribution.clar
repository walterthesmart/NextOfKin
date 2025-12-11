(define-public (check-and-distribute (user principal))
  (begin
    (let (
        (user-balance (unwrap! (contract-call? .storage get-balance user) (err u3)))
        (user-recipients (unwrap! (contract-call? .storage get-recipients user) (err u4)))
        (last-active (unwrap! (contract-call? .storage get-last-activity user) (err u5)))
      )
      (if (and
          (> user-balance u0)
          (>= (- stacks-block-time last-active)
            (contract-call? .storage inactivity-period)
          )
        )
        (contract-call? .core execute-distribution user user-balance
          user-recipients
        )
        (err u2)
      )
    )
  )
)
