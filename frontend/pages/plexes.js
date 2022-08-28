import DefaultLayout from '../layouts/DefaultLayout';
import { File, Web3Storage } from 'web3.storage';
import { ethers } from "ethers";
import {
    Button,
    Card,
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

import BondCreator from "../abis/BondCreator.json";

const client = new Web3Storage({ token: process.env.TOKEN });

const Plexes = () => {
    const [plexCount, setPlexCount] = useState(0);
    const [plexes, setPlexes] = useState([]);

    useEffect(() => {
        async function load() {
            const provider = new ethers.providers.JsonRpcProvider('https://proxy.devnet.neonlabs.org/solana');
            const bondCreator = new ethers.Contract("0xf4dF40744B188f4D50a7848d73CDB04f7002e2e4", BondCreator.abi, provider);
            const plexCount = await bondCreator.plexCount();
            setPlexCount(plexCount);
            const plexes = [];
            for(let i=0; i<plexCount; ++i) {
                const plex = await bondCreator.plexes(i);
                plexes.push(plex);
            }
            setPlexes(plexes);
        }
        load();
    }, [plexCount]);

    const purchaseBond = async (daoId) => {
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
                const plexData = plexes[daoId];
                const blob = new Blob([JSON.stringify(plexData)], { type: 'application/json' });
                const files = [new File([blob], 'data.json')];
                const cid = await client.put(files);
                await bondCreator.connect(signer).joinDAOplex(plexData.dao, cid);
            } catch (error) {
                console.error(error);
            }
          } else {
              alert('MetaMask wallet not detected. Please consider installing it: https://metamask.io/download.html');
          } 
    };

    return(
        <DefaultLayout>
            <h1 className="text-xl align-middle">View Plexes of DAOs</h1>
            <h2 className="text-xl align-middle">Purchase Plex Bond NFTs</h2>
            <br/><br/>
            {plexes.length == 0 &&
                        <div className="st-heading">
                        <h1 >No DAO plexes currently available</h1>
                        </div>
                    }
                      <div>
                        {plexes.map((plex, key) => (
                            <div style={{ width: '18rem' }}>
                                <div>
                                    <div>DAO: {plex.daoname}</div>
                                    <div>DAO token price: {plex.ratePerStablecoin.toString()} USDT<br /><br />
                                    <div>Bond for 100 DAO Tokens</div>
                                    <div>Total amount: {(plex.ratePerStablecoin*100).toString()} USDT</div>
                                        Expiry Date: {(new Date(parseInt(plex.expiry.toString()))).toString()}
                                        <Button
                                            type="submit"
                                            bg="twitter.500"
                                            className="mt-[20px] w-full"
                                        >
                                            Purchase Bond
                                        </Button>
                                    </div>
                                </div>
                            </div>
                                
                        ))
                        }
                        </div>
        </DefaultLayout>
    );
}

export default Plexes;