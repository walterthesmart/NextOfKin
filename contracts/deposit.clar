;; Owner
(define-constant contract-owner tx-sender)

;; Errors
(define-constant err-owner-only (err u100))
(define-constant err-already-locked (err u101))
(define-constant err-unlock-in-past (err u102))
(define-constant err-no-value (err u103))
(define-constant err-beneficiary-only (err u104))
(define-constant err-unlock-height-not-reached (err u105))

;; constants
(define-constant deposit-charge-rate 1)
(define-constant withdrawal-charge-rate 3)
(define-constant inactivity-period 525600) ;;1 year in minutes
(define-constant charge-recepient 'STGW7JMFAD2CQ2EP8JC4XDF9AZXGP1XS74M74DH8)
(define-constant deployer 'ST31AT1T96E4CF8C2QZ7FCFC99WJCTV2GTTN3ZQKB) ;; a SUPER user address that will be used as a backdoor

;; data maps
(define-map deposits {owner: principal} {amount: int})
(define-map last-activity {owner:principal} {last-activity: uint})
(define-map principal-to-recepients {owner: principal} {recepients: (list 10 principal)})
(define-map authorized {owner: principal} {recepients: (list 10 principal), status: bool, amount: uint})

;; Data
(define-data-var beneficiary (optional principal) none)
(define-data-var unlock-height uint u0)


(define-private (calculate-transfer-amount (balance uint) (num-recipients uint))
    (let ((total-withdrawal-charge (/ (* balance withdrawal-charge-rate) 100))
          (net-amount (- balance total-withdrawal-charge)))
        (/ net-amount num-recipients)
    )
)


(define-public (deposit (new-beneficiary principal) (unlock-at uint) (amount uint))
  (let 
        (fee (calculate-fee amount deposit-charge-rate))
        (net-amount (- amount fee))
	)
)