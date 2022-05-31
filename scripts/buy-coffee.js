const hre = require("hardhat");

async function getBalance(address){
        const balance = await hre.waffle.provider.getBalance(address);
        return hre.ethers.utils.formatEther(balance);
    }

async function printBalances(addresses){
        let idx = 0;
        for(const address of addresses){
            console.log(`Address ${idx} balance: `,await getBalance(address));
            idx ++;
        }
    }

async function printMemos(memos){
        for(const memo of memos){
            const timestamp = memo.timestamp;
            const tipper = memo.from;
            const tippername = memo.name;
            const message = memo.message;
            console.log(`At ${timestamp}, ${tippername}(${tipper}) said : ${message}`);
        }
    }

async function main(){
        const [owner,tipper1,tipper2,tipper3] = await hre.ethers.getSigners();

        const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
        const buyMeACoffee = await BuyMeACoffee.deploy();

        await buyMeACoffee.deployed();
        console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);

        const addresses = [owner.address, tipper1.address, buyMeACoffee.address];

        console.log("=== Start ===");
        await printBalances(addresses);

        const tip = {value: hre.ethers.utils.parseEther("1")};
        await buyMeACoffee.connect(tipper1).buyCoffee("Ajith", "Hi bitch!", tip);
        await buyMeACoffee.connect(tipper2).buyCoffee("Viki", "LMAO", tip);
        await buyMeACoffee.connect(tipper3).buyCoffee("Aashiq", "Hi da!", tip);


        console.log("=== After Coffee ===");
        await printBalances(addresses);

        console.log("=== Memos ===");
        const memos = await buyMeACoffee.getMemos();
        printMemos(memos);
    }

main()
.then(()=> process.exit(0))
.catch((error)=> {
    console.log(error);
    process.exit(1);}
    )