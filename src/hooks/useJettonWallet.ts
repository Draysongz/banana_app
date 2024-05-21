
import {
    Address,
    Sender,
    beginCell,
    toNano,
    ContractProvider,
    OpenedContract,
} from '@ton/core'
import { NotcoinFarmFactory } from '../contracts/NotcoinFarmFactory'
import { JettonWallet } from '../contracts/JettonWallet'
import { JettonMinter } from '../contracts/JettonMinter'
import { NotcoinFarmWallet } from '../contracts/NotcoinFarmWallet'
import { useTonClient } from './useTonClient'
import { useTonConnect } from './useTonConnect'
import { useState, useEffect } from 'react'
import { useAsyncInitialze } from './useAsyncInitialize'
import { getUserJettonAddr } from '@/contracts/FarmConstants'

const testAddrJettonMinter = Address.parse(
    'EQBF-Uf-wl8ZW_Kq0WoTGJP87CDSU6IJvn5KaF6k6pBaG47W',
)

const notcoinFarmFactoryAddress = Address.parse(
    'EQDZjv_4bIvYdO6T6gScvP9IH6_LvC5TZJpzynDyAHIUzz26',
)




export function useJettonWallet (){
  const client = useTonClient()
  const {sender, userAddress} = useTonConnect()

  const [userJettonWalletAddress, setUserJettonWalletAddress] =
    useState<null | Address>();

    const jettonMinter = useAsyncInitialze(async ()=>{
      const jettonMinterContract = new JettonMinter(testAddrJettonMinter);

      return client?.open(jettonMinterContract) as OpenedContract<JettonMinter>
    }, [client]);


     useEffect(() => {
    async function getUserJettonWalletAddress() {
      if (!jettonMinter) return;
      if (!userAddress) return;
      setUserJettonWalletAddress(null);
      const jettonAddress = await jettonMinter.getWalletAddress(
        Address.parse(userAddress)
      );
      setUserJettonWalletAddress(jettonAddress);
    }

    getUserJettonWalletAddress();
  }, [userAddress, jettonMinter]);


    const jettonWallet = useAsyncInitialze(async () => {
    if (!client) return;
    if (!userJettonWalletAddress) return;
    const jettonWalletC = client.open(JettonWallet.createFromAddress(userJettonWalletAddress))

    return jettonWalletC
  }, [client, userJettonWalletAddress]);

  const openFarmFactoryContract = (client)=>{
    const fc = client?.open(NotcoinFarmFactory.createFromAddress(notcoinFarmFactoryAddress))
    return fc
  }

  const getUserFarmWalletAddr = async ()=>{
    const notcoinFarmFactory =  openFarmFactoryContract(client)

    const balance = await notcoinFarmFactory.getTotalStakedBalance()

    const notCoinFarmWalletAddress = await notcoinFarmFactory.getUserNotcoinFarmWalletAddress(sender.address)

    return {balance, notCoinFarmWalletAddress}
  }


  const farmWalletContract = async ()=>{
    const {notCoinFarmWalletAddress} = await getUserFarmWalletAddr()
    const farmWallet = client?.open(NotcoinFarmWallet.createFromAddress(notCoinFarmWalletAddress))

    return farmWallet;
  }

  const getStakedBalace = async ()=>{
    
    const staked_balance = (await farmWalletContract()).getFarmWalletData()
    console.log(staked_balance)

    return {staked_balance}
  }

  const initializeNotcoinWallet = async ()=>{
    await openFarmFactoryContract(client).sendInitializeFarmWallet(
      sender,
      toNano('0.5'),
      userJettonWalletAddress
    )
  }

 

  return{
    sendStake : async ()=>{
      const {balance, notCoinFarmWalletAddress} = await getUserFarmWalletAddr()
      try {
        console.log(
          "from useJettonWallet",
          userAddress,
          userJettonWalletAddress?.toString()
        );
        await initializeNotcoinWallet()
        return await jettonWallet?.sendTransfer(
          sender,
          toNano("0.1"),
          toNano("10000"),
          notCoinFarmWalletAddress,
          sender.address,
          beginCell().endCell(),
          toNano("0.05"),
          beginCell().endCell()
        )
    }catch(error){
      console.log(error)
    }
  },

  getStakedAmount : async()=>{
    const {staked_balance} = await getStakedBalace()
    console.log(staked_balance)
    return {staked_balance}
  },

  unstake : async ()=>{
    const {balance, notCoinFarmWalletAddress} = await getUserFarmWalletAddr()
      const { userJettonWalletAddr } = await getUserJettonAddr(
        client,
        notCoinFarmWalletAddress,
    )
    console.log('userJettonWallet', userJettonWalletAddr)
    try{
       const farmWallet = await farmWalletContract()
       farmWallet.sendUnstake(
        toNano('0.05'),
        sender,
        userJettonWalletAddr,
        toNano('5000')
       )
    }catch(error){
      console.log(error)
    }
  }
}
}

