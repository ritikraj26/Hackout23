// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CryptoLancerContract {
    address public owner;
    uint256[] public milestones;
    uint256 public curMilestone;
    address public curAssignee;
    bool public projectActive;

    constructor(uint256[] memory _milestones) {
        owner = msg.sender; // The sender of the deployment transaction becomes the owner
        milestones = _milestones;
        curMilestone = 0;
        projectActive = true;
    }

    receive() external payable {}

    // * fallback function
    fallback() external payable {}

    function addBudgetToContract() external payable {
        // The contract should accept and store additional funds sent by the owner.
        require(msg.sender == owner, "Only the owner can send additional funds");
    }

    function add_first_assignee(address _assignee) public {
        require(msg.sender == owner, "Only the owner can assign the first freelancer");
        curAssignee = _assignee;
    }

    function mark_milestone_as_complete() public {
        require(msg.sender == owner, "Only the owner can mark a milestone as complete");
        require(projectActive, "Project is not active");
        require(curMilestone < milestones.length, "All milestones are already completed");
        
        uint256 milestonePayment = milestones[curMilestone];
        curMilestone++;
        require(address(this).balance >= milestonePayment, "Insufficient funds in the contract");
        payable(curAssignee).transfer(milestonePayment);
    }

    function change_assignee(address _newAssignee) public payable {
        require(msg.sender == owner, "Only the owner can change the assignee");
        require(projectActive, "Project is not active");
        require(curMilestone < milestones.length, "All milestones are already completed");

        uint256 milestonePayment = (milestones[curMilestone] * 10) / 100;
        require(msg.value >= milestonePayment, "Insufficient payment to change assignee");
        require(address(this).balance >= milestonePayment, "Insufficient funds in the contract");

        payable(curAssignee).transfer(milestonePayment);
        curAssignee = _newAssignee;
    }

    function remove_project_with_no_assignee() public {
        require(msg.sender == owner, "Only the owner can remove the project");
        require(curAssignee == address(0), "Assignee is not null, use remove_project_with_assignee");
        projectActive = false;
        // transfer remaining funds to the owner
        payable(owner).transfer(address(this).balance);
    }

    function remove_project_with_assignee() public {
        require(msg.sender == owner, "Only the owner can remove the project");
        require(curAssignee != address(0), "Assignee is null, use remove_project_with_no_assignee");
        require(curMilestone < milestones.length, "All milestones are already completed");

        uint256 milestonePayment = (milestones[curMilestone] * 10) / 100;
        require(address(this).balance >= milestonePayment, "Insufficient funds in the contract");

        payable(curAssignee).transfer(milestonePayment);
        projectActive = false;
        payable(owner).transfer(address(this).balance);
    }

    function getCurAssignee() public view returns (address) {
        return curAssignee;
    }

    function getNoOfMilestonesCompleted() public view returns (uint256) {
        return curMilestone;
    }

    function getLeftFunds() public view returns (uint256) {
        return address(this).balance;
    }
}