// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title VotingPhases contract.
 * @dev Library to handle voting phases.
 */
library VotingPhases {
    enum Phase {
        NotStarted,
        Commit,
        Reveal,
        Ended
    }

    /**
     * @dev Gets the current voting phase based on the start time and durations.
     * @param _startTime The timestamp when voting started.
     * @param _commitDuration The duration of the commit phase.
     * @param _revealDuration The duration of the reveal phase.
     * @return The current phase of the voting process.
     */
    function getPhase(
        uint256 _startTime,
        uint256 _commitDuration,
        uint256 _revealDuration
    ) internal view returns (Phase) {
        if (_startTime == 0) return Phase.NotStarted;

        uint256 commitEnd = _startTime + _commitDuration;
        uint256 revealEnd = commitEnd + _revealDuration;

        if (block.timestamp < commitEnd) return Phase.Commit;
        if (block.timestamp < revealEnd) return Phase.Reveal;
        return Phase.Ended;
    }
}
