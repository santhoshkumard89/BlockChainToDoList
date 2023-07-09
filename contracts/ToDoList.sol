// SPDX-License-Identifier:UnDefined

pragma solidity 0.8.19;

contract ToDoList{

    enum listFlag {
        NotDone,
        Done
    }

    struct Note{
        string Description;
        listFlag flag;
    }

    mapping(uint => Note) MList;

    mapping(address => mapping(uint => Note)) public ToDo;

    mapping(address => uint) public counter;

    event ToDoLog(uint _index, address indexed _sender, string _description, listFlag _flag, string _log);

    function setList(string memory _description) public{

        require(bytes(_description).length > 0,"Description is Empty");

        ToDo[msg.sender][counter[msg.sender]].Description = _description;
        ToDo[msg.sender][counter[msg.sender]].flag = listFlag.NotDone;

        emit ToDoLog(
            counter[msg.sender], 
            msg.sender, 
            ToDo[msg.sender][counter[msg.sender]].Description, 
            listFlag.NotDone, 
            "Inserted a Do"
        );
        
        counter[msg.sender] += 1;
    }

    function updateNoteDesc(uint _index, string memory _description) public{

        require(counter[msg.sender] > _index,"No proper Index range");
        require(bytes(_description).length > 0,"Description is Empty");

        ToDo[msg.sender][_index].Description = _description;

        emit ToDoLog(
            _index, 
            msg.sender, 
            ToDo[msg.sender][_index].Description,
            ToDo[msg.sender][_index].flag, 
            "Updated Description"
        );
    }
    
    function updateNoteFlag(uint _index, listFlag _listFlag) public{

        require(counter[msg.sender] > _index,"No proper Index range");
        require(listFlag.Done >= _listFlag,"No proper Index Enum range");

        ToDo[msg.sender][_index].flag = _listFlag;

        emit ToDoLog(
            _index, 
            msg.sender, 
            ToDo[msg.sender][_index].Description,
            ToDo[msg.sender][_index].flag, 
            "Updated Flag"
        );
    }

}