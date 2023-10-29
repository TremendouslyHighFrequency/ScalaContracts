{
	val withdrawFee         = 10000000L
	val saleSuccessorScript = fromBase16("634c21eb3645646001b59a1e918116937b2ebac218e367af4c44f3b404412283")
	val terminationScript   = fromBase16("765237a71b426b379adff61a613bf3d462a7dd0767b71ae8a907032d53e79905")
	val swampAudioNode      = PK("9iAp6nJugJciwfZK5rDt4civh4jnnT13j4fXoBLqscC7GRbpt5s").propBytes

	val heldERG0           = SELF.value
	val heldTokens0        = SELF.tokens
	val initialShares      = SELF.R4[Coll[(Long,Coll[Byte])]].get
	val initialTokenList   = SELF.R5[Coll[Coll[Byte]]].get
	val initialTokenAmount = SELF.R6[Long].get

	val successor = OUTPUTS(0)

	val heldERG1         = successor.value
	val heldTokens1      = successor.tokens
	val finalShares      = successor.R4[Coll[(Long,Coll[Byte])]].get
	val finalTokenList   = successor.R5[Coll[Coll[Byte]]].get
	val finalTokenAmount = successor.R6[Long].get

	val deltaERG = heldERG1 - heldERG0

    val validSelfSuccessorScript = successor.propositionBytes == SELF.propositionBytes

	val validDeltaERG = deltaERG >= 0

	val slicedInitialTokens = heldTokens0.slice(0, heldTokens0.size) // Needed because comparison doesnt work without slicing
	val slicedFinalTokens   = heldTokens1.slice(0, heldTokens0.size)

	val validDeltaTokens = slicedInitialTokens == slicedFinalTokens

	val validRegisters = initialShares == finalShares && initialTokenList == finalTokenList && initialTokenAmount == finalTokenAmount

	val validDeposit = (
		validSelfSuccessorScript &&
		validDeltaERG &&
		validDeltaTokens &&
		validRegisters
	)

	val validSaleSuccessorScript = blake2b256(successor.propositionBytes) == saleSuccessorScript

	val validSuccessorTokens = initialTokenList.forall {
		(id: Coll[Byte]) => successor.tokens.exists {
			(token: (Coll[Byte], Long)) => token(0) == id && token(1) >= finalTokenAmount
		}
	}

	val terminationConditions = if(OUTPUTS.size > 2 && OUTPUTS(1).tokens.size > 0 && OUTPUTS(1).R7[Coll[(Long,Coll[Byte])]].isDefined) {
		val termination = OUTPUTS(1)

		val terminationToken   = termination.tokens(0)
		val terminationParties = termination.R7[Coll[(Long,Coll[Byte])]].get // R4-R6 Occupied In Asset Creation

		val withdrawalRegister = successor.R7[(Coll[Byte], Long)].get

		val validTerminationScript  = blake2b256(termination.propositionBytes) == terminationScript
		val validToken              = terminationToken._1 == SELF.id && terminationToken._2 == terminationParties.size
		val validParties            = terminationParties == initialShares
		val validWithdrawalRegister = withdrawalRegister == terminationToken

		validTerminationScript && validToken && validParties && validWithdrawalRegister
	} else { false }

	val validSaleCombine = (
		validSaleSuccessorScript &&
		validSuccessorTokens &&
		validRegisters &&
		terminationConditions
	)

	val swampAudioBox = OUTPUTS(1)

	val validSwampAudioScript = swampAudioBox.propositionBytes == swampAudioNode

	val validSwampValue = swampAudioBox.value >= withdrawFee

	val withdrawBoxConditions = if (OUTPUTS.size > 3) {
		val withdrawBox = OUTPUTS(2)

		val providedWithdrawIndex = withdrawBox.R4[Int].get

		val validWithdrawScript = withdrawBox.propositionBytes == initialShares(providedWithdrawIndex)(1)

		val validWithdrawTokens = withdrawBox.tokens(0)._1 == initialTokenList(providedWithdrawIndex) && withdrawBox.tokens(0)._2 >= initialTokenAmount

		val filteredWithdrawInitialTokens = slicedInitialTokens.filter{
			(token: (Coll[Byte], Long)) => token(0) != initialTokenList(providedWithdrawIndex)
		}
		val filteredWithdrawFinalTokens = slicedFinalTokens.filter{
			(token: (Coll[Byte], Long)) => token(0) != initialTokenList(providedWithdrawIndex)
		}

		val validSuccessorWithdrawnTokens = filteredWithdrawInitialTokens == filteredWithdrawFinalTokens

		validWithdrawScript && validWithdrawTokens && validSuccessorWithdrawnTokens
	} else { false }

	val validWithdraw = (
		validSwampAudioScript &&
		validSwampValue &&
		withdrawBoxConditions &&
		validRegisters &&
		validSelfSuccessorScript &&
		validDeltaERG

	)

	sigmaProp(
		validDeposit ||
		validSaleCombine ||
		validWithdraw
	)
}

/////P2S ADDRESS/////
//3t1iNtPxr2Bxieb5MyGSHWCQfNJrvAkEqoyX6bkZJhuVM6wurEVV3KJGbnuWmJiqtWmjBBrAj4Ssd91KZxeoxDxbZRDCpPe7Rpp1JUGAJbSzuHT2CjcPGMiXrK71Y8USPaMFbiRqEkRZdBXykwehoprhuhMmrAQzHs3tMJ5AtQknNU8tyAh1ChUti5DE1BBWoeK3vevzDysjTkTbBHJJaYpfCb2BojTsUGiqhfXMq9GyXCGPLMUs1VDwUoVykmsHh8Cfim6ZAwVSehDQZvwZTRtySuPDu4GYBcJ5VbtxNug1U2UDEsLTBXRjV87cC1tasPFXHnSioP823DfRTEV7vaskM25sWUfnJKRN3v9C5XTNfmu588PdvBNLGY8jPrH44n87WYTgMshQNPXqyWGu27vHA2FnQVxqA9NCw6ucTZiseGkb57uaa9HJgNVRYh2pe2jjZYCDhiwR6MuSQUTgmrE8PXC6WfbVigyWj8J9c6bqEYt6Yu8E5YRt9i7HuSDjURSiYCHakT16XtHRZmx6i88ttjigwf4p7R2XNVqnoRjxAovGKbX9GDfcG5GLJWsbCJCybPevNQFbajuSBk6XjEx2FQEG6YU8sB5zSvo7SrT8ox8edhPQejHAfz5JXvWnC2J28EBG1PUyzjCnvsvo6Jktfpq2UHFmMC39qDBwjXdjTVUgvwpVrvbZ2p7dxcnPomM2ciZ5Uf56MnWTQpqSmmbvP1SRyEhFXcBBekrQwecZW2y6Frkc1AZ1kpBNFHGcVgKaRND2CnhmMhc4fPqb4
////////////////////

/////ErgoTree/////
//1014040005000400040004020e20634c21eb3645646001b59a1e918116937b2ebac218e367af4c44f3b4044122830404040204000402040204000e20765237a71b426b379adff61a613bf3d462a7dd0767b71ae8a907032d53e79905010008cd03e0cec0822ad82f91a141a1333551fc448e7c9921ca2989569d5e2aaf0e5c420a0580dac4090406040404000100d810d601b2a5730000d602c27201d603937202c2a7d6049299c17201c1a77301d605db6308a7d606b17205d607b4720573027206d608db63087201d609b4720873037206d60ae4c6a7040c410ed60be4c6a7051ad60ce4c6a70605d60de4c672010605d60eeded93720ae4c67201040c410e93720be4c67201051a93720c720dd60fb1a5d610b2a5730400d1ececededed720372049372077209720eededed93cb72027305af720bd901110eae7208d901134d0eed938c7213017211928c721302720d720e95eded91720f730691b1db6308b2a57307007308e6c6b2a5730900070c410ed803d611b2a5730a00d612b2db63087211730b00d613e4c67211070c410eededed93cbc27211730ced938c721201c5a7938c7212027eb1721305937213720a93e4c67201074d0e7212730dededededed93c27210d0730e92c17210730f9591720f7310d804d611b2a5731100d612e4c672110404d613b2db63087211731200d614b2720b721200eded93c272118cb2720a72120002ed938c7213017214928c721302720c93b57207d901154d0e948c7215017214b57209d901154d0e948c72150172147313720e72037204
/////////////////////

/////ErgoTree Blake2b256 Hash Hex/////
//26167dc4391a9b6fd834808e1d3ae7ce41cf51ac60627e7cde78f572d11a6876
//////////////////////