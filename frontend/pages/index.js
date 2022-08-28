import {
  Button,
  FormLabel,
  Input,
  Select,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import {
  FormEventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";

import DefaultLayout from "../layouts/DefaultLayout";
import { ethers } from "ethers";
import BondCreator from "../abis/BondCreator.json";

const Home = () => {
  const [DAOName, setDAOName] = useState("");
  const [DAOTokenAddress, setDAOTokenAddress] = useState("");
  const [DAOTokenAmount, setDAOTokenAmount] = useState("");
  const [DAOTokenPrice, setDAOTokenPrice] = useState("");
  const [deadlineOfVote, setDeadlineOfVote] = useState("");
  const [stableCoin, setStableCoin] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeof window.ethereum !== 'undefined') {
      try {
          await window?.ethereum?.enable();
          await window?.ethereum?.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x' + (245022926).toString(16) }],
          });
          const provider = new ethers.providers.Web3Provider(window?.ethereum);
          const signer = provider?.getSigner();
          const usdt = "0x0a5bd0108227b3dfec64199d6939841eecf47a8e";
          const bondCreator = new ethers.Contract("0xf4dF40744B188f4D50a7848d73CDB04f7002e2e4", BondCreator.abi,provider);
          const address = await signer.getAddress();
          const plexData = {
            ratePerStablecoin: DAOTokenPrice,
            amountSold: 0,
            expiry: Date.parse(deadlineOfVote)/1000,
            dao: address,
            daotoken: DAOTokenAddress,
            stablecoin: usdt,
            daoname: DAOName
          };
          await bondCreator.connect(signer).joinDAOplex(plexData);
      } catch (error) {
          console.error(error);
      }
    } else {
        alert('MetaMask wallet not detected. Please consider installing it: https://metamask.io/download.html');
    }  
  };

  return (
    <DefaultLayout>
      <div className="min-h-[90vh] flex justify-center items-center max-w-[500px] w-full mx-auto my-[50px]">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-[50px] rounded w-full"
        >
          <h2 className="text-center font-semibold text-2xl mb-[20px]">
            Create a Plex
          </h2>
          <FormLabel className="mt-[10px]" htmlFor="daoName">
            DAO Name
          </FormLabel>
          <Input
            id="daoName"
            type="text"
            value={DAOName}
            onChange={(e) => setDAOName(e.target.value)}
            placeholder="Enter the name of your DAO"
            required
          />
          <FormLabel className="mt-[10px]" htmlFor="daoTokenAddress">
            DAO Token Address
          </FormLabel>
          <Input
            id="daoTokenAddress"
            type="text"
            value={DAOTokenAddress}
            placeholder="Enter the address of you DAO token contract"
            onChange={(e) => setDAOTokenAddress(e.target.value)}
            required
          />
          <FormLabel className="mt-[10px]" htmlFor="daoTokenAmount">
            DAO Token Amount
          </FormLabel>
          <Input
            id="daoTokenAmount"
            type="text"
            placeholder="Enter amount of DAO tokens to lock-in"
            value={DAOTokenAmount}
            onChange={(e) => setDAOTokenAmount(e.target.value)}
            required
          />
          <FormLabel className="mt-[10px]" htmlFor="daoTokenPrice">
            DAO Token Price
          </FormLabel>
          <Input
            id="daoTokenAmount"
            type="text"
            placeholder="Enter current price of DAO token"
            value={DAOTokenPrice}
            onChange={(e) => setDAOTokenPrice(e.target.value)}
            required
          />
          <FormLabel className="mt-[10px]" htmlFor="stableCoin">
            Choose stablecoin
          </FormLabel>
          <Select
            placeholder="Select the stablecoin"
            onChange={(e) => setStableCoin(e.target.value)}
            required
          >
            <option value="USDT">USDT</option>
          </Select>
          <FormLabel className="mt-[10px]" htmlFor="deadline">
            Deadline of Bond
          </FormLabel>
          <Input
            id="deadline"
            placeholder="Select the deadline of the Bond NFT"
            type="date"
            min={(new Date()).toISOString().substring(0, 10)}
            value={deadlineOfVote}
            onChange={(e) => setDeadlineOfVote(e.target.value)}
            required
          />
          
          <br/><br/>
          <Button
            isLoading={loading}
            loadingText="Creating..."
            type="submit"
            bg="twitter.500"
            className="mt-[20px] w-full"
          >
            Create DAO Plex
          </Button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default Home;
