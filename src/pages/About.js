import React, { useState , useEffect , useCallback , useRef } from 'react';
import Web3 from 'web3';
import ERC20ABI from '../build/contracts/ERC20';
import getWeb3 from '../getWeb3';
import StickyHeadTable from '../pages/components/AboutList';
const About = () => {

    const[web3 , setWeb3] = useState(undefined);
    const[accounts , setAccounts] = useState("");
    const[contract , setContract] = useState("");
    const [balance , setBalance] = useState("");
    const [token , setToken] = useState("");
    const [to , setTo] = useState("");
    const [value , setValue] = useState("");  
    const inputAccountRef = useRef("");
    const inputValueRef = useRef("");
    const inputRockValueRef = useRef("");
    const [transactionDetail , setTransactionDetail] = useState([]);
    // init web3 , contract , metamask accounts
    const settingWeb3 =  useCallback( async()=>{
        let web3 = null;
        let account=null;
        let networkId=null;
        let deployedNetwork=null;
        let contract=null;
        try {
            // Get network provider and web3 instance.
            if (window.ethereum || window.web3 ) {
                web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
                account = await web3.eth.getAccounts();
                // Get the contract instance.
                networkId = await web3.eth.net.getId();
                deployedNetwork = ERC20ABI.networks[networkId];
    
                contract = new web3.eth.Contract(
                  ERC20ABI.abi,
                  deployedNetwork && deployedNetwork.address,
                );

                // Set web3, accounts, and contract to the state, and then proceed with an
                // example of interacting with the contract's methods.
                
                setBalance(Web3.utils.fromWei(await web3.eth.getBalance(account[0]), 'ether'));
                setToken(await contract.methods.balanceOf(account[0]).call());
                setWeb3(web3);
                setAccounts(account[0]);
                setContract(contract);
            } 
            else{
                web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
            }
          } catch (error) {
            // Catch any errors for any of the above operations.
            console.log(error);
        }
        window.ethereum.on('accountsChanged' , async(accounts)=>{
            console.log('accountsChanged' , accounts[0]);
            setBalance(Web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether'));
            setToken(await contract.methods.balanceOf(accounts[0]).call())
            setAccounts(accounts[0]);
        })

    },[window.ethereum]);

    useEffect ( () =>{
          settingWeb3();
    },[settingWeb3])
    
    const handleTransfer = async()=>{
        if(inputAccountRef.current.value!=="" && inputValueRef.current.value !==""){

            const result = await web3.eth.sendTransaction({
                from: accounts,
                to: inputAccountRef.current.value,
                value: web3.utils.toWei(inputValueRef.current.value.toString() , 'ether')
            })

            const timeStamp = await web3.eth.getBlock(result.blockNumber , "latest");
            setBalance(Web3.utils.fromWei(await web3.eth.getBalance(accounts), 'ether'));
            setTransactionDetail(previous=>[...previous,{
                
                BlockNumber : result.blockNumber,
                TransactionHash : result.transactionHash,
                TimeStamp : timeStamp.timestamp,
                Value : inputValueRef.current.value  + "ETH",
                From : accounts,
                To:inputAccountRef.current.value
            }]);
        }

        else if (inputAccountRef.current.value !=="" && inputRockValueRef.current.value !==""){
            const result = await contract.methods.transfer(inputAccountRef.current.value , inputRockValueRef.current.value)
                            .send({from : accounts});

            const timeStamp = await web3.eth.getBlock(result.blockNumber , "latest");
              setToken(await contract.methods.balanceOf(accounts).call());
              setTransactionDetail(previous=>[...previous,{
                    BlockNumber : result.blockNumber,
                    TransactionHash : result.transactionHash,
                    TimeStamp : timeStamp.timestamp,
                    Value : inputRockValueRef.current.value + " Rock Token" , 
                    From : accounts,
                    To:inputAccountRef.current.value
              }]);
        }

        else{
            alert('Check input value');
        }

        inputAccountRef.current.value = "";
        inputValueRef.current.value = "";
        inputRockValueRef.current.value = "";
    }

    return (
        <div style={{minHeight:'100vh'}}>
            <div style={{textAlign:'center'}}>
                <div style={{ margin : '3rem' ,fontSize: '1.5rem'}}>

                    <label>  Ethereum Account : {accounts} </label>
                    <br />
                    <label> ETH Balance : {balance} 顆</label>
                    <br />
                    <label>Rock Token : {token} 顆 </label>
                </div>
        
                <div style={{marginTop : '1rem' }}>
                    <label style={{margin: '1rem'}}>
                        To :  <input type="text"  placeholder="Account"  ref = {inputAccountRef} />
                    </label>
                    <label style={{margin: '1rem'}}>
                        Amount :   <input type="text"  placeholder="Transfer ETH Amount"  ref = {inputValueRef} />
                    </label>

                    <label style={{margin: '1rem'}}>
                        Amount :   <input type="text"  placeholder="Transfer Rock Token Amount"  ref = {inputRockValueRef} />
                    </label>
                    <button onClick={handleTransfer}>Submit</button>
                </div>


               
            </div>
            
            <div style={{marginTop : '3rem'}}>
                <StickyHeadTable transactionDetail={transactionDetail}/>
            </div>
        </div>

        
    )
}

export default About
