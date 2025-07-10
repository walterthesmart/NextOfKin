(define-public (deposit (amount uint))
    (begin
        (let ((current-balance (unwrap! (contract-call? .storage get-balance tx-sender) (err u1))))
            (unwrap! (stx-transfer? amount tx-sender (as-contract tx-sender)) (err u2))
            (unwrap! (contract-call? .storage set-balance tx-sender (+ current-balance amount)) (err u3))
            (ok true))))


(define-public (assign-recipients (new-recipients (list 10 {recipient: principal, amount: uint})))
  (let ((max-recipients (contract-call? .storage max-recipients)))
    (if (<= (len new-recipients) max-recipients)
        (begin
            (unwrap! (contract-call? .storage set-recipients tx-sender new-recipients) (err u200))
            (ok true))
        (err u1))))

(define-public (withdraw (amount uint))
  (begin
    (let ((current-balance (unwrap! (contract-call? .storage get-balance tx-sender) (err u4))))
      (asserts! (>= current-balance amount) (err u5))
      (unwrap! (as-contract (stx-transfer? amount tx-sender tx-sender)) (err u6))
      (unwrap! (contract-call? .storage set-balance tx-sender (- current-balance amount)) (err u7))
      (ok true))))