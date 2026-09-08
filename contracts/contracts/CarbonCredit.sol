// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CarbonCredit is ERC1155, Ownable {
    uint256 public currentTokenId;

    // Mapping from token ID to total supply minted
    mapping(uint256 => uint256) public totalSupply;
    
    // Mapping from token ID to metadata URI
    mapping(uint256 => string) private _tokenURIs;

    event CreditMinted(uint256 indexed tokenId, address indexed org, uint256 amount);
    event CreditRetired(uint256 indexed tokenId, address indexed by, uint256 amount);

    constructor() ERC1155("") Ownable(msg.sender) {
        currentTokenId = 0;
    }

    function mintCredit(address org, uint256 amount, string memory metadataURI) external onlyOwner returns (uint256) {
        currentTokenId++;
        uint256 newItemId = currentTokenId;
        
        _mint(org, newItemId, amount, "");
        _tokenURIs[newItemId] = metadataURI;
        totalSupply[newItemId] += amount;
        
        emit CreditMinted(newItemId, org, amount);
        return newItemId;
    }

    function retireCredit(uint256 tokenId, uint256 amount) external {
        require(balanceOf(msg.sender, tokenId) >= amount, "Insufficient balance to retire");
        _burn(msg.sender, tokenId, amount);
        totalSupply[tokenId] -= amount;
        
        emit CreditRetired(tokenId, msg.sender, amount);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
