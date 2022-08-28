// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IBondContract {
    function safeMint(address to, string memory uri) external;
    function burn(uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract BondCreator is Ownable {
    IBondContract NFT_Contract;

    struct PlexData {
        uint8 ratePerStablecoin;
        uint8 amountSold;
        uint256 expiry;
        address dao;
        address daotoken;
        address stablecoin;
        string daoname;
    }

    struct BondNFT {
        address owner;
        PlexData plexData;
    }

    uint256 public nftCount;
    uint256 public plexCount;

    mapping(uint => BondNFT) public bondNFTs;
    mapping(uint => PlexData) public plexes;
    mapping(address => PlexData) public DAOPlexes;
    mapping(address => mapping(address => uint)) public userAmountOfPlex;

    function setNFTContract(IBondContract NFT_Contract_) external onlyOwner {
        NFT_Contract = NFT_Contract_;
    }

    function joinDAOplex(PlexData calldata _newPlex) external {
        DAOPlexes[_newPlex.dao] = _newPlex;
        plexes[plexCount] = _newPlex;
        IERC20(_newPlex.daotoken).approve(address(this), 100000 ether);
        plexCount += 1;
    }

    function purchaseBondNFT(address dao, string memory uri) external {
        require(DAOPlexes[dao].amountSold < 100, "Sold out");
        DAOPlexes[dao].amountSold += 1;
        IERC20(DAOPlexes[dao].stablecoin).transferFrom(msg.sender, dao, 100 ether / DAOPlexes[dao].ratePerStablecoin);
        bondNFTs[nftCount] = BondNFT(msg.sender, DAOPlexes[dao]);
        NFT_Contract.safeMint(msg.sender, uri);
        nftCount += 1; 
    }

    function redeemBondForTokens(uint256 tokenId) external {
        require(bondNFTs[tokenId].plexData.expiry > block.timestamp, "Bond expired");
        require(userAmountOfPlex[bondNFTs[tokenId].plexData.dao][msg.sender] > 0, "No bonds owned");
        IERC20(bondNFTs[tokenId].plexData.daotoken).transferFrom(bondNFTs[tokenId].plexData.dao, msg.sender, 100 ether);
        NFT_Contract.burn(tokenId);
    }
}