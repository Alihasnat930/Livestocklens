// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CattleRegistry {
    enum Gender { Male, Female, Calf }

    struct Heritage {
        string fatherRfid;
        string motherRfid;
        string certification;
        bool exists;
    }

    struct Vaccination {
        string vaccineName;
        uint256 vaccinationDate;
        uint256 recordedAt;
    }

    struct OwnerRecord {
        string ownerCNIC;
        string ownerName;
        uint256 timestamp;
    }

    struct Cattle {
        string rfid;
        string breed;
        Gender gender;
        uint256 registrationTimestamp;
        string currentOwnerCNIC;
        string currentOwnerName;
        bool exists;
    }

    // Mappings
    mapping(string => Cattle) private cattleRecords;
    mapping(string => Heritage) private heritageRecords;
    mapping(string => Vaccination[]) private vaccinationRecords;
    mapping(string => OwnerRecord[]) private ownershipHistory;
    
    // 🔥 NEW: Store transaction hashes on-chain
    mapping(string => string) private registrationTxHashes;
    mapping(string => string) private heritageTxHashes;
    mapping(string => string[]) private vaccinationTxHashes;
    mapping(string => string[]) private ownershipTxHashes;
    
    address public admin;

    // Events
    event CattleRegistered(
        string rfid,
        string breed,
        uint8 gender,
        string ownerCNIC,
        string ownerName,
        uint256 timestamp
    );

    event VaccinationAdded(
        string rfid,
        string vaccineName,
        uint256 vaccinationDate,
        uint256 timestamp
    );

    event OwnershipTransferred(
        string rfid,
        string newOwnerCNIC,
        string newOwnerName,
        uint256 timestamp
    );

    event HeritageSet(
        string rfid,
        string fatherRfid,
        string motherRfid,
        string certification,
        uint256 timestamp
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier cattleExists(string memory _rfid) {
        require(cattleRecords[_rfid].exists, "Cattle not found");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerCattle(
        string memory _rfid,
        string memory _breed,
        uint8 _gender,
        string memory _ownerCNIC,
        string memory _ownerName
    ) public onlyAdmin {
        require(!cattleRecords[_rfid].exists, "Already registered");
        require(bytes(_ownerCNIC).length > 0, "Invalid CNIC");
        require(bytes(_ownerName).length > 0, "Invalid owner name");
        require(bytes(_rfid).length > 0, "Invalid RFID");
        require(_gender <= 2, "Invalid gender");

        cattleRecords[_rfid] = Cattle(
            _rfid,
            _breed,
            Gender(_gender),
            block.timestamp,
            _ownerCNIC,
            _ownerName,
            true
        );

        ownershipHistory[_rfid].push(OwnerRecord(_ownerCNIC, _ownerName, block.timestamp));

        emit CattleRegistered(_rfid, _breed, _gender, _ownerCNIC, _ownerName, block.timestamp);
    }

    function addVaccination(
        string memory _rfid,
        string memory _vaccineName,
        uint256 _vaccinationDate
    ) public onlyAdmin cattleExists(_rfid) {
        require(bytes(_vaccineName).length > 0, "Invalid vaccine name");

        vaccinationRecords[_rfid].push(
            Vaccination(_vaccineName, _vaccinationDate, block.timestamp)
        );

        emit VaccinationAdded(_rfid, _vaccineName, _vaccinationDate, block.timestamp);
    }

    function setHeritage(
        string memory _rfid,
        string memory _fatherRfid,
        string memory _motherRfid,
        string memory _certification
    ) public onlyAdmin cattleExists(_rfid) {
        heritageRecords[_rfid] = Heritage(
            _fatherRfid,
            _motherRfid,
            _certification,
            true
        );

        emit HeritageSet(_rfid, _fatherRfid, _motherRfid, _certification, block.timestamp);
    }

    function transferOwnership(
        string memory _rfid,
        string memory _newOwnerCNIC,
        string memory _newOwnerName
    ) public onlyAdmin cattleExists(_rfid) {
        require(bytes(_newOwnerCNIC).length > 0, "Invalid CNIC");
        require(bytes(_newOwnerName).length > 0, "Invalid owner name");

        cattleRecords[_rfid].currentOwnerCNIC = _newOwnerCNIC;
        cattleRecords[_rfid].currentOwnerName = _newOwnerName;
        ownershipHistory[_rfid].push(OwnerRecord(_newOwnerCNIC, _newOwnerName, block.timestamp));

        emit OwnershipTransferred(_rfid, _newOwnerCNIC, _newOwnerName, block.timestamp);
    }

    // 🔥 NEW: Functions to store TX hashes on-chain
    function saveRegistrationTxHash(string memory _rfid, string memory _txHash) public onlyAdmin cattleExists(_rfid) {
        registrationTxHashes[_rfid] = _txHash;
    }

    function saveHeritageTxHash(string memory _rfid, string memory _txHash) public onlyAdmin cattleExists(_rfid) {
        heritageTxHashes[_rfid] = _txHash;
    }

    function saveVaccinationTxHash(string memory _rfid, string memory _txHash) public onlyAdmin cattleExists(_rfid) {
        vaccinationTxHashes[_rfid].push(_txHash);
    }

    function saveOwnershipTxHash(string memory _rfid, string memory _txHash) public onlyAdmin cattleExists(_rfid) {
        ownershipTxHashes[_rfid].push(_txHash);
    }

    // 🔥 NEW: Getters for TX hashes
    function getRegistrationTxHash(string memory _rfid) public view returns (string memory) {
        return registrationTxHashes[_rfid];
    }

    function getHeritageTxHash(string memory _rfid) public view returns (string memory) {
        return heritageTxHashes[_rfid];
    }

    function getVaccinationTxHashes(string memory _rfid) public view returns (string[] memory) {
        return vaccinationTxHashes[_rfid];
    }

    function getOwnershipTxHashes(string memory _rfid) public view returns (string[] memory) {
        return ownershipTxHashes[_rfid];
    }

    // Original getters
    function getCattle(string memory _rfid)
        public
        view
        cattleExists(_rfid)
        returns (Cattle memory)
    {
        return cattleRecords[_rfid];
    }

    function getVaccinations(string memory _rfid)
        public
        view
        cattleExists(_rfid)
        returns (Vaccination[] memory)
    {
        return vaccinationRecords[_rfid];
    }

    function getOwnershipHistory(string memory _rfid)
        public
        view
        cattleExists(_rfid)
        returns (OwnerRecord[] memory)
    {
        return ownershipHistory[_rfid];
    }

    function getHeritage(string memory _rfid)
        public
        view
        returns (Heritage memory)
    {
        return heritageRecords[_rfid];
    }

    function isCattleRegistered(string memory _rfid)
        public
        view
        returns (bool)
    {
        return cattleRecords[_rfid].exists;
    }
}