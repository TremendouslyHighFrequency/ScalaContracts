{
	val swampAudioNode = PK("9iAp6nJugJciwfZK5rDt4civh4jnnT13j4fXoBLqscC7GRbpt5s").propBytes
	val withdrawFee    = 10000000L

	val initialWithdrawalTokens = SELF.tokens
	val tokenOwners             = SELF.R4[Coll[(Long,Coll[Byte])]].get
	val mintTokenDetails        = SELF.R5[(Coll[Byte],Long)].get

	val successor     = OUTPUTS(0)

	val finalTokenOwners      = successor.R4[Coll[(Long,Coll[Byte])]].get
	val finalMintTokenDetails = successor.R5[(Coll[Byte],Long)].get

	val swampAudioBox = OUTPUTS(1)
	 if (swampAudioBox.propositionBytes == swampAudioNode) {
		// withdrawal
		val withdrawalBox = OUTPUTS(2)

		val tokenIndex = withdrawalBox.R4[Int].get

		val validSwampAudioScript = swampAudioBox.propositionBytes == swampAudioNode
		val validSwampValue       = swampAudioBox.value >= withdrawFee

		val validWithdrawalScript = withdrawalBox.propositionBytes == tokenOwners(tokenIndex)(1)
		val validWithdrawAmount = withdrawalBox.tokens(0)._1 == initialWithdrawalTokens(0)._1 && withdrawalBox.tokens(0)._2 == 1

		val validSuccessorScript = successor.propositionBytes == SELF.propositionBytes
		val validSuccessorValue  = successor.value >= SELF.value
		val validSuccesorTokens  = if (initialWithdrawalTokens(0)._2 > 1) {
			val finalWithdrawalTokens = successor.tokens(0)
			finalWithdrawalTokens._2 == initialWithdrawalTokens(0)._2 - 1 &&
			finalWithdrawalTokens._1 == initialWithdrawalTokens(0)._1
		} else {true}
		val validSuccessorOwners = tokenOwners.slice(0,tokenIndex).append(tokenOwners.slice(tokenIndex + 1, tokenOwners.size)) == finalTokenOwners
		val validMintDetails     = mintTokenDetails == finalMintTokenDetails
		val withdrawAllowed = initialWithdrawalTokens(0)._2 != mintTokenDetails._2 && initialWithdrawalTokens(0)._1 == mintTokenDetails._1

		sigmaProp(
			validSwampAudioScript &&
			validSwampValue &&
			validWithdrawalScript &&
			validWithdrawAmount &&
			validSuccessorScript &&
			validSuccessorValue &&
			validSuccesorTokens &&
			validSuccessorOwners &&
			validMintDetails &&
			withdrawAllowed
		)
	} else {
		// deposit
		val finalWithdrawalTokens = successor.tokens(0)

		val slicedInitialOwners = tokenOwners.slice(0, tokenOwners.size) // Needed because comparison doesnt work without slicing
		val slicedFinalOwners   = finalTokenOwners.slice(0, tokenOwners.size)

		val validSuccessorScript = successor.propositionBytes == SELF.propositionBytes
		val validSuccessorValue  = successor.value >= SELF.value
		val validSuccesorTokens = finalWithdrawalTokens._2 == initialWithdrawalTokens(0)._2 + 1 && finalWithdrawalTokens._1 == initialWithdrawalTokens(0)._1
		val validFinalOwners     = slicedFinalOwners == slicedInitialOwners && finalTokenOwners.size == tokenOwners.size + 1
		val validMintDetails     = mintTokenDetails == finalMintTokenDetails
		sigmaProp(
			validSuccessorScript &&
			validSuccessorValue &&
			validSuccesorTokens &&
			validFinalOwners &&
			validMintDetails
		)
	}
}

/////P2S ADDRESS/////
//ChSE2E1gh9wX8ffWYwgxofQnaPk311gyC4KE9nhYdXrWaeNsiiP3A8CdMVbmJ4YKDRVPzVMJey9CUrKPf9u6YVYGg8mRnNopeiAfJVzi1v1Hr36Htx9CrVDnc5aautRjFPyzGCFPsM1tfiJutBpSJyNRamEL2BvTTUq8ZZiG2k8eKTtiE5WLk8fHHaeAzh8a5ehDFuRR93ZtZGh4QP5ykQZwkDk98H8vLe1JLKDYrzVjyhTFZAFSMMagQe41Yq3EbW8f9Qgj3T96DZdbYHi3iNnS6sAWXtHx7oVY9KhwZb5nV1WAdXoDTB9zkAMoLRctkM2fe8LTHEoJXVawDikQRGFRNKkLwzuWqtfKLGKEpRoSMLZAB96thVsBmba1TguW5rXGQRKYaeoZvxcBPaFC7vW9vVcm8h9wHvBrLvcPjDWFYtSvGzEjVQVdzUR6eshyoCupmE3nztsJQjY1uc54zAe3ZdA93ncdm4ejrqCGG5MD6XVSjcejqj951XTXtqEATn3WjNYAqvP6dGN4yxeMEgrsiZFLewucYYtvQFZgq3ZGSKwioS44m4B5mKrdPcDqYqX7oA6VX2JpdSDJ
////////////////////


/////ErgoTree/////
//1014040208cd03e0cec0822ad82f91a141a1333551fc448e7c9921ca2989569d5e2aaf0e5c420a04000404040004000580dac4090502050204000502010104000402040004000502040004000402d808d601b2a5730000d60293c27201d07301d603e4c6a7040c410ed604db6308a7d605b2a5730200d606e4c67205040c410ed607e4c6a7054d0ed608e4c67205054d0e957202d806d609b2a5730300d60ae4c672090404d60bb2db63087209730400d60cb27204730500d60d8c720c01d60e8c720c02d1ededededededededed720292c17201730693c272098cb27203720a0002ed938c720b01720d938c720b02730793c27205c2a792c17205c1a79591720e7308d801d60fb2db63087205730900ed938c720f0299720e730a938c720f01720d730b93b3b47203730c720ab472039a720a730db1720372069372077208ed94720e8c72070293720d8c720701d803d609b2db63087205730e00d60ab27204730f00d60bb17203d1edededed93c27205c2a792c17205c1a7ed938c7209029a8c720a027310938c7209018c720a01ed93b472067311720bb472037312720b93b172069a720b73139372077208
//////////////////////


/////ErgoTree Blake2b256 Hash Hex/////
//765237a71b426b379adff61a613bf3d462a7dd0767b71ae8a907032d53e79905
//////////////////////