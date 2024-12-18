// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title CommitRevealLogic contract.
 * @dev Handles the commit-reveal voting logic.
 */
contract CommitRevealLogic {
    /**
     * @notice
     * @param commitment The commitment hash of the vote.
     * @param revealed Indicates if the vote has been revealed.
     * @param vote The actual vote (true for yes, false for no).
     */
    struct Vote {
        bytes32 commitment;
        bool revealed;
        bool vote;
    }

    //// @notice Mapping of voter addresses to their votes.
    mapping(address user => Vote voteStruct) public votes;

    //// @notice Total number of yes and no votes.
    uint256 public yesVotes;
    uint256 public noVotes;

    /**
     * @dev Emitted when a vote is committed.
     * @param voter The address of the voter.
     * @param commitment The commitment hash of the vote.
     */
    event VoteCommitted(address indexed voter, bytes32 commitment);

    /**
     * @dev Emitted when a vote is revealed.
     * @param voter The address of the voter.
     * @param vote The actual vote (true for yes, false for no).
     */
    event VoteRevealed(address indexed voter, bool vote);

    /**
     * @dev Commits a vote for a voter.
     * @dev The voter must not have already committed a vote.
     * @param _voter The address of the voter.
     * @param _commitment The commitment hash of the vote.
     */
    function commit(address _voter, bytes32 _commitment) external {
        require(votes[_voter].commitment == bytes32(0), "Already committed");
        votes[_voter].commitment = _commitment;
        emit VoteCommitted(_voter, _commitment);
    }

    /**
     * @dev Reveals a vote for a voter.
     * @dev The vote must not have been revealed already. The commitment must match
     * the hash of the vote and secret.
     * @param _voter The address of the voter.
     * @param _vote The actual vote (true for yes, false for no).
     * @param _secret The secret used to hash the vote during commitment.
     */
    function reveal(address _voter, bool _vote, bytes32 _secret) external {
        require(!votes[_voter].revealed, "Vote already revealed");
        require(
            votes[_voter].commitment ==
                keccak256(abi.encodePacked(_vote, _secret)),
            "Invalid reveal"
        );

        votes[_voter].revealed = true;
        votes[_voter].vote = _vote;

        if (_vote) {
            yesVotes++;
        } else {
            noVotes++;
        }

        emit VoteRevealed(_voter, _vote);
    }

    /**
     * @dev Gets the results of the voting.
     * @return The total number of yes votes and no votes.
     */
    function getResults() external view returns (uint256, uint256) {
        return (yesVotes, noVotes);
    }
}
