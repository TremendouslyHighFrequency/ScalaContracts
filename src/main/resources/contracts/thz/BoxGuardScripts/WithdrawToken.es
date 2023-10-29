{
	val swampAudioNode = PK("9iAp6nJugJciwfZK5rDt4civh4jnnT13j4fXoBLqscC7GRbpt5s").propBytes
	val withdrawFee    = 10000000L

	val initialWithdrawalTokens = SELF.tokens
	val tokenOwners             = SELF.R7[Coll[(Long,Coll[Byte])]].get

	val swampAudioBox = OUTPUTS(0)
	val withdrawalBox = OUTPUTS(1)
	val successor     = OUTPUTS(2)

	val tokenIndex = withdrawalBox.R4[Int].get

	val finalTokenOwners      = successor.R7[Coll[(Long,Coll[Byte])]].get

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

	sigmaProp(
		validSwampAudioScript &&
		validSwampValue &&
		validWithdrawalScript &&
		validWithdrawAmount &&
		validSuccessorScript &&
		validSuccessorValue &&
		validSuccesorTokens &&
		validSuccessorOwners
		)
}


/////P2S ADDRESS/////
//21oYSnAR2gg1482FzBwcC2Yjx9KCgmPtQW7NfV5Rx2a3UTtHJDuncyGDCzn2nsoHn2wH1niwTXaRJotGckDA99DED6atgf7LNojSquHiUGphw3dq9fQJ1ntpPJFGaUdfSyvjJnAm18TomyupMZ9SDtD1dewhYa7pvthpcYGCM1Z7d1M37gKJgQi8DCrkGpNDNzpECpiKi5ZSTMv3iZTNXpnWss5ng9mWtYUJdBJoGggNgDA27N5KU5Kv14idX5V5KuUyXqWnJYujEnCWvPbmceKWPTDsKbwqHfq5j9nXLiaDjBqEkRHXc6QL7xwDqAH9UXgyZUKorsizBtnTH3rJ82f5byXnYjjkQJCLe6KiBQYhRLFPL2
////////////////////

/////ErgoTree/////
//100e0400040204000400040408cd03e0cec0822ad82f91a141a1333551fc448e7c9921ca2989569d5e2aaf0e5c420a0580dac4090502050204000502010104000402d809d601b2a5730000d602b2a5730100d603e4c6a7070c410ed604e4c672020404d605b2db63087202730200d606b2db6308a7730300d6078c720601d608b2a5730400d6098c720602d1ededededededed93c27201d0730592c17201730693c272028cb2720372040002ed938c7205017207938c720502730793c27208c2a792c17208c1a7959172097308d801d60ab2db63087208730900ed938c720a02997209730a938c720a017207730b93b3b47203730c7204b472039a7204730db17203e4c67208070c410e
/////////////////////

/////ErgoTree Blake2b256 Hash Hex/////
//68cf77da657c3cc2b18a3cd0b05764f6dd0a0aa7b660c7b63a79c6f03f380e41
//////////////////////
