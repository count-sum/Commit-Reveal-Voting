// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title VoterRegistry contract.
 * @dev Manages voter registration.
 */
contract VoterRegistry {
    //// @notice Mapping of registered voters.
    mapping(address voter => bool registered) public registeredVoters;

    /// @dev Emitted when a voter is registered.
    /// @param voter The address of the registered voter.
    event VoterRegistered(address indexed voter);

    /**
     * @dev Registers a voter.
     * @dev The voter must not be already registered
     * @param _voter The address of the voter to register.
     */
    function register(address _voter) external {
        require(!registeredVoters[_voter], "Voter already registered");
        registeredVoters[_voter] = true;
        emit VoterRegistered(_voter);
    }

    /**
     * @dev Checks if a voter is registered.
     * @param _voter The address of the voter to check.
     * @return True if the voter is registered, false otherwise.
     */
    function isRegistered(address _voter) external view returns (bool) {
        return registeredVoters[_voter];
    }
}
