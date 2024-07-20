(define-public (deposit (amount uint))
    (let    ((current-balance (contract-call? .storage get-balance tx-sender)))
        (if (is-ok (stx-transfer? amount tx-sender (as-contract tx-sender)))
            (begin
                (try! (contract-call? .storage set-balance tx-sender (+ current-balance amount)))
                (try! (contract-call? .storage set-last-activity tx-sender block-height))
                (ok true)
            )
            (err u0)
        )
    )
)

(define-public (assign-recipients (new-recipients (list 10 {recipient: principal, amount: uint})))
  (if (<= (len new-recipients) (contract-call? .constants MAX_RECIPIENTS))
      (begin
        (try! (contract-call? .storage set-recipients tx-sender new-recipients))
        (ok true))
      (err u1)))