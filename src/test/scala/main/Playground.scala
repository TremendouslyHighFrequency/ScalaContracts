package main

import contracts.THZContracts
import execute.Client
import org.ergoplatform.appkit.Address
import scorex.crypto.encode.Base16
import scorex.crypto.hash
import utils.ContractCompile

object Playground extends App {
  println("Hello World!")
}

object printContract extends App {
  val client = new Client()
  client.setClient()
  val ctx = client.getContext
  val compiler = new ContractCompile(ctx)

  val indicationToWithdrawScript = THZContracts.IndicationToWithdraw.contractScript
  val indicationToWithdrawContract = compiler.compileDummyContract(indicationToWithdrawScript) // compile(INDICATION_TO_WITHDRAW_TEMPLATE, { version: 0, includeSize: false });
  val indicationToWithdrawnAddress = indicationToWithdrawContract.toAddress.toString
  val indicationToWithdrawErgoTree = indicationToWithdrawContract.getErgoTree.bytes
  val indicationToWithdrawErgoTreeHex = indicationToWithdrawContract.getErgoTree.bytesHex
  val indicationToWithdrawErgoTreeHash = hash.Blake2b256(indicationToWithdrawErgoTree)
  val indicationToWithdrawErgoTreeHashHex = Base16.encode(indicationToWithdrawErgoTreeHash)

  println(s"Indication To Withdraw Contract Address: $indicationToWithdrawnAddress")
  println(s"Indication To Withdraw Contract ErgoTree: $indicationToWithdrawErgoTreeHex")
  println(s"Indication To Withdraw Contract ErgoTree Blake Hash Hex: $indicationToWithdrawErgoTreeHashHex")


  val withdrawTokenScript = THZContracts.WithdrawToken.contractScript
  val withdrawTokenContract = compiler.compileDummyContract(withdrawTokenScript)
  val withdrawTokenAddress = withdrawTokenContract.toAddress.toString
  val withdrawTokenErgoTree = withdrawTokenContract.getErgoTree.bytes
  val withdrawTokenErgoTreeHex = withdrawTokenContract.getErgoTree.bytesHex
  val withdrawTokenErgoTreeHash = hash.Blake2b256(withdrawTokenErgoTree)
  val withdrawTokenErgoTreeHashHex = Base16.encode(withdrawTokenErgoTreeHash)

  println(s"Withdraw Token Contract Address: $withdrawTokenAddress")
  println(s"Withdraw Token Contract ErgoTree: $withdrawTokenErgoTreeHex")
  println(s"Withdraw Token Contract ErgoTree Blake Hash Hex: $withdrawTokenErgoTreeHashHex")


  val SaleScript = THZContracts.Sale.contractScript
  val SaleContract = compiler.compileDummyContract(SaleScript)
  val SaleAddress = SaleContract.toAddress.toString
  val SaleErgoTree = SaleContract.getErgoTree.bytes
  val SaleErgoTreeHex = SaleContract.getErgoTree.bytesHex
  val SaleErgoTreeHash = hash.Blake2b256(SaleErgoTree)
  val SaleErgoTreeHashHex = Base16.encode(SaleErgoTreeHash)

  println(s"Sale Contract Address: $SaleAddress")
  println(s"Sale Contract ErgoTree: $SaleErgoTreeHex")
  println(s"Sale Contract ErgoTree Blake Hash Hex: $SaleErgoTreeHashHex")


  val BootstrapScript = THZContracts.Bootstrap.contractScript
  val BootstrapContract = compiler.compileDummyContract(BootstrapScript)
  val BootstrapAddress = BootstrapContract.toAddress.toString
  val BootstrapErgoTree = BootstrapContract.getErgoTree.bytes
  val BootstrapErgoTreeHex = BootstrapContract.getErgoTree.bytesHex
  val BootstrapErgoTreeHash = hash.Blake2b256(BootstrapErgoTree)
  val BootstrapErgoTreeHashHex = Base16.encode(BootstrapErgoTreeHash)

  println(s"Bootstrap Contract Address: $BootstrapAddress")
  println(s"Bootstrap Contract ErgoTree: $BootstrapErgoTreeHex")
  println(s"Bootstrap Contract ErgoTree Blake Hash Hex: $BootstrapErgoTreeHashHex")


}
