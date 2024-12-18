import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { CommitRevealVoting, VoterRegistry, CommitRevealLogic } from "../../typechain-types";

export interface Contracts {
    voting: CommitRevealVoting;
    voterRegistry: VoterRegistry;
    commitRevealLogic: CommitRevealLogic;
}

export interface TestContext {
    contracts: Contracts;
    owner: SignerWithAddress;
    voters: SignerWithAddress[];
    durations: {
        commit: number;
        reveal: number;
    };
}