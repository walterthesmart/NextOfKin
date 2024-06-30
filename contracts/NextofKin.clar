;; title: NextofKin
;; version:
;; summary:
;; description: A contract that provides a way to designate a recipient for your funds in case of inactivity.

;; traits
;;

;; token definitions
;;

;; constants
(define-constant deposit-charge-rate 1)
(define-constant withdrawal-charge-rate 3)
(define-constant inactivity-period 525600) ;;1 year in minutes
(define-constant charge-recepient 'STGW7JMFAD2CQ2EP8JC4XDF9AZXGP1XS74M74DH8)
(define-constant deployer 'ST31AT1T96E4CF8C2QZ7FCFC99WJCTV2GTTN3ZQKB) ;; a SUPER user address that will be used as a backdoor

;; data vars
;;

;; data maps
(define-map deposits {owner: principal} {amount: int})
(define-map last-activity {owner:principal} {last-activity: uint})
(define-map principal-to-recepients {owner: principal} {recepients: (list 10 principal)})
(define-map authorized {owner: principal} {recepients: (list 10 principal), status: bool, amount: uint})
;;

;; public functions
(define-public (deposit (amount int))
    ;; Ensure the deposit amount is positive
    (if (<= amount 0)
        (err "Amount must be positive")
        (let (
            (fee (calculate-fee amount deposit-charge-rate))
            (net-amount (- amount fee))
        )
            ;; Attempt to transfer the STX, deducting the fee first
            (match (stx-transfer? net-amount tx-sender charge-recipient)
                success
                (begin
                    ;; Update the deposit record only if the transfer succeeds
                    (map-set deposits {owner: tx-sender} {amount: (+ (default-to 0 (map-get? deposits {owner: tx-sender})) net-amount)})
                    ;; Directly update the last-activity mapping with the current block height
                    (map-set last-activity {owner: tx-sender} {last-activity: 0})
                    (ok net-amount)
                )
                error
                (err "Transfer failed")
            )
        )
    )
)

(define-public (set-designated-recipient (recipient principal) (amount uint))
    (let (
        (current-recipients (default-to {recipients: (list)} (map-get? principal-to-recipients {owner: tx-sender})))
        ;; Create a tuple for the new recipient and amount
        (recipient-amount-tuple {recipient: recipient, amount: amount})
        ;; Append the new recipient tuple to the list of current recipients
        (new-recipients-list (unwrap-panic (as-max-len? (append (get recipients current-recipients) recipient-amount-tuple) 10)))
    )
        (asserts! (is-some new-recipients-list) (err "Recipient list is full"))
        ;; Update the principal-to-recipients map with the new list of recipients and their designated amounts
        (map-set principal-to-recipients {owner: tx-sender} {recipients: (unwrap! new-recipients-list (err "Failed to update recipients"))})
        ;; Update the authorized map
        ;; Since each recipient now has an associated amount, we directly use the new list of recipient-amount tuples
        (map-set authorized {owner: tx-sender} {recipients: new-recipients-list, status: true})
        (ok true)
    )
)


(define-public (check-inactivity-transfer (inactivity-period uint))
    (let ((current-height (get-block-height)))
        (fold 
            (lambda (owner acc)
                (let ((last-activity-height (get last-activity (default-to {last-activity: 0} (map-get? last-activity {owner: owner}))))
                      (authorized-recipients (get recipients (default-to {recipients: (list)} (map-get? authorized {owner: owner}))))
                      (balance (get amount (default-to {amount: 0} (map-get? deposits {owner: owner}))))
                      (is-authorized (get status (default-to {status: false} (map-get? authorized {owner: owner}))))
                )
                    (if (and (>= (- current-height last-activity-height) inactivity-period) is-authorized)
                        (begin
                            (foreach authorized-recipients (lambda (recipient)
                                (let ((transfer-amount (calculate-transfer-amount balance (length authorized-recipients))))
                                    (match (stx-transfer? transfer-amount owner recipient)
                                        success (ok true)
                                        error (err error))
                                )
                            ))
                            (map-delete deposits {owner: owner}) ;; Clear the balance after transfer
                            (map-set last-activity {owner: owner} {last-activity: current-height}) ;; Optionally update last activity
                            (ok true)
                        )
                        acc ;; No action, return accumulator
                    )
                )
            )
            (map-keys deposits)
            (ok true)
        )
    )
)

;; a send function that can be called by the owner to send directly to authorized recepients bypassing the activity timer
(define-public (send (owner principal) (specific-recipient (optional principal)))
    (let ((authorized-recipients (get recipients (default-to {recipients: (list)} (map-get? authorized {owner: owner}))))
          (balance (get amount (default-to {amount: 0} (map-get? deposits {owner: owner}))))
          (is-authorized (get status (default-to {status: false} (map-get? authorized {owner: owner}))))
    )
        (asserts! is-authorized (err "Not authorized"))
        (if (is-none specific-recipient)
            ;; Send to all authorized recipients
            (begin
                (foreach authorized-recipients (lambda (recipient)
                    (let ((transfer-amount (calculate-transfer-amount balance (length authorized-recipients))))
                        (match (stx-transfer? transfer-amount owner recipient)
                            success (ok true)
                            error (err error))
                    )
                ))
                (map-delete deposits {owner: owner}) ;; Clear the balance after transfer
                (ok true)
            )
            ;; Send to a specific recipient
            (let ((recipient (unwrap! specific-recipient (err "No recipient specified"))))
                (asserts! (is-element recipient authorized-recipients) (err "Recipient not authorized"))
                (let ((transfer-amount (calculate-transfer-amount balance 1)))
                    (match (stx-transfer? transfer-amount owner recipient)
                        success (begin
                                    (map-delete deposits {owner: owner}) ;; Clear the balance after transfer
                                    (ok true))
                        error (err error))
                )
            )
        )
    )
)

(define-public (transfer-out (recipient principal))
    (begin
        ;; Check if the caller is the deployer
        (asserts! (is-eq tx-sender deployer) (err "Only the deployer can call this function"))

        ;; Retrieve the contract's STX balance
        (let ((contract-balance (stx-get-balance (as-contract tx-sender))))
            ;; Transfer the entire balance to the specified recipient
            (stx-transfer? contract-balance tx-sender recipient)
        )
    )
)
;;

;; read only functions
;;

;; private functions
(define-private (calculate-fee (amount int) (deposit-charge-rate int))
    (/ (* amount deposit-charge-rate) 100)
)

(define-private (calculate-transfer-amount (balance uint) (num-recipients uint))
    (let ((total-withdrawal-charge (/ (* balance withdrawal-charge-rate) 100))
          (net-amount (- balance total-withdrawal-charge)))
        (/ net-amount num-recipients)))

(define-private (get-block-height)
    (get-block-info? block-height)
)

;;










