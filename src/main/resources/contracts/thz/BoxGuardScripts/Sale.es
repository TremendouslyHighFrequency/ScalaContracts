{
	val swampAudioNode            = PK("9iAp6nJugJciwfZK5rDt4civh4jnnT13j4fXoBLqscC7GRbpt5s").propBytes
	val withdrawFee               = 10000000L
	val withdrawIndictationScript = fromBase16("765237a71b426b379adff61a613bf3d462a7dd0767b71ae8a907032d53e79905")

	val heldERG0              = SELF.value
	val heldTokens0           = SELF.tokens
	val initialShares         = SELF.R4[Coll[(Long,Coll[Byte])]].get
	val initialTokenList      = SELF.R5[Coll[Coll[Byte]]].get
	val initialTokenAmount    = SELF.R6[Long].get
	val initialWithdrawTokens = SELF.R7[(Coll[Byte], Long)].get

	if (CONTEXT.dataInputs.size == 0) {

		val successor = OUTPUTS(0)

		val heldERG1            = successor.value
		val heldTokens1         = successor.tokens
		val finalShares         = successor.R4[Coll[(Long,Coll[Byte])]].get
		val finalTokenList      = successor.R5[Coll[Coll[Byte]]].get
		val finalTokenAmount    = successor.R6[Long].get
		val finalWithdrawTokens = successor.R7[(Coll[Byte], Long)].get

		val deltaERG = heldERG1 - heldERG0

		val validSelfSuccessorScript = successor.propositionBytes == SELF.propositionBytes

		val validDeltaERG = deltaERG >= 0

		val validRegisters = (
			finalShares == initialShares &&
			finalTokenList == initialTokenList &&
			finalTokenAmount == initialTokenAmount - 1 &&
			finalWithdrawTokens == initialWithdrawTokens
		)

		val validSuccessorTokens = initialTokenList.forall {
			(id: Coll[Byte]) => successor.tokens.exists {
				(token: (Coll[Byte], Long)) => token(0) == id && token(1) >= finalTokenAmount
			}
		}

		val validShares = initialShares.forall {
			(share : (Long,Coll[Byte])) => OUTPUTS.exists {
				(output : Box) => output.propositionBytes == share(1) && output.value >= share(0)
			}
		}

		sigmaProp(
			validSelfSuccessorScript &&
			validDeltaERG &&
			validSuccessorTokens &&
			validRegisters &&
			validShares
		)
	} else {
		val withdrawalIndication = CONTEXT.dataInputs(0)

		val withdrawalTokens = withdrawalIndication.tokens(0)

		val validIndication     = initialWithdrawTokens == withdrawalTokens
		val validWithdrawScript = blake2b256(withdrawalIndication.propositionBytes) == withdrawIndictationScript

		val successor     = OUTPUTS(0)
		val swampAudioBox = OUTPUTS(1)
		val withdrawalBox = OUTPUTS(2)

		val tokenWithdrawalIndex = withdrawalBox.R4[Int].get
		val withdrawnTokens      = withdrawalBox.tokens(0)

		val heldERG1            = successor.value
		val heldTokens1         = successor.tokens
		val finalShares         = successor.R4[Coll[(Long,Coll[Byte])]].get
		val finalTokenList      = successor.R5[Coll[Coll[Byte]]].get
		val finalTokenAmount    = successor.R6[Long].get
		val finalWithdrawTokens = successor.R7[(Coll[Byte], Long)].get

		val validSelfSuccessorScript = successor.propositionBytes == SELF.propositionBytes

		val filteredWithdrawInitialTokens = heldTokens0.filter{
			(token: (Coll[Byte], Long)) => token(0) != initialTokenList(tokenWithdrawalIndex)
		}
		val filteredWithdrawFinalTokens = heldTokens1.filter{
			(token: (Coll[Byte], Long)) => token(0) != initialTokenList(tokenWithdrawalIndex)
		}

		val validSuccessorWithdrawnTokens = filteredWithdrawInitialTokens == filteredWithdrawFinalTokens

		val validRegisters = (
			finalShares == initialShares &&
			finalTokenList == initialTokenList &&
			finalTokenAmount == initialTokenAmount &&
			finalWithdrawTokens == initialWithdrawTokens
		)

		val validWithdrawer      = withdrawalBox.propositionBytes == initialShares(tokenWithdrawalIndex)(1)
		val validTokensWithdrawn = withdrawnTokens._1 == initialTokenList(tokenWithdrawalIndex) && withdrawnTokens._2 >= initialTokenAmount

		val validSwampAudioScript = swampAudioBox.propositionBytes == swampAudioNode
		val validSwampValue       = swampAudioBox.value >= withdrawFee

		sigmaProp(
			validWithdrawer &&
			validTokensWithdrawn &&
			validSwampValue &&
			validSwampAudioScript &&
			validSelfSuccessorScript &&
			validSuccessorWithdrawnTokens &&
			validIndication &&
			validWithdrawScript &&
			validRegisters
		)
	}

}

/////P2S ADDRESS/////
//5ZEwzMFTFBcTcTX1hu4yvESbumgV8nkzQjBBd9WR3GHwmBjhykMtDz79UeZcB9JL8R5ueV7sQfW5dhcYZV755DDabDoJhvj2KCUMvSUCTm87Jd566o9mdry1NsSxpf6WDgesbQsUdphkwCBVckSfeSfHfRs3rPRJNjBAVNDtE6ARea5ak6ZngNNewJDrgqHhc3tzDjpqZcPQFjdnV7uNWnwd4oNiR3sZ17sbGS1qEAhvRjGzEmuk3gNxMi4zSobXCNSgwJfCnH3Qr8bxBdd4QQK1ahYNt6oigH5LcCmSrSgHX6JjcLAM8oQ4xup5FyDY9M3BZy66AxCDVzRf1Sk1d9nyGTS4N7GcFY3SD5nLveqjFPmGmy5aSEPZJe55Wt28rPuyhd8WioNrYAG4CsRi1iD7eyHecEn1m167D5KuXyfZVov6cZvvUpD9WBdGKfjfEJ9fVHyQ4Pc6VQjGsexxeSsR4QFQ9aRc4FNwg3L3aHPxuZB7MXJ4Ci7C2Y4iSqqtznPoF58BrX85BV7sY5jjDvPQ4KvpqyowqtNzCK8M1PSmUDRceuDbptSUhDgk5wYmbf991hKMipJEQgh9oStrWe2RxAk4VZq4Voj7uwJf4WhU2FoaKXVtYsw6xUDkUeTXCJqBYfaqRqKTXCWMC63ny3xhpzvyWTDdVssJb3Lu5
////////////////////

/////ErgoTree/////
//100d0400040005000502040404000402040004000580dac40908cd03e0cec0822ad82f91a141a1333551fc448e7c9921ca2989569d5e2aaf0e5c420a04000e20765237a71b426b379adff61a613bf3d462a7dd0767b71ae8a907032d53e79905d805d601db6501fed602e4c6a7051ad603e4c6a7040c410ed604e4c6a70605d605e4c6a7074d0e9593b172017300d802d606b2a5730100d607e4c672060605d1edededed93c27206c2a79299c17206c1a77302af7202d901080eaedb63087206d9010a4d0eed938c720a017208928c720a027207ededed93e4c67206040c410e720393e4c67206051a7202937207997204730393e4c67206074d0e7205af7203d90108410eaea5d9010a63ed93c2720a8c72080292c1720a8c720801d807d606b2a5730400d607e4c672060404d608b2db63087206730500d609b27202720700d60ab2a5730600d60bb2a5730700d60cb27201730800d1edededededededed93c272068cb2720372070002ed938c7208017209928c720802720492c1720a730993c2720ad0730a93c2720bc2a793b5db6308a7d9010d4d0e948c720d017209b5db6308720bd9010d4d0e948c720d017209937205b2db6308720c730b0093cbc2720c730cededed93e4c6720b040c410e720393e4c6720b051a720293e4c6720b0605720493e4c6720b074d0e7205
/////////////////////

/////ErgoTree Blake2b256 Hash Hex/////
//634c21eb3645646001b59a1e918116937b2ebac218e367af4c44f3b404412283
//////////////////////