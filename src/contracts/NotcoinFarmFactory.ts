import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from "@ton/core";
import { Op } from "./FarmConstants";

export type NotcoinFarmFactoryConfig = {
  admin_address: Address;
  notcoin_farm_wallet_code: Cell;
};

export function notcoinFarmFactoryConfigToCell(
  config: NotcoinFarmFactoryConfig
): Cell {
  return beginCell()
    .storeCoins(0) // total staked balance
    .storeCoins(0)
    .storeAddress(config.admin_address)
    .storeRef(config.notcoin_farm_wallet_code)
    .storeRef(beginCell().endCell())
    .endCell();
}

export class NotcoinFarmFactory implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new NotcoinFarmFactory(address);
  }

  static createFromConfig(
    config: NotcoinFarmFactoryConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = notcoinFarmFactoryConfigToCell(config);
    const init = { code, data };
    return new NotcoinFarmFactory(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendInitializeFarmWallet(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    jtAddr: Address
  ) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(101, 32).storeAddress(jtAddr).endCell(),
    });
  }

  async sendUpdateFactoryData(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    jtAddr: Address
  ) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Op.update_factory_data, 32)
        .storeAddress(jtAddr)
        .endCell(),
    });
  }

  async getUserNotcoinFarmWalletAddress(
    provider: ContractProvider,
    address: Address
  ): Promise<Address> {
    const resp = await provider.get("get_user_notcoin_farm_wallet_address", [
      {
        type: "slice",
        cell: beginCell().storeAddress(address).endCell(),
      },
    ]);

    return resp.stack.readAddress();
  }

  async getTotalStakedBalance(provider: ContractProvider): Promise<number> {
    const resp = await provider.get("get_total_staked_balance", []);
    return resp.stack.readNumber();
  }
}
