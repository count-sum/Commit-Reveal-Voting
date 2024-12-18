// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./VotingPhases.sol";
import "./VoterRegistry.sol";
import "./CommitRevealLogic.sol";

/**
 * @title CommitRevealVoting.
 * @dev Main contract that orchestrates the commit-reveal voting process.
 */
contract CommitRevealVoting {
    using VotingPhases for VotingPhases.Phase;

    VoterRegistry public voterRegistry;
    CommitRevealLogic public commitRevealLogic;

    uint256 public votingStart;
    uint256 public commitDuration;
    uint256 public revealDuration;

    /**
     * @dev Emitted when voting starts.
     * @param startTime The timestamp when voting starts.
     * @param commitEnd The timestamp when the commit phase ends.
     * @param revealEnd The timestamp when the reveal phase ends.
     */
    event VotingStarted(
        uint256 startTime,
        uint256 commitEnd,
        uint256 revealEnd
    );

    /**
     * @dev Emitted when voting ends.
     * @param yesVotes The total number of yes votes.
     * @param noVotes The total number of no votes.
     */
    event VotingEnded(uint256 yesVotes, uint256 noVotes);

    /**
     * @dev Constructor to initialize the contract with commit and reveal durations.
     * @param _commitDuration Duration of the commit phase.
     * @param _revealDuration Duration of the reveal phase.
     */
    constructor(uint256 _commitDuration, uint256 _revealDuration) {
        voterRegistry = new VoterRegistry();
        commitRevealLogic = new CommitRevealLogic();
        commitDuration = _commitDuration;
        revealDuration = _revealDuration;
    }

    /**
     * @dev Starts the voting process.
     * Emits a VotingStarted event.
     */
    function startVoting() external {
        require(votingStart == 0, "Voting already started");
        votingStart = block.timestamp;
        emit VotingStarted(
            votingStart,
            votingStart + commitDuration,
            votingStart + commitDuration + revealDuration
        );
    }

    /**
     * @dev Commits a vote by the sender.
     * @dev Must be in the commit phase. Sender must be a registered voter
     * @param _commitment The hash of the vote and the secret.
     */
    function commitVote(bytes32 _commitment) external {
        require(isCommitPhase(), "Not in commit phase");
        require(voterRegistry.isRegistered(msg.sender), "Voter not registered");
        commitRevealLogic.commit(msg.sender, _commitment);
    }

    /**
     * @dev Reveals a vote by the sender.
     * @dev Must be in the reveal phase.
     * @param _vote The actual vote (true for yes, false for no).
     * @param _secret The secret used to hash the vote during commitment.
     */
    function revealVote(bool _vote, bytes32 _secret) external {
        require(isRevealPhase(), "Not in reveal phase");
        commitRevealLogic.reveal(msg.sender, _vote, _secret);
    }

    /**
     * @dev Gets the results of the voting.
     * @dev Voting must have ended.
     * @return yesVotes The total number of yes votes.
     * @return noVotes The total number of no votes.
     */
    function getResults()
        external
        view
        returns (uint256 yesVotes, uint256 noVotes)
    {
        require(isVotingEnded(), "Voting not ended");
        return commitRevealLogic.getResults();
    }

    /**
     * @dev Registers a voter.
     * @param _voter The address of the voter to register.
     */
    function registerVoter(address _voter) external {
        voterRegistry.register(_voter);
    }

    /**
     * @dev Checks if the current phase is the commit phase.
     * @return True if in the commit phase, false otherwise.
     */
    function isCommitPhase() public view returns (bool) {
        return
            votingStart > 0 &&
            block.timestamp >= votingStart &&
            block.timestamp < votingStart + commitDuration;
    }

    /**
     * @dev Checks if the current phase is the reveal phase.
     * @return True if in the reveal phase, false otherwise.
     */

    function isRevealPhase() public view returns (bool) {
        return
            votingStart > 0 &&
            block.timestamp >= votingStart + commitDuration &&
            block.timestamp < votingStart + commitDuration + revealDuration;
    }

    /**
     * @dev Checks if the voting has ended.
     * @return True if voting has ended, false otherwise.
     */
    function isVotingEnded() public view returns (bool) {
        return
            votingStart > 0 &&
            block.timestamp >= votingStart + commitDuration + revealDuration;
    }
}
