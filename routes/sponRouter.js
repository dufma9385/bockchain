const express=require('express');
const router=express.Router();

const Sponsor = require( "../truffle/build/contracts/Sponsor.json");
const Web3= require( "web3");
let web3=new Web3();
let accounts=null;
let contract =null;

router.post('/add',async(req,res)=>{    
    try {
        web3.setProvider(new Web3.providers.HttpProvider('http://localhost:7545'));
        accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Sponsor.networks[networkId];
        contract = new web3.eth.Contract(
            Sponsor.abi,
            deployedNetwork && deployedNetwork.address,
        );

        let amount=parseInt(req.body.amount,10);
        
        console.log(req.body.address);
        console.log(req.body.amount,amount);

        await web3.eth.sendTransaction({
            from: '0xBA939c702F515946c7F32A6b8F2d991Ed36f979C',
            to: req.body.address,
            value: amount
        })

        await contract.methods.add(amount).send({ from: accounts[0] });
        const total= await contract.methods.get().call();
        res.send({ msg: total });
    } catch (error) {
        console.error(error);
        res.send({ msg: error.message });
    }

});


module.exports = router;