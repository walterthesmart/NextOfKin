;; title: NextofKin
;; version:
;; summary:
;; description: A contract that provides a way to designate a recipient for your funds in case of inactivity.

;; traits
(use-trait sip-010-trait .sip-010-trait.sip-010-trait)
(impl-trait .nok-trait.nok-trait)
(contract-call? .storage)



;; Public Functions
(define-public (deposit (amount uint))
  (contract-call? .core deposit amount))

(define-public (assign-recipients (new-recipients (list 10 {recipient: principal, amount: uint})))
  (contract-call? .core assign-recipients new-recipients))

(define-public (check-and-distribute (user principal))
  (contract-call? .distribution check-and-distribute user))

;; Read-only Functions
(define-read-only (get-balance (user principal))
  (contract-call? .storage get-balance user))

(define-read-only (get-recipients (user principal))
  (contract-call? .storage get-recipients user))

(define-read-only (get-last-activity (user principal))
  (contract-call? .storage get-last-activity user))

;; private functions
;;









