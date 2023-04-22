// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrowdFunding is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("SoulBoundToken", "SBT") {}
    // below is dataType for any campaign which initiates on site
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 private netRevenue;

    function checkNetRevenue() public returns (uint256) {}

    uint256 public numberOfCampaigns = 0;
    /* any parameter for a specific function is 
    going to have an underscore before the param name
    
    campaigns is an array having values of Campaign dataType */

    function getSecretVariable(uint256 verificationCode) public view returns (uint256) {
        require(verificationCode == 123456, "Invalid verification code");
        return netRevenue;
    }
    
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        // variable generated from a dataType needs to have struct/schema of that type
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(campaign.deadline < block.timestamp, 'The deadline needs to be set somewhere in future ! &#128572;');

        campaign.owner=_owner;
        campaign.title=_title;
        campaign.description=_description;
        campaign.target=_target;
        campaign.deadline=_deadline;
        campaign.image=_image;
        campaign.amountCollected=0;

        numberOfCampaigns++;
        return (numberOfCampaigns - 1);
    }

    function donateToCampaign(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];
        uint256 amount = msg.value;
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
    
        uint256 ownerAmount = (amount * 97) / 100;
        uint256 revenueAmount = (amount * 3) / 100;
    
        (bool sentOwner, ) = payable(campaign.owner).call{value: ownerAmount}('');
        if (sentOwner) {
            campaign.amountCollected += ownerAmount;
            safeMint(msg.sender);
        }
        (bool sentDonation, ) = payable(0xFC6E29BDF0A5fC0E263Aa0D0325DbE7A4a650ee8).call{value: revenueAmount}('');
        if (sentDonation) {
            netRevenue += revenueAmount;
        }
    }


    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        // lhs: provides keys || rhs: provides values
        /* 
        Campaign storage campaign = campaigns[_id];
        return (campaign.donators, campaign.donations); */
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        /* rhs: sets an empty array of like [{}, {}, {}, {}, {}, {}, {}, {}, {},] 
        so allCampaigns has schema of Campaign[] and the value like on rhs empty all */
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            // create struct/schema + values
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only the owner of the token can burn it.");
        _burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256) pure internal {
        require(from == address(0) || to == address(0), "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner.");
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }
}
