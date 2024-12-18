import { ethers } from "hardhat";

export interface VoteData {
    vote: boolean;
    secret: string;
    commitment: string;
}

export async function createVoteCommitment(vote: boolean): Promise<VoteData> {
    // Use ethers to generate a more consistent secret
    const secret = ethers.hexlify(ethers.randomBytes(32));
    
    // Use the same encoding method as in the smart contract
    const commitment = ethers.solidityPackedKeccak256(
        ["bool", "bytes32"],
        [vote, secret]
    );
    
    return { vote, secret, commitment };
}

export async function moveToPhase(duration: number) {
    await ethers.provider.send("evm_increaseTime", [duration]);
    await ethers.provider.send("evm_mine", []);
}