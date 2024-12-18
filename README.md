# Commit-Reveal Voting Smart Contract

This is a secure implementation of a voting system using the commit-reveal scheme in Solidity. The system ensures vote privacy during the voting period and prevents vote manipulation.

## Architecture

The system is split into several contracts, each with a specific responsibility:

1. **CommitRevealVoting.sol**: Main contract that orchestrates the voting process
2. **VotingPhases.sol**: Library handling the different phases of voting
3. **VoterRegistry.sol**: Manages voter registration
4. **CommitRevealLogic.sol**: Handles the commit-reveal voting logic

## How It Works

The voting process has three phases:

1. **Commit Phase**: 
   - Voters submit a hash (commitment) of their vote and a secret
   - The actual vote remains hidden during this phase
   
2. **Reveal Phase**:
   - Voters reveal their vote and secret
   - The contract verifies that the hash matches the original commitment
   
3. **Results Phase**:
   - After the reveal phase ends, anyone can query the results

## Usage

### For Voters

1. Register as a voter:
```solidity
await voting.registerVoter(voterAddress);
```

2. Create a commitment:
```solidity
const secret = ethers.utils.randomBytes(32);
const commitment = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
        ["bool", "bytes32"],
        [voteChoice, secret]
    )
);
```

3. Submit your commitment during the commit phase:
```solidity
await voting.commitVote(commitment);
```

4. Reveal your vote during the reveal phase:
```solidity
await voting.revealVote(voteChoice, secret);
```

### For Admin

1. Deploy the contract:
```solidity
const voting = await CommitRevealVoting.deploy(commitDuration, revealDuration);
```

2. Start the voting:
```solidity
await voting.startVoting();
```

3. Get results after voting ends:
```solidity
const [yesVotes, noVotes] = await voting.getResults();
```

## Security Features

- Vote privacy during commit phase
- Prevention of vote manipulation
- Immutable vote commitments
- Verifiable vote reveals
- Phase-based access control

## Testing

Run the tests using:
```bash
npx hardhat test
```