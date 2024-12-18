import { ethers } from 'hardhat';
import { TestContext } from './types';
import { VoterRegistry } from '../../typechain-types/VoterRegistry';
import { CommitRevealLogic } from '../../typechain-types/CommitRevealLogic';
import { CommitRevealVoting } from '../../typechain-types/CommitRevealVoting';

export async function setupTest(): Promise<TestContext> {
    const [owner, ...voters] = await ethers.getSigners();

    const CommitRevealVotingFactory = await ethers.getContractFactory('CommitRevealVoting');
    const voting = (await CommitRevealVotingFactory.deploy(
        3600, // 1 hour commit phase
        3600 // 1 hour reveal phase
    )) as CommitRevealVoting;

    // Get the VoterRegistry address from the voting contract
    const voterRegistryAddress = await voting.voterRegistry();
    const VoterRegistryFactory = await ethers.getContractFactory('VoterRegistry');
    const voterRegistry = VoterRegistryFactory.attach(voterRegistryAddress) as VoterRegistry;

    // Get the CommitRevealLogic address from the voting contract
    const commitRevealLogicAddress = await voting.commitRevealLogic();
    const CommitRevealLogicFactory = await ethers.getContractFactory('CommitRevealLogic');
    const commitRevealLogic = CommitRevealLogicFactory.attach(
        commitRevealLogicAddress
    ) as CommitRevealLogic;

    return {
        owner,
        voters,
        contracts: {
            voting,
            voterRegistry,
            commitRevealLogic,
        },
        durations: {
            commit: 3600,
            reveal: 3600,
        },
    };
}
