
import { Address } from '@ton/core'
import { NotcoinFarmFactory } from './NotcoinFarmFactory'
import { NotcoinFarmWallet } from './NotcoinFarmWallet'
import { JettonMinter } from './JettonMinter'
import { JettonWallet } from './JettonWallet'

abstract class Op {
    static stake_notification = 120
    static unstake = 121
    static unstake_notification = 123
    static claim_rewards_notification = 200
    static claim_rewards = 201
    static compound = 400
    static compound_notification = 501
    static withdraw_token = 600
    static withdraw_excess_ton = 900
    static sent_data = 991
    static initialize_contract = 130
}

const testAddrJettonMinter = Address.parse(
    'EQBF-Uf-wl8ZW_Kq0WoTGJP87CDSU6IJvn5KaF6k6pBaG47W',
)

const notcoinFarmFactoryAddress = Address.parse(
    'EQDZjv_4bIvYdO6T6gScvP9IH6_LvC5TZJpzynDyAHIUzz26',
)
// open farm factory contract
function openFarmFactoryContract(provider) {
    const fc = provider.open(
        NotcoinFarmFactory.createFromAddress(notcoinFarmFactoryAddress),
    )

    return fc
}

// get farm wallet addr from farm Factory
async function getUserFarmWalletAddr(
    provider,
    userAddress: Address,
) {
    const notcoinFarmFactory = openFarmFactoryContract(provider)

    const notcoinFarmWalletAddress =
        await notcoinFarmFactory.getUserNotcoinFarmWalletAddress(userAddress)
    return { notcoinFarmWalletAddress }
}

// open farm wallet contract
function farmWalletContract(
    provider,
    farmWalletAddr: Address,
) {
    const farmWallet = provider.open(
        NotcoinFarmWallet.createFromAddress(farmWalletAddr),
    )

    return farmWallet
}

// get jettonWallet Address from jetton minter
async function getUserJettonAddr(
    provider,
    userAddress: Address,
) {
    const minter = provider.open(
        JettonMinter.createFromAddress(testAddrJettonMinter),
    )

    const userJettonWalletAddr = await minter.getWalletAddress(userAddress)

    return { userJettonWalletAddr }
}

// open jetton wallet Contract
function jettonWalletContract(
    provider,
    jettonWalletAddr: Address,
) {
    const jettonWallet = provider.open(
        JettonWallet.createFromAddress(jettonWalletAddr),
    )

    return jettonWallet
}

export {
    Op,
    testAddrJettonMinter,
    notcoinFarmFactoryAddress,
    openFarmFactoryContract,
    getUserFarmWalletAddr,
    farmWalletContract,
    getUserJettonAddr,
    jettonWalletContract,
}
