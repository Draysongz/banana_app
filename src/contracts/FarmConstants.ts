import { Address } from "@ton/core";
import { NotcoinFarmFactory } from "./NotcoinFarmFactory";
import { NotcoinFarmWallet } from "./NotcoinFarmWallet";
import { JettonMinter } from "./JettonMinter";
import { JettonWallet } from "./JettonWallet";
import { TonClient } from "@ton/ton";

abstract class Op {
  static stake_notification = 120;
  static unstake = 121;
  static unstake_notification = 123;
  static claim_rewards_notification = 200;
  static claim_rewards = 201;
  static compound = 400;
  static compound_notification = 501;
  static withdraw_token = 600;
  static withdraw_excess_ton = 900;
  static sent_data = 991;
  static initialize_contract = 130;
  static update_factory_data = 144;
}

const testAddrJettonMinter = Address.parse(
  "EQBF-Uf-wl8ZW_Kq0WoTGJP87CDSU6IJvn5KaF6k6pBaG47W"
);

const notcoinFarmFactoryAddress = Address.parse(
  "EQABX8937PTJzqbEBChEXAU3sCxA0xSWuwsNV2PcYAadIV5A"
);
// open farm factory contract
function openFarmFactory(provider: TonClient) {
  if (!provider) return;
  const fc = provider.open(
    NotcoinFarmFactory.createFromAddress(notcoinFarmFactoryAddress)
  );

  return fc;
}

// get farm wallet addr from farm Factory
async function getUserFarmWalletAddr(
  provider: TonClient,
  userAddress: Address
) {
  if (!provider) return;
  const notcoinFarmFactory = openFarmFactory(provider);

  try {
    const farmWalletAddress =
      await notcoinFarmFactory.getUserNotcoinFarmWalletAddress(userAddress);
    return { farmWalletAddress };
  } catch (err) {
    console.log(err);
  }
}

// open farm wallet contract
function openFarmWallet(provider: TonClient, farmWalletAddr: Address) {
  if (!provider) return;
  const farmWallet = provider.open(
    NotcoinFarmWallet.createFromAddress(farmWalletAddr)
  );

  return farmWallet;
}

function openJettonMinter(provider: TonClient) {
  if (!provider) return;
  const minter = provider.open(
    JettonMinter.createFromAddress(testAddrJettonMinter)
  );
  return minter;
}

// get jettonWallet Address from jetton minter
async function getUserJettonAddr(provider: TonClient, userAddress: Address) {
  if (!provider) return;
  const minter = openJettonMinter(provider);

  try {
    const jettonWalletAddr = await minter.getWalletAddress(userAddress);

    return { jettonWalletAddr };
  } catch (err) {
    console.log(err);
  }
}

// open jetton wallet Contract
function openJettonWallet(provider: TonClient, jettonWalletAddr: Address) {
  if (!provider) return;
  const jettonWallet = provider.open(
    JettonWallet.createFromAddress(jettonWalletAddr)
  );

  return jettonWallet;
}

export {
  Op,
  testAddrJettonMinter,
  notcoinFarmFactoryAddress,
  openFarmFactory,
  getUserFarmWalletAddr,
  openFarmWallet,
  getUserJettonAddr,
  openJettonWallet,
};
