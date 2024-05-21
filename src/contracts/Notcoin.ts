import {
    Contract,
    Cell,
    Address,
    address,
    ContractProvider,
    beginCell,
} from '@ton/core'

export class Notcoin implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Notcoin(address)
    }

    async getNotcoinContractData(
        provider: ContractProvider,
    ) {
        const data = await provider.get(
            'get_jetton_data',
            [],
        )
        return {
            totalSupply: data.stack.readNumber(),
            boolean: data.stack.readNumber(),
            adminAddress: data.stack.readAddress(),
            metadataUri: data.stack.readCell(),
            notcoinJettonWalletCode: data.stack.readCell(),
        }
    }

    async getUserJettonWalletAddress(
        provider: ContractProvider,
        address: Address,
    ) {
        const resp = await provider.get(
            'get_wallet_address',
            [
                {
                    type: 'slice',
                    cell: beginCell()
                        .storeAddress(address)
                        .endCell(),
                },
            ],
        )

        return resp.stack.readAddress()
    }
}
// x{02BA2918C8947E9B25AF9AC1B883357754173E5812F807A3D6E642A14709595395}
