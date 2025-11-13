// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Ownership {
    struct OwnerRecord {
        address ownerAddress;
        string ownerName;
        uint256 timestamp;
    }

    // RFID => list of owners (history)
    mapping(string => OwnerRecord[]) private ownershipHistory;
    
    // Access control: only authorized contracts can add owners
    address public registry;

    event OwnershipTransferred(
        string indexed rfid,
        address indexed newOwner,
        string ownerName,
        uint256 timestamp
    );

    constructor(address _registry) {
        registry = _registry;
    }

    modifier onlyRegistry() {
        require(msg.sender == registry, "Only registry can call this function");
        _;
    }

    // Add new owner (first owner or transfer)
    function addOwner(
        string memory _rfid,
        address _ownerAddress,
        string memory _ownerName
    ) public onlyRegistry {
        require(_ownerAddress != address(0), "Invalid owner address");
        require(bytes(_ownerName).length > 0, "Owner name cannot be empty");

        ownershipHistory[_rfid].push(
            OwnerRecord(_ownerAddress, _ownerName, block.timestamp)
        );

        emit OwnershipTransferred(_rfid, _ownerAddress, _ownerName, block.timestamp);
    }

    // Get current owner (most recent)
    function getCurrentOwner(string memory _rfid)
        public
        view
        returns (address, string memory)
    {
        uint256 len = ownershipHistory[_rfid].length;
        require(len > 0, "No owner recorded for this cattle");
        OwnerRecord memory record = ownershipHistory[_rfid][len - 1];
        return (record.ownerAddress, record.ownerName);
    }

    // Get full ownership history
    function getOwnershipHistory(string memory _rfid)
        public
        view
        returns (OwnerRecord[] memory)
    {
        return ownershipHistory[_rfid];
    }

    // Get ownership count (number of transfers)
    function getOwnershipCount(string memory _rfid)
        public
        view
        returns (uint256)
    {
        return ownershipHistory[_rfid].length;
    }

    // Get specific owner record by index
    function getOwnerByIndex(string memory _rfid, uint256 index)
        public
        view
        returns (address, string memory, uint256)
    {
        require(index < ownershipHistory[_rfid].length, "Invalid index");
        OwnerRecord memory record = ownershipHistory[_rfid][index];
        return (record.ownerAddress, record.ownerName, record.timestamp);
    }
}