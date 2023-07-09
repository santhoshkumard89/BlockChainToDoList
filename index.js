
// ==============================================================================

const express = require("express");
const app = express();

app.set('view engine', 'ejs');

const { Web3 } = require('web3');
let web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
const contractJson = require("./build/contracts/ToDoList.json")
var contract = new web3.eth.Contract(contractJson.abi,contractJson.networks[20230702].address);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

var accounts;

// ==============================================================================

app.get("/",async (req,res)=>{
    await web3.eth.getAccounts().then((result)=>{
        accounts = result;
    });

    res.render('getAccounts',{accounts: accounts});
});

// ==============================================================================

app.post("/ToDo", async (req, res)=>{
    console.log(req.body);
    var sender = req.body.acc;
    var description = req.body.descr;
    var index = req.body.index;
    var flag = req.body.flag;

    console.log(!index);
    console.log(description);

    if (!index && description){
        console.log("A");
        await contract.methods.setList(description)
        .send({from:sender})
        .then((result)=>{
            console.log(result);
        })

    }

    if (index && description){
        console.log("B");

        await contract.methods.updateNoteDesc(index, description)
        .send({from:sender})
        .then((result)=>{
            console.log(result);
        })

    }

    if (index && flag){
        console.log("C");

        await contract.methods.updateNoteFlag(index, flag)
        .send({from:sender})
        .then((result)=>{
            console.log(result);
        })

    }

    res.send("Insert Success!");
    
})

// ==============================================================================

app.get("/ToDo",async (req,res)=>{
    var sender = req.query.acc;
    var evts = [];
    
    await contract.getPastEvents("ToDoLog",{
        filter: {_sender: sender},
        fromBlock: 0,
        toBlock: 'latest'
    })
    .then(function(events){
        evts = cleanEvents(events);
    })
    // console.log(sender);
    // console.log(evts);

    res.render('updateLists',{evts: evts, acc: sender});
    
});

function cleanEvents(evts){
    var events_array = [];
    var events_index = [];
    for(let i=0;i<evts.length;i++){
        var events_dict = {};
        events_dict["_index"] = evts[i].returnValues._index;
        events_dict["_sender"] = evts[i].returnValues._sender;
        events_dict["_description"] = evts[i].returnValues._description;
        events_dict["_flag"] = evts[i].returnValues._flag;
        events_dict["_log"] = evts[i].returnValues._log;

        if(events_index.includes(events_dict["_index"])){
            events_array.splice(Number(events_dict["_index"]),1,events_dict);
        }
        else{
            events_index.push(events_dict["_index"]);
            events_array.push(events_dict);
        }
        
    }
    
    // console.log(events_array1);
    return events_array;
};

// ==============================================================================

app.get("/ToDo/Log",async (req,res)=>{
    // console.log(req.query);
    var sender = req.query.acc;
    var evts = [];
    
    await contract.getPastEvents("ToDoLog",{
        filter: {_sender: sender},
        fromBlock: 0,
        toBlock: 'latest'
    })
    .then(function(events){
        evts = cleanEventsLog(events);
    })
    // console.log(sender);
    // console.log(evts);

    res.render('updateListsLog',{evts: evts});
    
});

function cleanEventsLog(evts){
    var events_array = [];
    for(let i=0;i<evts.length;i++){
        var events_dict = {};
        events_dict["_index"] = evts[i].returnValues._index;
        events_dict["_sender"] = evts[i].returnValues._sender;
        events_dict["_description"] = evts[i].returnValues._description;
        events_dict["_flag"] = evts[i].returnValues._flag;
        events_dict["_log"] = evts[i].returnValues._log;
        // console.log(events_dict);
        events_array.push(events_dict);
    }
    // console.log(events_array);
    return events_array;
};

// ==============================================================================

app.listen(3000,()=>{
    console.log("Node started success!");
});

// ==============================================================================